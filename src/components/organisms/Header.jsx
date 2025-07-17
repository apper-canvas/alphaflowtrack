import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ThemeToggle from "@/components/molecules/ThemeToggle";

const Header = ({ onMenuClick }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 glass-panel border-b border-white/20 dark:border-slate-700/50 flex items-center justify-between px-6"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ApperIcon name="Menu" className="h-6 w-6 text-slate-600 dark:text-slate-300" />
        </button>
        
        <div className="lg:hidden flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="Zap" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold gradient-text">FlowTrack</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <div className="hidden sm:flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-slate-700 dark:text-slate-200">John Doe</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Freelancer</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;