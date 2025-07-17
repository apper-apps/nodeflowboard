import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  currentProject, 
  projects = [], 
  onProjectChange,
  onSearch,
  onNewTask,
  onNewProject,
  className = "" 
}) => {
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/tasks") return "My Tasks";
    if (path === "/calendar") return "Calendar";
    if (path === "/team") return "Team";
    if (path.startsWith("/project/")) return currentProject?.name || "Project";
    return "FlowBoard";
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === "/") return "Overview of all your projects and tasks";
    if (path === "/tasks") return "Manage your personal tasks across all projects";
    if (path === "/calendar") return "View schedules and upcoming deadlines";
    if (path === "/team") return "Team members and workload distribution";
    if (path.startsWith("/project/")) return "Project board and task management";
    return "Visual project management tool";
  };

  return (
    <header className={cn("bg-white border-b border-gray-200", className)}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Kanban" className="h-6 w-6 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-600">
                {getPageDescription()}
              </p>
            </div>
          </div>
          
          {location.pathname.startsWith("/project/") && currentProject && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="flex items-center space-x-2"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentProject.color }}
                />
                <span>{currentProject.name}</span>
                <ApperIcon name="ChevronDown" className="h-4 w-4" />
              </Button>
              
              {showProjectSelector && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-2">
                    {projects.map((project) => (
                      <button
                        key={project.Id}
                        onClick={() => {
                          onProjectChange(project);
                          setShowProjectSelector(false);
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors",
                          currentProject.Id === project.Id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search tasks and projects..."
            className="w-80"
          />
          
          <div className="flex items-center space-x-2">
            {location.pathname.startsWith("/project/") && (
              <Button
                onClick={onNewTask}
                icon="Plus"
                className="bg-gradient-to-r from-primary to-secondary"
              >
                New Task
              </Button>
            )}
            
            <Button
              onClick={onNewProject}
              icon="FolderPlus"
              variant="outline"
            >
              New Project
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;