import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, projectName, onEdit, onDelete, isDragging }) => {
  const getPriorityVariant = (priority) => {
    const variants = {
      High: "error",
      Medium: "warning", 
      Low: "info"
    };
    return variants[priority] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      High: "AlertCircle",
      Medium: "AlertTriangle",
      Low: "Info"
    };
    return icons[priority] || "Circle";
  };

  const formatDueDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const isOverdue = date < today;
      
      return {
        formatted: format(date, "MMM dd"),
        isOverdue
      };
    } catch (err) {
      return { formatted: "Invalid date", isOverdue: false };
    }
  };

  const dueDate = formatDueDate(task.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative glass-card rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isDragging ? "shadow-2xl scale-105" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight mb-1">
            {task.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {projectName}
          </p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <ApperIcon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
          >
            <ApperIcon name="Trash2" size={12} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge 
            variant={getPriorityVariant(task.priority)} 
            className="text-xs px-2 py-1"
          >
            <ApperIcon name={getPriorityIcon(task.priority)} size={10} className="mr-1" />
            {task.priority}
          </Badge>
          
          <div className={`flex items-center gap-1 text-xs ${
            dueDate.isOverdue ? "text-red-500" : "text-slate-500 dark:text-slate-400"
          }`}>
            <ApperIcon name="Calendar" size={10} />
            <span>{dueDate.formatted}</span>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {task.assignedTo || "Unassigned"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;