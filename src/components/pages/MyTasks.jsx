import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/molecules/TaskCard";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MyTasks = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list or grid
  const [sortBy, setSortBy] = useState("updated"); // updated, priority, dueDate
  const [filters, setFilters] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filters.priority?.length) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }
    if (filters.status?.length) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Apply sorting
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "dueDate":
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      default:
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    setFilteredTasks(filtered);
  }, [tasks, filters, sortBy]);

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.name || "Unknown Project";
  };

  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.color || "#5B47E0";
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "inprogress").length,
      review: tasks.filter(t => t.status === "review").length,
      done: tasks.filter(t => t.status === "done").length,
      overdue: tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== "done";
      }).length
    };
    return stats;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(taskData.Id, taskData);
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (tasksLoading || projectsLoading) {
    return <Loading type="tasks" />;
  }

  if (tasksError) {
    return <Error message={tasksError} />;
  }

  const taskStats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600">
              Manage your personal tasks across all projects
            </p>
          </div>
          
          <Button
            onClick={() => setShowTaskModal(true)}
            icon="Plus"
            className="bg-gradient-to-r from-primary to-secondary"
          >
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <ApperIcon name="CheckSquare" className="h-6 w-6 text-primary" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.todo}</p>
              </div>
              <ApperIcon name="Square" className="h-6 w-6 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.inProgress}</p>
              </div>
              <ApperIcon name="Clock" className="h-6 w-6 text-info" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Review</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.review}</p>
              </div>
              <ApperIcon name="Eye" className="h-6 w-6 text-warning" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Done</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.done}</p>
              </div>
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="updated">Last Updated</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ApperIcon name="List" className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <ApperIcon name="Grid3x3" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <Empty 
            type="tasks" 
            onAction={() => setShowTaskModal(true)}
          />
        ) : (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-4"
          )}>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => handleTaskClick(task)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      </div>
                      <Badge variant={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getProjectColor(task.projectId) }}
                          />
                          <span className="text-sm text-gray-500">
                            {getProjectName(task.projectId)}
                          </span>
                        </div>
                        
                        <Badge variant={task.status === "done" ? "success" : "primary"} size="sm">
                          {task.status === "inprogress" ? "In Progress" : task.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          </div>
                        )}
                        
                        {task.assignee && (
                          <Avatar name={task.assignee} size="sm" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={selectedTask ? handleUpdateTask : handleCreateTask}
        onDelete={handleDeleteTask}
        isEditing={!selectedTask}
        projects={projects}
      />
    </div>
  );
};

export default MyTasks;