import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectById, loading: projectLoading, error: projectError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks(projectId);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [project, setProject] = useState(null);

  useEffect(() => {
    const foundProject = getProjectById(projectId);
    if (foundProject) {
      setProject(foundProject);
    } else if (!projectLoading) {
      navigate("/");
    }
  }, [projectId, getProjectById, projectLoading, navigate]);

  const getProjectStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "inprogress").length,
      review: tasks.filter(t => t.status === "review").length,
      done: tasks.filter(t => t.status === "done").length,
      highPriority: tasks.filter(t => t.priority === "high").length,
      progress: tasks.length > 0 ? (tasks.filter(t => t.status === "done").length / tasks.length) * 100 : 0
    };
    return stats;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = (status = "todo") => {
    setNewTaskStatus(status);
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTaskData = {
        ...taskData,
        projectId: projectId,
        status: newTaskStatus
      };
      await createTask(newTaskData);
      setShowTaskModal(false);
      setSelectedTask(null);
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(taskData.Id, taskData);
      setShowTaskModal(false);
      setSelectedTask(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (projectLoading || tasksLoading) {
    return <Loading type="board" />;
  }

  if (projectError || tasksError) {
    return <Error message={projectError || tasksError} />;
  }

  if (!project) {
    return <Error message="Project not found" type="notFound" />;
  }

  const stats = getProjectStats();

  return (
    <div className="h-screen bg-gradient-to-br from-background via-surface to-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {project.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="primary" size="sm">
                {stats.total} tasks
              </Badge>
              <Badge variant="success" size="sm">
                {Math.round(stats.progress)}% complete
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleAddTask()}
              icon="Plus"
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Add Task
            </Button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{stats.review}</div>
            <div className="text-sm text-gray-600">Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{stats.done}</div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        {tasks.length === 0 ? (
          <Empty 
            type="board" 
            onAction={() => handleAddTask()}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={handleUpdateTask}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
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
        projects={[project]}
      />
    </div>
  );
};

export default ProjectBoard;