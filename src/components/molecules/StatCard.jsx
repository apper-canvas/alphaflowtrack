import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, gradient = "from-primary-500 to-secondary-500" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card rounded-xl p-6 hover-lift"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </h3>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 mr-1 ${
                  trend === "up" ? "text-emerald-500" : "text-red-500"
                }`} 
              />
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;