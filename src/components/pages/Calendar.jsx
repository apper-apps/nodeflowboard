import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Calendar = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month, week, day

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.name || "Unknown Project";
  };

  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.color || "#5B47E0";
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks
      .filter(task => task.dueDate && new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 10);
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.status === "done") return false;
      return new Date(task.dueDate) < today;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
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

  if (tasksLoading || projectsLoading) {
    return <Loading type="board" />;
  }

  if (tasksError) {
    return <Error message={tasksError} />;
  }

  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              Calendar
            </h1>
            <p className="text-gray-600">
              View schedules and upcoming deadlines
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{upcomingTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-6 w-6 text-info" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{overdueTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-error/10 to-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-error" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.filter(t => {
                    if (!t.dueDate) return false;
                    return isSameMonth(new Date(t.dueDate), currentDate);
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-display">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousMonth}
                  >
                    <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextMonth}
                  >
                    <ApperIcon name="ChevronRight" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(day => {
                  const dayTasks = getTasksForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);
                  
                  return (
                    <motion.div
                      key={day.toString()}
                      className={cn(
                        "min-h-[80px] p-2 border border-gray-100 cursor-pointer transition-all duration-200",
                        isToday && "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary",
                        isSelected && "bg-blue-50 border-blue-300",
                        !isToday && !isSelected && "hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedDate(day)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {format(day, "d")}
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map(task => (
                          <div
                            key={task.Id}
                            className="text-xs p-1 rounded truncate cursor-pointer"
                            style={{ 
                              backgroundColor: `${getProjectColor(task.projectId)}20`,
                              color: getProjectColor(task.projectId)
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task);
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" className="h-5 w-5 text-error" />
                  <span>Overdue Tasks</span>
                </h3>
                
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map(task => (
                    <div
                      key={task.Id}
                      className="p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {getProjectName(task.projectId)}
                          </p>
                        </div>
                        <Badge variant="high" size="sm">
                          {format(new Date(task.dueDate), "MMM d")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <ApperIcon name="Clock" className="h-5 w-5 text-primary" />
                <span>Upcoming Tasks</span>
              </h3>
              
              {upcomingTasks.length === 0 ? (
                <Empty 
                  type="tasks" 
                  onAction={() => setShowTaskModal(true)}
                />
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map(task => (
                    <div
                      key={task.Id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {getProjectName(task.projectId)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.priority} size="sm">
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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

export default Calendar;