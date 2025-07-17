import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import columnsService from "@/services/api/columnsService";
import { toast } from "react-toastify";

const ColumnConfigModal = ({ isOpen, onClose, onSave }) => {
  const [columns, setColumns] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadColumns = async () => {
        try {
          const data = await columnsService.getColumns();
          setColumns(data);
        } catch (error) {
          console.error("Error loading columns:", error);
          toast.error("Failed to load columns");
        }
      };
      loadColumns();
    }
  }, [isOpen]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOver(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (index) => {
    setDraggedOver(index);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newColumns = [...columns];
      const draggedColumn = newColumns[draggedIndex];
      
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(dropIndex, 0, draggedColumn);
      
      // Update order values
      const reorderedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index + 1
      }));
      
      setColumns(reorderedColumns);
    }
    
    setDraggedIndex(null);
    setDraggedOver(null);
  };

  const handleColumnTitleChange = (index, newTitle) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], title: newTitle };
    setColumns(updatedColumns);
  };

  const handleAddColumn = () => {
    const newColumn = {
      Id: Date.now(),
      id: `column_${Date.now()}`,
      title: `Column ${columns.length + 1}`,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      order: columns.length + 1
    };
    setColumns([...columns, newColumn]);
  };

  const handleRemoveColumn = (index) => {
    if (columns.length <= 1) {
      toast.warning("At least one column is required");
      return;
    }
    
    const updatedColumns = columns.filter((_, i) => i !== index);
    const reorderedColumns = updatedColumns.map((col, i) => ({
      ...col,
      order: i + 1
    }));
    setColumns(reorderedColumns);
  };

  const handleResetToDefaults = async () => {
    try {
      const defaultColumns = await columnsService.resetToDefaults();
      setColumns(defaultColumns);
      toast.success("Columns reset to defaults");
    } catch (error) {
      console.error("Error resetting columns:", error);
      toast.error("Failed to reset columns");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await columnsService.saveColumns(columns);
      onSave(columns);
      onClose();
      toast.success("Column configuration saved successfully");
    } catch (error) {
      console.error("Error saving columns:", error);
      toast.error("Failed to save column configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Configure Columns
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Customize your kanban board by adding, removing, renaming, and reordering columns
            </p>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {columns.map((column, index) => {
                const isDraggedOver = draggedOver === index;
                const isDragging = draggedIndex === index;
                
                return (
                  <motion.div
                    key={column.Id}
                    className={cn(
                      "bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 transition-all duration-200 cursor-move",
                      isDraggedOver && "border-primary bg-primary/5",
                      isDragging && "opacity-50 scale-95"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <ApperIcon name="GripVertical" className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <Input
                          value={column.title}
                          onChange={(e) => handleColumnTitleChange(index, e.target.value)}
                          placeholder="Column title"
                          className="bg-white"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: column.color === "text-gray-700" ? "#374151" : 
                                   column.color === "text-info" ? "#4D96FF" :
                                   column.color === "text-warning" ? "#FFD93D" :
                                   column.color === "text-success" ? "#4ECDC4" : "#374151" }}
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveColumn(index)}
                          className="text-gray-400 hover:text-error"
                          disabled={columns.length <= 1}
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={handleAddColumn}
                icon="Plus"
                className="w-full"
              >
                Add Column
              </Button>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleResetToDefaults}
                className="text-gray-600 hover:text-gray-800"
              >
                Reset to Defaults
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isLoading}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColumnConfigModal;