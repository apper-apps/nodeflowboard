import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onSave, 
  onDelete,
  isEditing = false,
  projects = []
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignee: "",
    projectId: ""
  });

  const [isEditMode, setIsEditMode] = useState(isEditing);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
        assignee: task.assignee || "",
        projectId: task.projectId || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        assignee: "",
        projectId: ""
      });
    }
    setIsEditMode(isEditing);
  }, [task, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      Id: task?.Id || Date.now(),
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(taskData);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.Id);
      onClose();
    }
  };

  const statusOptions = [
    { value: "todo", label: "To Do", color: "text-gray-700" },
    { value: "inprogress", label: "In Progress", color: "text-info" },
    { value: "review", label: "Review", color: "text-warning" },
    { value: "done", label: "Done", color: "text-success" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "low" },
    { value: "medium", label: "Medium", color: "medium" },
    { value: "high", label: "High", color: "high" },
  ];

  const teamMembers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Chen"
  ];

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
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                {task ? (isEditMode ? "Edit Task" : "Task Details") : "New Task"}
              </h2>
              
              <div className="flex items-center space-x-2">
                {task && !isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                    icon="Edit"
                  >
                    Edit
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {isEditMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Task Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title..."
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee
                      </label>
                      <select
                        value={formData.assignee}
                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select assignee...</option>
                        {teamMembers.map((member) => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      {task && (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={handleDelete}
                          icon="Trash2"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => task ? setIsEditMode(false) : onClose()}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" icon="Save">
                        {task ? "Update Task" : "Create Task"}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {task?.title}
                    </h3>
                    {task?.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Badge variant={task?.status === "done" ? "success" : "primary"}>
                        {statusOptions.find(s => s.value === task?.status)?.label}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <Badge variant={task?.priority}>
                        {priorityOptions.find(p => p.value === task?.priority)?.label}
                      </Badge>
                    </div>
                  </div>
                  
                  {(task?.dueDate || task?.assignee) && (
                    <div className="grid grid-cols-2 gap-4">
                      {task?.dueDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                          </label>
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {format(new Date(task.dueDate), "PPP")}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {task?.assignee && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assignee
                          </label>
                          <div className="flex items-center space-x-2">
                            <Avatar name={task.assignee} size="sm" />
                            <span className="text-sm text-gray-600">
                              {task.assignee}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <p>Created: {format(new Date(task?.createdAt), "PPpp")}</p>
                    {task?.updatedAt && task.updatedAt !== task.createdAt && (
                      <p>Updated: {format(new Date(task.updatedAt), "PPpp")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;