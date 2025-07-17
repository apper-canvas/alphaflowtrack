import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProjectModal from "@/components/organisms/ProjectModal";
import TaskList from "@/components/organisms/TaskList";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import projectService from "@/services/api/projectService";
import clientService from "@/services/api/clientService";
import taskService from "@/services/api/taskService";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectData, projectTasks] = await Promise.all([
        projectService.getById(id),
        taskService.getByProjectId(id)
      ]);

      setProject(projectData);
      setTasks(projectTasks);

      // Fetch client details
      if (projectData.clientId) {
        const clientData = await clientService.getById(projectData.clientId);
        setClient(clientData);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = async (updatedProject) => {
    try {
      await projectService.update(id, updatedProject);
      setProject({ ...project, ...updatedProject });
      setIsEditModalOpen(false);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error("Failed to update project");
    }
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

  const generateTimelineData = () => {
    if (!project) return { categories: [], series: [] };

    const startDate = new Date(project.startDate || project.createdAt);
    const endDate = new Date(project.deadline);
    const today = new Date();
    
    const totalDays = differenceInDays(endDate, startDate);
    const elapsedDays = differenceInDays(today, startDate);
    const progressDays = Math.floor((totalDays * project.progress) / 100);

    return {
      categories: [
        format(startDate, "MMM dd"),
        format(today, "MMM dd"),
        format(endDate, "MMM dd")
      ],
      series: [{
        name: "Expected Progress",
        data: [0, Math.min(elapsedDays, totalDays), totalDays]
      }, {
        name: "Actual Progress", 
        data: [0, progressDays, totalDays]
      }]
    };
  };

  const generateBudgetData = () => {
    if (!project) return { categories: [], series: [] };

    const actualSpend = project.actualSpend || (project.budget * project.progress / 100);
    const remaining = project.budget - actualSpend;

    return {
      categories: ["Budget Allocation"],
      series: [{
        name: "Spent",
        data: [actualSpend]
      }, {
        name: "Remaining",
        data: [remaining]
      }]
    };
  };

  const timelineOptions = {
    chart: {
      type: 'line',
      height: 350,
      background: 'transparent',
      toolbar: { show: false }
    },
    theme: {
      mode: 'light'
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    colors: ['#6366f1', '#8b5cf6'],
    xaxis: {
      categories: generateTimelineData().categories,
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Days',
        style: {
          color: '#64748b'
        }
      },
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      labels: {
        colors: '#64748b'
      }
    }
  };

  const budgetOptions = {
    chart: {
      type: 'bar',
      height: 300,
      background: 'transparent',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true
      }
    },
    colors: ['#ef4444', '#22c55e'],
    xaxis: {
      categories: generateBudgetData().categories,
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`,
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0'
    },
    legend: {
      position: 'top',
      labels: {
        colors: '#64748b'
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!project) return <Error message="Project not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/projects")}
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {project.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {client?.name || "Unknown Client"}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <ApperIcon name="Edit2" className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project Status
            </h3>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Start Date</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {format(new Date(project.startDate || project.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Deadline</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {format(new Date(project.deadline), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Budget Overview
            </h3>
            <ApperIcon name="DollarSign" className="h-5 w-5 text-primary-500" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-sm">Total Budget</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  ${project.budget?.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-sm">Spent</span>
                <p className="text-xl font-bold text-primary-500">
                  ${((project.actualSpend || (project.budget * project.progress / 100))).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Remaining</span>
                <span className="font-medium text-emerald-600">
                  ${(project.budget - (project.actualSpend || (project.budget * project.progress / 100))).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Task Summary
            </h3>
            <ApperIcon name="CheckSquare" className="h-5 w-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Total Tasks</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Completed</span>
              <span className="font-medium text-emerald-600">
                {tasks.filter(t => t.status === 'Completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm">In Progress</span>
              <span className="font-medium text-amber-600">
                {tasks.filter(t => t.status === 'In Progress').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Pending</span>
              <span className="font-medium text-slate-500">
                {tasks.filter(t => t.status === 'Pending').length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Project Timeline
        </h3>
        <Chart
          options={timelineOptions}
          series={generateTimelineData().series}
          type="line"
          height={350}
        />
      </motion.div>

      {/* Budget Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Budget vs Actual Spend
        </h3>
        <Chart
          options={budgetOptions}
          series={generateBudgetData().series}
          type="bar"
          height={300}
        />
      </motion.div>

{/* Task Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Project Tasks
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/tasks")}
          >
            View All Tasks
          </Button>
        </div>
        {tasks.length > 0 ? (
          <KanbanBoard
            tasks={tasks}
            projects={[project]}
            onEdit={(task) => toast.info(`Edit task: ${task.title}`)}
            onDelete={async (task) => {
              if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                try {
                  await taskService.delete(task.Id);
                  setTasks(prev => prev.filter(t => t.Id !== task.Id));
                  toast.success("Task deleted successfully");
                } catch (err) {
                  toast.error("Failed to delete task");
                }
              }
            }}
            onDragEnd={async (result) => {
              const { destination, source, draggableId } = result;
              
              if (!destination) return;
              if (destination.droppableId === source.droppableId && destination.index === source.index) return;

              const taskId = parseInt(draggableId);
              const newStatus = destination.droppableId;

              try {
                const updatedTask = await taskService.update(taskId, { status: newStatus });
                setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
                toast.success(`Task moved to ${newStatus}`);
              } catch (err) {
                toast.error("Failed to update task status");
              }
            }}
          />
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No tasks found for this project
          </div>
        )}
      </motion.div>

      {/* Project Description */}
      {project.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Project Description
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSubmit={handleProjectUpdate}
      />
    </div>
  );
};

export default ProjectDetail;