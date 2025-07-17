import { motion } from "framer-motion";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ProjectCard = ({ project, tasksCount = 0, completedTasks = 0, onClick, className = "" }) => {
  const progress = tasksCount > 0 ? (completedTasks / tasksCount) * 100 : 0;
  
  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-success to-green-500";
    if (progress >= 50) return "from-warning to-yellow-500";
    return "from-primary to-secondary";
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-gray-900 text-lg font-display">
            {project.name}
          </h3>
        </div>
        <Button variant="ghost" size="sm">
          <ApperIcon name="MoreVertical" className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={cn("h-2 rounded-full bg-gradient-to-r", getProgressColor(progress))}
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ApperIcon name="CheckSquare" className="h-4 w-4 text-success" />
              <span className="text-sm text-gray-600">{completedTasks}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Square" className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{tasksCount - completedTasks}</span>
            </div>
          </div>
          
          <span className="text-xs text-gray-500">
            {format(new Date(project.updatedAt), "MMM d")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;