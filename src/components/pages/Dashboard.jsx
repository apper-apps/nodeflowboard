import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import ProjectCard from "@/components/molecules/ProjectCard";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProjectModal from "@/components/organisms/ProjectModal";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, error: projectsError, createProject } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks();
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId.toString());
    const completedTasks = projectTasks.filter(task => task.status === "done");
    return {
      total: projectTasks.length,
      completed: completedTasks.length
    };
  };

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6);
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "inprogress").length,
      review: tasks.filter(t => t.status === "review").length,
      done: tasks.filter(t => t.status === "done").length,
      highPriority: tasks.filter(t => t.priority === "high").length,
      overdue: tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== "done";
      }).length
    };
    return stats;
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.Id}`);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setShowProjectModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
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

  if (projectsLoading || tasksLoading) {
    return <Loading type="board" />;
  }

  if (projectsError || tasksError) {
    return <Error message={projectsError || tasksError} />;
  }

  const taskStats = getTaskStats();
  const recentTasks = getRecentTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowTaskModal(true)}
              icon="Plus"
              variant="outline"
            >
              New Task
            </Button>
            <Button
              onClick={() => setShowProjectModal(true)}
              icon="FolderPlus"
              className="bg-gradient-to-r from-primary to-secondary"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-primary" />
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
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{taskStats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-info" />
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
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{taskStats.done}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-success/10 to-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
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
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">{taskStats.highPriority}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-error/10 to-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-error" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Projects
            </h2>
            <Button
              onClick={() => setShowProjectModal(true)}
              icon="Plus"
              variant="outline"
              size="sm"
            >
              Add Project
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <Empty 
              type="projects" 
              onAction={() => setShowProjectModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const stats = getProjectStats(project.Id);
                return (
                  <motion.div
                    key={project.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProjectCard
                      project={project}
                      tasksCount={stats.total}
                      completedTasks={stats.completed}
                      onClick={() => handleProjectClick(project)}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Recent Tasks
            </h2>
            <Button
              onClick={() => navigate("/tasks")}
              icon="ArrowRight"
              variant="outline"
              size="sm"
            >
              View All
            </Button>
          </div>
          
          {recentTasks.length === 0 ? (
            <Empty 
              type="tasks" 
              onAction={() => setShowTaskModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleCreateProject}
      />

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

export default Dashboard;