import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";
import clientService from "@/services/api/clientService";
import ProjectModal from "@/components/organisms/ProjectModal";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, clientsData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleEdit = (project) => {
    // Prevent opening modal if data is still loading
    if (loading || !clients) {
      toast.warning("Please wait for data to load");
      return;
    }
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      try {
        await projectService.delete(project.Id);
        setProjects(prev => prev.filter(p => p.Id !== project.Id));
        toast.success("Project deleted successfully");
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

const handleAddProject = () => {
    // Prevent opening modal if data is still loading
    if (loading || !clients) {
      toast.warning("Please wait for data to load");
      return;
    }
    setEditingProject(null);
    setIsModalOpen(true);
  };

const filteredProjects = projects.filter(project =>
    project.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status_c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track progress and manage your project portfolio
          </p>
        </div>
        <Button onClick={handleAddProject} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search projects by name or status..."
          className="max-w-md"
        />
      </motion.div>

      {filteredProjects.length === 0 ? (
        <Empty
          icon="FolderOpen"
          title="No projects found"
          description={
            searchTerm
              ? "No projects match your search criteria. Try adjusting your search terms."
              : "Create your first project to start tracking progress and deliverables."
          }
          actionLabel="New Project"
          onAction={handleAddProject}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProjectGrid
            projects={filteredProjects}
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
/>
        </motion.div>
      )}

<ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        clients={clients || []}
        onProjectSaved={(project) => {
          if (editingProject) {
            setProjects(prev => prev.map(p => p.Id === project.Id ? project : p));
            toast.success("Project updated successfully");
          } else {
            setProjects(prev => [...prev, project]);
            toast.success("Project created successfully");
          }
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
};

export default Projects;