import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ tasks = [], columns = [], onTaskUpdate, onTaskClick, onAddTask, onBulkUpdate, onBulkDelete, onBulkMove }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkToolbar, setShowBulkToolbar] = useState(false);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOver(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (columnId) => {
    setDraggedOver(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== columnId) {
      const updatedTask = { ...draggedTask, status: columnId };
      onTaskUpdate(updatedTask);
    }
    
    setDraggedTask(null);
    setDraggedOver(null);
};

  const handleTaskSelection = (taskId, isSelected) => {
    setSelectedTasks(prev => {
      const updated = isSelected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId);
      
      setShowBulkToolbar(updated.length > 0);
      return updated;
    });
  };

  const handleSelectAll = (columnId) => {
    const columnTasks = getTasksByStatus(columnId);
    const allSelected = columnTasks.every(task => selectedTasks.includes(task.Id));
    
    if (allSelected) {
      setSelectedTasks(prev => prev.filter(id => !columnTasks.find(task => task.Id === id)));
    } else {
      setSelectedTasks(prev => [...new Set([...prev, ...columnTasks.map(task => task.Id)])]);
    }
  };

  const clearSelection = () => {
    setSelectedTasks([]);
    setShowBulkToolbar(false);
  };

  const handleBulkMove = async (targetStatus) => {
    if (selectedTasks.length === 0 || !onBulkMove) return;
    
    try {
      await onBulkMove(selectedTasks, targetStatus);
      clearSelection();
    } catch (error) {
      console.error('Bulk move failed:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0 || !onBulkDelete) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
      try {
        await onBulkDelete(selectedTasks);
        clearSelection();
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }
  };

  const handleBulkUpdate = async (updates) => {
    if (selectedTasks.length === 0 || !onBulkUpdate) return;
    
    try {
      await onBulkUpdate(selectedTasks, updates);
      clearSelection();
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  return (
    <div className="h-full overflow-auto">
<div className={cn(
        "grid gap-6 h-full p-6",
        columns.length === 1 && "grid-cols-1",
        columns.length === 2 && "grid-cols-1 md:grid-cols-2",
        columns.length === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns.length >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isDraggedOver = draggedOver === column.id;
          
          return (
            <motion.div
              key={column.id}
              className={cn(
                "bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit min-h-[500px] transition-all duration-200",
                isDraggedOver && "border-primary shadow-md bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
<div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={columnTasks.length > 0 && columnTasks.every(task => selectedTasks.includes(task.Id))}
                    onChange={() => handleSelectAll(column.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <h3 className={cn("font-semibold text-lg font-display", column.color)}>
                    {column.title}
                  </h3>
                  <Badge variant="secondary" size="sm">
                    {columnTasks.length}
                  </Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddTask(column.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
<TaskCard
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedTask?.Id === task.Id}
                        isSelected={selectedTasks.includes(task.Id)}
                        onSelectionChange={(isSelected) => handleTaskSelection(task.Id, isSelected)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {columnTasks.length === 0 && (
                <div className={cn("rounded-lg p-8 text-center border-2 border-dashed border-gray-200", column.bgColor)}>
                  <ApperIcon name="Plus" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Drop tasks here or{" "}
                    <button
                      onClick={() => onAddTask(column.id)}
                      className="text-primary hover:underline"
                    >
                      add new task
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          );
})}
      </div>
      
      {showBulkToolbar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {selectedTasks.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-6 border-l border-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkMove(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="appearance-none bg-transparent border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Move to...</option>
                  {columns.map(column => (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </select>
                <ApperIcon name="ChevronDown" className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkUpdate({ priority: e.target.value });
                      e.target.value = '';
                    }
                  }}
                  className="appearance-none bg-transparent border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Set priority...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <ApperIcon name="ChevronDown" className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
                icon="Trash2"
              >
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default KanbanBoard;