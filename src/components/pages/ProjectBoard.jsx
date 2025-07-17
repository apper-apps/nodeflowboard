import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import ColumnConfigModal from '@/components/organisms/ColumnConfigModal'
import { toast } from 'react-toastify'
import columnsService from '@/services/api/columnsService'
import ApperIcon from '@/components/ApperIcon'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import Loading from '@/components/ui/Loading'
import KanbanBoard from '@/components/organisms/KanbanBoard'
import TaskModal from '@/components/organisms/TaskModal'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const ProjectBoard = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  // State management
  const [columns, setColumns] = useState([])
  const [showColumnConfig, setShowColumnConfig] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Data hooks
  const { 
    projects, 
    loading: projectLoading, 
    error: projectError, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects()
  
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasks()
  
  // Find current project
  const project = projects.find(p => p.id === projectId)
  
  // Load columns on mount
  useEffect(() => {
    loadColumns()
  }, [projectId])
  
  const loadColumns = async () => {
    try {
      const columnData = await columnsService.getColumns(projectId)
      setColumns(columnData)
    } catch (error) {
      console.error('Error loading columns:', error)
      toast.error('Failed to load columns')
    }
  }
  
  // Calculate project statistics
  const getProjectStats = () => {
    if (!project || !tasks.length) {
      return { total: 0, highPriority: 0, progress: 0, todo: 0, inProgress: 0, done: 0 }
    }
    
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    const total = projectTasks.length
    const highPriority = projectTasks.filter(task => task.priority === 'high').length
    const completedTasks = projectTasks.filter(task => task.status === 'done').length
    const progress = total > 0 ? (completedTasks / total) * 100 : 0
    
    // Calculate counts for each column
    const stats = { total, highPriority, progress }
    columns.forEach(column => {
      stats[column.id] = projectTasks.filter(task => task.status === column.id).length
    })
    
    return stats
  }
  
  // Task handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }
  
  const handleAddTask = (status = 'todo') => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }
  
  const handleCreateTask = async (taskData) => {
    try {
      const newTaskData = {
        ...taskData,
        projectId,
        status: taskData.status || 'todo',
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await createTask(newTaskData)
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task created successfully')
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    }
  }
  
  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTaskData = {
        ...taskData,
        updatedAt: new Date().toISOString()
      }
      
      await updateTask(taskData.id, updatedTaskData)
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task updated successfully')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }
  
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }
  
  const handleColumnConfigSave = (newColumns) => {
setColumns(newColumns);
    setShowColumnConfig(false);
  }
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
showColumnConfig={showColumnConfig}
        columns={columns}
        onSave={handleColumnConfigSave}
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