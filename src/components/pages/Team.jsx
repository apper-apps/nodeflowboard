import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Team = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    { 
      name: "John Doe", 
      role: "Frontend Developer", 
      email: "john@example.com",
      status: "online",
      avatar: null
    },
    { 
      name: "Jane Smith", 
      role: "UI/UX Designer", 
      email: "jane@example.com",
      status: "busy",
      avatar: null
    },
    { 
      name: "Mike Johnson", 
      role: "Backend Developer", 
      email: "mike@example.com",
      status: "away",
      avatar: null
    },
    { 
      name: "Sarah Wilson", 
      role: "Product Manager", 
      email: "sarah@example.com",
      status: "online",
      avatar: null
    },
    { 
      name: "Alex Chen", 
      role: "DevOps Engineer", 
      email: "alex@example.com",
      status: "offline",
      avatar: null
    },
  ];

  const getMemberTasks = (memberName) => {
    return tasks.filter(task => task.assignee === memberName);
  };

  const getMemberStats = (memberName) => {
    const memberTasks = getMemberTasks(memberName);
    return {
      total: memberTasks.length,
      completed: memberTasks.filter(t => t.status === "done").length,
      inProgress: memberTasks.filter(t => t.status === "inprogress").length,
      pending: memberTasks.filter(t => t.status === "todo").length,
      workload: memberTasks.length > 0 ? (memberTasks.filter(t => t.status !== "done").length / memberTasks.length) * 100 : 0
    };
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.name || "Unknown Project";
  };

  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.Id === parseInt(projectId));
    return project?.color || "#5B47E0";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "away":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return "text-error";
    if (workload >= 50) return "text-warning";
    return "text-success";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              Team
            </h1>
            <p className="text-gray-600">
              Team members and workload distribution
            </p>
          </div>
          
          <Button
            onClick={() => setShowTaskModal(true)}
            icon="Plus"
            className="bg-gradient-to-r from-primary to-secondary"
          >
            Assign Task
          </Button>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-6 w-6 text-primary" />
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
                <p className="text-sm text-gray-600 mb-1">Online</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.status === "online").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-success/10 to-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserCheck" className="h-6 w-6 text-success" />
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
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.filter(t => t.status !== "done").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-info" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-warning/10 to-yellow-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-warning" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Members List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 font-display mb-4">
              Team Members
            </h2>
            
            {teamMembers.map((member, index) => {
              const stats = getMemberStats(member.name);
              return (
                <motion.div
                  key={member.name}
                  className={cn(
                    "bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200",
                    "hover:shadow-md hover:border-primary/20",
                    selectedMember?.name === member.name && "border-primary bg-primary/5"
                  )}
                  onClick={() => setSelectedMember(member)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar name={member.name} size="lg" />
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                          getStatusColor(member.status)
                        )} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Tasks:</span>
                        <Badge variant="primary" size="sm">
                          {stats.total}
                        </Badge>
                      </div>
                      <div className={cn("text-sm font-medium", getWorkloadColor(stats.workload))}>
                        {Math.round(stats.workload)}% workload
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{stats.pending}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-info">{stats.inProgress}</div>
                        <div className="text-xs text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-success">{stats.completed}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Member Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 font-display mb-4">
              {selectedMember ? `${selectedMember.name}'s Tasks` : "Select a team member"}
            </h2>
            
            {selectedMember ? (
              <div className="space-y-4">
                {getMemberTasks(selectedMember.name).length === 0 ? (
                  <Empty 
                    type="tasks" 
                    onAction={() => setShowTaskModal(true)}
                  />
                ) : (
                  <div className="space-y-3">
                    {getMemberTasks(selectedMember.name).map(task => (
                      <div
                        key={task.Id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <Badge variant={task.priority} size="sm">
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getProjectColor(task.projectId) }}
                            />
                            <span className="text-sm text-gray-600">
                              {getProjectName(task.projectId)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={task.status === "done" ? "success" : "primary"} size="sm">
                              {task.status === "inprogress" ? "In Progress" : task.status}
                            </Badge>
                            
                            {task.dueDate && (
                              <span className="text-xs text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select a team member to view their tasks and workload
                </p>
              </div>
            )}
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

export default Team;