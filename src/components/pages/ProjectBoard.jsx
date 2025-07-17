import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import ColumnConfigModal from "@/components/organisms/ColumnConfigModal";
import { toast } from "react-toastify";
import columnsService from "@/services/api/columnsService";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskModal from "@/components/organisms/TaskModal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectById, loading: projectLoading, error: projectError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks(projectId);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState([]);
  const [showColumnConfig, setShowColumnConfig] = useState(false);

useEffect(() => {
    const foundProject = getProjectById(projectId);
    if (foundProject) {
      setProject(foundProject);
    } else if (!projectLoading) {
      navigate("/");
    }
  }, [projectId, getProjectById, projectLoading, navigate]);

  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columnData = await columnsService.getColumns();
        setColumns(columnData);
      } catch (error) {
        console.error("Error loading columns:", error);
      }
    };
    loadColumns();
  }, []);

const getProjectStats = () => {
    const stats = {
      total: tasks.length,
      highPriority: tasks.filter(t => t.priority === "high").length,
      progress: 0
    };
    
    // Calculate stats based on current columns
    columns.forEach(column => {
      const columnTasks = tasks.filter(t => t.status === column.id);
      stats[column.id] = columnTasks.length;
    });
    
    // Calculate progress based on last column (assuming it's "done")
    if (columns.length > 0) {
      const lastColumn = columns[columns.length - 1];
      const completedTasks = tasks.filter(t => t.status === lastColumn.id).length;
      stats.progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    }
    
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
}
  };

  const handleColumnConfigSave = (newColumns) => {
    setColumns(newColumns);
    setShowColumnConfig(false);

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
              variant="ghost"
              onClick={() => setShowColumnConfig(true)}
              icon="Settings"
              className="text-gray-600 hover:text-gray-800"
            >
              Configure Columns
            </Button>
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
<div className={cn(
          "mt-4 grid gap-4",
          columns.length === 1 && "grid-cols-1",
          columns.length === 2 && "grid-cols-2",
          columns.length === 3 && "grid-cols-3",
          columns.length >= 4 && "grid-cols-2 md:grid-cols-4"
        )}>
          {columns.map((column) => (
            <div key={column.id} className="text-center">
              <div className={cn("text-2xl font-bold", column.color)}>
                {stats[column.id] || 0}
              </div>
              <div className="text-sm text-gray-600">{column.title}</div>
            </div>
          ))}
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
            columns={columns}
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

      {/* Column Configuration Modal */}
      <ColumnConfigModal
        isOpen={showColumnConfig}
        onClose={() => setShowColumnConfig(false)}
        onSave={handleColumnConfigSave}
      />
    </div>
  );
};

export default ProjectBoard;