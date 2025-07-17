import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ tasks = [], onTaskUpdate, onTaskClick, onAddTask }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "text-gray-700", bgColor: "bg-gray-50" },
    { id: "inprogress", title: "In Progress", color: "text-info", bgColor: "bg-blue-50" },
    { id: "review", title: "Review", color: "text-warning", bgColor: "bg-yellow-50" },
    { id: "done", title: "Done", color: "text-success", bgColor: "bg-green-50" },
  ];

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

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full p-6">
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
    </div>
  );
};

export default KanbanBoard;