import { motion } from "framer-motion";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onClick, 
  onDragStart, 
  onDragEnd, 
  isDragging = false,
  isSelected = false,
  onSelectionChange,
  className = "" 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "default";
    }
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return "text-gray-500";
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-error";
    if (diffDays === 0) return "text-warning";
    if (diffDays <= 2) return "text-warning";
    return "text-gray-500";
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    return format(new Date(dueDate), "MMM d");
  };

return (
    <motion.div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1 hover:border-primary/20",
        isDragging && "opacity-80 rotate-3 shadow-lg",
        isSelected && "ring-2 ring-primary border-primary bg-primary/5",
        className
      )}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectionChange?.(e.target.checked);
            }}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
          />
          <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h4>
        </div>
        <Badge variant={getPriorityColor(task.priority)} size="sm">
          {task.priority}
        </Badge>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="h-3 w-3 text-gray-400" />
              <span className={cn("text-xs", getDueDateColor(task.dueDate))}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar name={task.assignee} size="sm" />
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;