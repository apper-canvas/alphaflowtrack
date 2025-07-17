import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="min-w-[120px]"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;