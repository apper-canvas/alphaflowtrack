import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg glass-panel hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-200"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon 
          name={theme === "dark" ? "Sun" : "Moon"} 
          className="h-5 w-5 text-slate-600 dark:text-slate-300" 
        />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;