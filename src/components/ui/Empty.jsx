import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "general", onAction, actionText = "Get Started" }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "projects":
        return {
          icon: "FolderPlus",
          title: "No Projects Yet",
          description: "Create your first project to start organizing your tasks and collaborating with your team.",
          actionText: "Create Project",
          gradient: "from-primary/10 to-secondary/20",
        };
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No Tasks Found",
          description: "Start by creating your first task or adjust your filters to see existing tasks.",
          actionText: "Add Task",
          gradient: "from-info/10 to-primary/20",
        };
      case "search":
        return {
          icon: "Search",
          title: "No Results Found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          actionText: "Clear Search",
          gradient: "from-warning/10 to-accent/20",
        };
      case "board":
        return {
          icon: "Columns",
          title: "Empty Board",
          description: "This board is ready for your tasks. Start adding tasks to organize your workflow.",
          actionText: "Add First Task",
          gradient: "from-success/10 to-info/20",
        };
      default:
        return {
          icon: "Plus",
          title: "Nothing Here Yet",
          description: "Get started by adding your first item.",
          actionText: "Get Started",
          gradient: "from-primary/10 to-secondary/20",
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="w-full min-h-[400px] bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className={`bg-gradient-to-br ${config.gradient} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name={config.icon} className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
            {config.title}
          </h3>
          <p className="text-gray-600 mb-8 font-body leading-relaxed">
            {config.description}
          </p>
        </motion.div>

        {onAction && (
          <motion.button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name={config.icon} className="h-4 w-4" />
            <span>{config.actionText}</span>
          </motion.button>
        )}

        <motion.div
          className="mt-8 grid grid-cols-3 gap-4 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.6 }}
        >
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${Math.random() * 40 + 20}%` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Empty;