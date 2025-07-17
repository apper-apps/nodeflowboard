import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "board" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%]";

  if (type === "board") {
    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-background via-surface to-background p-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[...Array(4)].map((_, columnIndex) => (
            <motion.div
              key={columnIndex}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-6 w-24 rounded-lg ${shimmerClass}`} />
                <div className={`h-6 w-8 rounded-full ${shimmerClass}`} />
              </div>
              
              <div className="space-y-3">
                {[...Array(3)].map((_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200"
                  >
                    <div className={`h-4 w-3/4 rounded mb-2 ${shimmerClass}`} />
                    <div className={`h-3 w-1/2 rounded mb-3 ${shimmerClass}`} />
                    <div className="flex items-center justify-between">
                      <div className={`h-5 w-16 rounded-full ${shimmerClass}`} />
                      <div className={`h-6 w-6 rounded-full ${shimmerClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg font-medium text-gray-600">Loading your projects...</span>
        </motion.div>
      </div>
    );
  }

  if (type === "tasks") {
    return (
      <div className="w-full bg-gradient-to-br from-background via-surface to-background p-6">
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-5 w-2/3 rounded ${shimmerClass}`} />
                <div className={`h-5 w-16 rounded-full ${shimmerClass}`} />
              </div>
              <div className={`h-4 w-1/2 rounded mb-2 ${shimmerClass}`} />
              <div className="flex items-center justify-between">
                <div className={`h-4 w-20 rounded ${shimmerClass}`} />
                <div className={`h-6 w-6 rounded-full ${shimmerClass}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg font-medium text-gray-600">Loading your tasks...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-gradient-to-br from-background via-surface to-background flex items-center justify-center">
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg font-medium text-gray-600">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loading;