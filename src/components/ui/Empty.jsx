import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} className="h-10 w-10 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="min-w-[140px]"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;