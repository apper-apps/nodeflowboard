import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "FileX";
      case "server":
        return "ServerCrash";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "notFound":
        return "Content Not Found";
      case "server":
        return "Server Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  return (
    <div className="w-full min-h-[400px] bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="bg-gradient-to-br from-error/10 to-error/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name={getErrorIcon()} className="h-12 w-12 text-error" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
            {getErrorTitle()}
          </h3>
          <p className="text-gray-600 mb-8 font-body leading-relaxed">
            {message}
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4" />
              <span>Try Again</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Refresh Page</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          If the problem persists, please check your internet connection or try again later.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;