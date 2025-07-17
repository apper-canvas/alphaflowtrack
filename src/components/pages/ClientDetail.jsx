import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import ClientModal from "@/components/organisms/ClientModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import clientService from "@/services/api/clientService";
import projectService from "@/services/api/projectService";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const clientId = parseInt(id);
      if (isNaN(clientId)) {
        throw new Error("Invalid client ID");
      }

      const [clientData, projectsData] = await Promise.all([
        clientService.getById(clientId),
        projectService.getByClientId(clientId)
      ]);

      if (!clientData) {
        throw new Error("Client not found");
      }

      setClient(clientData);
      setProjects(projectsData || []);
    } catch (err) {
      setError(err.message || "Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleClientUpdated = (updatedClient) => {
    setClient(updatedClient);
    toast.success("Client updated successfully");
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleBack = () => {
    navigate("/clients");
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClientData} />;
  }

  if (!client) {
    return <Error message="Client not found" onRetry={handleBack} />;
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "In Progress").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const totalRevenue = projects.reduce((sum, project) => sum + (project.budget || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Planning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Client Details</h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage client information
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="w-full sm:w-auto">
          <ApperIcon name="Edit2" className="h-4 w-4 mr-2" />
          Edit Client
        </Button>
      </motion.div>

      {/* Client Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-xl">
              {client.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {client.name}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {client.company}
                </p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Client since {format(new Date(client.createdAt), "MMMM yyyy")}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <ApperIcon name="Mail" className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {client.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Phone" className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {client.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon="FolderOpen"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon="Clock"
          color="amber"
        />
        <StatCard
          title="Completed Projects"
          value={completedProjects}
          icon="CheckCircle"
          color="emerald"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          color="purple"
        />
      </motion.div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Projects
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ApperIcon name="FolderOpen" className="h-4 w-4" />
            {totalProjects} project{totalProjects !== 1 ? "s" : ""}
          </div>
        </div>

        {projects.length === 0 ? (
          <Empty
            icon="FolderOpen"
            title="No projects yet"
            description="This client doesn't have any projects assigned yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {project.name}
                  </h4>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-3">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <ApperIcon name="Calendar" className="h-3 w-3" />
                      {format(new Date(project.deadline), "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <ApperIcon name="DollarSign" className="h-3 w-3" />
                      ${project.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onClientUpdated={handleClientUpdated}
        editingClient={client}
      />
    </div>
  );
};

export default ClientDetail;