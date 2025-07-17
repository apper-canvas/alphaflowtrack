import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";

const ProjectGrid = ({ projects, clients, onEdit, onDelete }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  const getClientName = (clientId) => {
    const client = clients?.find(c => c.Id === clientId);
    return client?.name || "Unknown Client";
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Planning": "info",
      "In Progress": "warning",
      "Completed": "success",
      "On Hold": "error"
    };
    return variants[status] || "default";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card rounded-xl p-6 hover-lift"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getClientName(project.clientId)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit && onEdit(project)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <ApperIcon name="Edit2" className="h-4 w-4 text-slate-500" />
              </button>
              <button
                onClick={() => onDelete && onDelete(project)}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <Badge variant={getStatusVariant(project.status)} className="mb-3">
              {project.status}
            </Badge>
            <ProgressBar value={project.progress} className="mb-3" />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Budget:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                ${project.budget?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Deadline:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {format(new Date(project.deadline), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-white/10 dark:border-slate-700/50">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="FolderOpen" className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Created {format(new Date(project.createdAt), "MMM dd")}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;