import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

const TaskModal = ({ isOpen, onClose, task, projects, onSubmit }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    assignedTo: ""
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title_c || "",
        description: task.description || "",
        projectId: task.projectId_c || "",
        priority: task.priority_c || "Medium",
        status: task.status_c || "Pending",
        dueDate: task.dueDate_c ? new Date(task.dueDate_c).toISOString().split('T')[0] : "",
        assignedTo: task.assignedTo_c || ""
      });
} else {
      setFormData({
        title: "",
        description: "",
        projectId: projects.length > 0 ? projects[0].Id : "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
        assignedTo: ""
      });
    }
    setErrors({});
  }, [task, projects, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      projectId: parseInt(formData.projectId),
      dueDate: new Date(formData.dueDate).toISOString()
    };

    onSubmit(submitData);
  };

const statusOptions = [
    { value: "Pending", label: "Pending", icon: "Circle" },
    { value: "In Progress", label: "In Progress", icon: "Clock" },
    { value: "Completed", label: "Completed", icon: "CheckCircle" },
    { value: "Blocked", label: "Blocked", icon: "AlertCircle" }
  ];

  const priorityOptions = [
    { value: "Low", label: "Low", color: "text-blue-600" },
    { value: "Medium", label: "Medium", color: "text-amber-600" },
    { value: "High", label: "High", color: "text-red-600" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Add New Task"}
      maxWidth="max-w-lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the task..."
            rows={3}
            className="flex w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="project">Project *</Label>
            <select
              id="project"
              value={formData.projectId}
              onChange={(e) => handleInputChange("projectId", e.target.value)}
              className={`flex h-11 w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.projectId ? "border-red-500" : "border-slate-300 dark:border-slate-600"
              }`}
            >
              <option value="">Select project</option>
{projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.Name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-sm text-red-500 mt-1">{errors.projectId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => handleInputChange("assignedTo", e.target.value)}
            placeholder="Enter assignee name"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            <ApperIcon name={task ? "Save" : "Plus"} size={16} className="mr-2" />
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

export default TaskModal;