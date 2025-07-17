import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Invoices", href: "/invoices", icon: "FileText" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 h-screen glass-panel border-r border-white/20 dark:border-slate-700/50">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Zap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">FlowTrack</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Project Tracker</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-l-4 border-primary-500 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400"
                }`
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 dark:border-slate-700/50">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            © 2024 FlowTrack
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 glass-panel border-r border-white/20 dark:border-slate-700/50 z-50"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">FlowTrack</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Project Tracker</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-l-4 border-primary-500 text-primary-600 dark:text-primary-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;