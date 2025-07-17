import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskList = ({ tasks, projects, onEdit, onDelete, onStatusChange }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  const getProjectName = (projectId) => {
    const project = projects?.find(p => p.Id === projectId);
    return project?.name || "Unknown Project";
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Pending": "info",
      "In Progress": "warning",
      "Completed": "success",
      "Blocked": "error"
    };
    return variants[status] || "default";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      "High": "error",
      "Medium": "warning",
      "Low": "info"
    };
    return variants[priority] || "default";
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="space-y-2 p-6">
{tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 dark:hover:bg-slate-700/20 transition-colors border border-white/10 dark:border-slate-700/30"
          >
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => onStatusChange && onStatusChange(task.Id, task.status === "Completed" ? "In Progress" : "Completed")}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.status === "Completed"
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-300 dark:border-slate-600 hover:border-primary-500"
                }`}
              >
                {task.status === "Completed" && (
                  <ApperIcon name="Check" className="h-3 w-3 text-white" />
                )}
              </button>

              <div className="flex-1">
                <div className={`font-medium mb-1 ${
                  task.status === "Completed" 
                    ? "line-through text-slate-500 dark:text-slate-400" 
                    : "text-slate-900 dark:text-slate-100"
                }`}>
{task.title_c}
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
<span>{getProjectName(task.projectId_c)}</span>
                  <span>•</span>
<span>Due {format(new Date(task.dueDate_c), "MMM dd")}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
<Badge variant={getStatusVariant(task.status_c)}>
                  {task.status_c}
                </Badge>
<Badge variant={getPriorityVariant(task.priority_c)}>
                  {task.priority_c}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit && onEdit(task)}
              >
                <ApperIcon name="Edit2" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete && onDelete(task)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;