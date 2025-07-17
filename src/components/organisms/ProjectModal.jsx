import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#5B47E0"
  });

  const colorOptions = [
    "#5B47E0", "#8B7FFF", "#FF6B6B", "#4ECDC4", "#FFD93D", "#4D96FF",
    "#FF9F43", "#6C5CE7", "#FD79A8", "#00B894", "#E17055", "#A29BFE"
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        color: project.color || "#5B47E0"
      });
    } else {
      setFormData({
        name: "",
        color: "#5B47E0"
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const projectData = {
      ...formData,
      Id: project?.Id || Date.now(),
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(projectData);
    onClose();
  };

  const handleDelete = () => {
    if (project && onDelete) {
      onDelete(project.Id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                {project ? "Edit Project" : "New Project"}
              </h2>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        formData.color === color ? "border-gray-800" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                {project && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    icon="Trash2"
                  >
                    Delete
                  </Button>
                )}
                
                <div className="flex items-center space-x-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" icon="Save">
                    {project ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;