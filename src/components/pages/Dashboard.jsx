import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ClientModal from "@/components/organisms/ClientModal";
import ProjectModal from "@/components/organisms/ProjectModal";
import TaskModal from "@/components/organisms/TaskModal";
import InvoiceModal from "@/components/organisms/InvoiceModal";
import clientService from "@/services/api/clientService";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import invoiceService from "@/services/api/invoiceService";
import activityService from "@/services/api/activityService";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    pendingTasks: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Data for modals
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Activity states
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");
const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [clientsData, projectsData, tasks, invoices] = await Promise.all([
        clientService.getAll(),
        projectService.getAll(),
        taskService.getAll(),
        invoiceService.getAll()
      ]);

      // Store data for modals
      setClients(clientsData);
      setProjects(projectsData);

const activeProjects = projectsData.filter(p => p.status_c === "In Progress").length;
const pendingTasks = tasks.filter(t => t.status_c !== "Completed").length;
const paidInvoices = invoices.filter(i => i.status_c === "Paid");
      const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + (invoice.amount_c || 0), 0);

      setStats({
        totalClients: clientsData.length,
        activeProjects,
        pendingTasks,
        totalRevenue
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadModalData = async (modalType) => {
    if (modalType === 'project' || modalType === 'task' || modalType === 'invoice') {
      setModalLoading(true);
      try {
        const [clientsData, projectsData] = await Promise.all([
          clientService.getAll(),
          projectService.getAll()
        ]);
        setClients(clientsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load modal data:", error);
      } finally {
        setModalLoading(false);
      }
    }
  };

const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError("");
      const activitiesData = await activityService.getAll(10);
      setActivities(activitiesData);
    } catch (err) {
      setActivitiesError(err.message || "Failed to load activities");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleClientCreated = () => {
    setShowClientModal(false);
    loadDashboardData();
    loadActivities(); // Refresh activities after new client
  };

const handleProjectCreated = () => {
    setShowProjectModal(false);
    loadDashboardData();
    loadActivities(); // Refresh activities after new project
  };

  const handleTaskCreated = () => {
    setShowTaskModal(false);
    loadDashboardData();
    loadActivities(); // Refresh activities after new task
  };

  const handleInvoiceCreated = () => {
    setShowInvoiceModal(false);
    loadDashboardData();
    loadActivities(); // Refresh activities after new invoice
  };

  const openModal = (modalType) => {
    switch (modalType) {
      case 'client':
        setShowClientModal(true);
        break;
      case 'project':
        setShowProjectModal(true);
        loadModalData('project');
        break;
      case 'task':
        setShowTaskModal(true);
        loadModalData('task');
        break;
      case 'invoice':
        setShowInvoiceModal(true);
        loadModalData('invoice');
        break;
    }
  };

useEffect(() => {
    loadDashboardData();
    loadActivities();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading />
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here"s what"s happening with your projects today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon="Users"
          trend="up"
          trendValue="+12%"
          gradient="from-primary-500 to-secondary-500"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="FolderOpen"
          trend="up"
          trendValue="+8%"
          gradient="from-secondary-500 to-accent-500"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="CheckSquare"
          trend="down"
          trendValue="-5%"
          gradient="from-accent-500 to-primary-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="+23%"
          gradient="from-emerald-500 to-teal-500"
        />
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Activity
          </h3>
          {activitiesLoading ? (
            <div className="space-y-4">
              <Loading />
            </div>
          ) : activitiesError ? (
            <Error message={activitiesError} onRetry={loadActivities} />
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const getActivityIcon = (type) => {
                  switch (type) {
                    case 'Create':
                      return { icon: '+', gradient: 'from-emerald-500 to-teal-500' };
                    case 'Update':
                      return { icon: '✓', gradient: 'from-primary-500 to-secondary-500' };
                    case 'Delete':
                      return { icon: '×', gradient: 'from-red-500 to-rose-500' };
                    default:
                      return { icon: '•', gradient: 'from-accent-500 to-primary-500' };
                  }
                };

                const formatTimeAgo = (timestamp) => {
                  const now = new Date();
                  const activityTime = new Date(timestamp);
                  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
                  
                  if (diffInMinutes < 1) return 'Just now';
                  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
                  
                  const diffInHours = Math.floor(diffInMinutes / 60);
                  if (diffInHours < 24) return `${diffInHours} hours ago`;
                  
                  const diffInDays = Math.floor(diffInHours / 24);
                  return `${diffInDays} days ago`;
                };

                const activityConfig = getActivityIcon(activity.activityType_c);

                return (
                  <div key={activity.Id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 dark:bg-slate-700/20">
                    <div className={`w-8 h-8 bg-gradient-to-r ${activityConfig.gradient} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{activityConfig.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {activity.activityType_c} {activity.entityType_c.toLowerCase()} 
                        {activity.user_c?.Name && ` by ${activity.user_c.Name}`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTimeAgo(activity.timestamp_c)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h3>
<div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => openModal('client')}
              className="p-4 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm font-medium">Add Client</div>
            </button>
            <button 
              onClick={() => openModal('project')}
              className="p-4 rounded-lg bg-gradient-to-r from-secondary-500 to-accent-500 text-white text-center hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="text-2xl mb-2">📁</div>
              <div className="text-sm font-medium">New Project</div>
            </button>
            <button 
              onClick={() => openModal('task')}
              className="p-4 rounded-lg bg-gradient-to-r from-accent-500 to-primary-500 text-white text-center hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium">Add Task</div>
            </button>
            <button 
              onClick={() => openModal('invoice')}
              className="p-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm font-medium">Create Invoice</div>
            </button>
          </div>
        </motion.div>
</div>

      {/* Modals */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientCreated={handleClientCreated}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        project={null}
        clients={clients}
        onProjectSaved={handleProjectCreated}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={null}
        projects={projects}
        onSubmit={handleTaskCreated}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        clients={clients}
        projects={projects}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};

export default Dashboard;