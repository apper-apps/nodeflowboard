import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ projects = [], onNewProject, className = "" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "LayoutDashboard",
      description: "Overview of all projects"
    },
    { 
      path: "/tasks", 
      label: "My Tasks", 
      icon: "CheckSquare",
      description: "Personal task management"
    },
    { 
      path: "/calendar", 
      label: "Calendar", 
      icon: "Calendar",
      description: "Schedule and deadlines"
    },
    { 
      path: "/team", 
      label: "Team", 
      icon: "Users",
      description: "Team members and workload"
    },
  ];

  const getProjectTaskCount = (projectId) => {
    // This would normally come from a service or context
    return Math.floor(Math.random() * 20) + 1;
  };

  return (
    <div className={cn("h-full bg-white border-r border-gray-200", className)}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Kanban" className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 font-display">
                FlowBoard
              </h1>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Projects Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {!isCollapsed ? "Projects" : "P"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewProject}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects.map((project) => (
              <NavLink
                key={project.Id}
                to={`/project/${project.Id}`}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs text-gray-500">
                      {getProjectTaskCount(project.Id)} tasks
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="FolderPlus" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              {!isCollapsed && (
                <p className="text-sm text-gray-500">
                  No projects yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;