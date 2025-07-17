import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Button from "@/components/atoms/Button";
import ProjectModal from "@/components/organisms/ProjectModal";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { projects, createProject } = useProjects();

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setShowProjectModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar
          projects={projects}
          onNewProject={() => setShowProjectModal(true)}
          className="h-full"
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        projects={projects}
        onNewProject={() => setShowProjectModal(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSidebar(true)}
              >
                <ApperIcon name="Menu" className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Kanban" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-display">
                  FlowBoard
                </h1>
              </div>
            </div>
            
            <Button
              onClick={() => setShowProjectModal(true)}
              icon="Plus"
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary"
            >
              New
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
};

export default Layout;