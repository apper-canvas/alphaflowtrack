import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskList from "@/components/organisms/TaskList";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await taskService.delete(task.Id);
        setTasks(prev => prev.filter(t => t.Id !== task.Id));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task moved to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        const updatedTask = await taskService.update(selectedTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? updatedTask : t));
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
      }
    } catch (err) {
      throw new Error("Failed to save task");
    }
  };

  const handleModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <Loading type="table" />;
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
          <h1 className="text-3xl font-bold gradient-text">Tasks</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Organize and track your project tasks and deliverables
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-8 px-3"
            >
              <ApperIcon name="Columns" className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={handleAddTask} className="w-full sm:w-auto">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search tasks by title, status, priority, or description..."
          className="max-w-md"
        />
      </motion.div>

      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={
            searchTerm
              ? "No tasks match your search criteria. Try adjusting your search terms."
              : "Break down your projects into manageable tasks to track progress effectively."
          }
          actionLabel="Add Task"
          onAction={handleAddTask}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              projects={projects}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </motion.div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        projects={projects}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
};

export default Tasks;