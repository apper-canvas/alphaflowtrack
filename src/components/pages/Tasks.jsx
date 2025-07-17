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
  const [viewMode, setViewMode] = useState("list"); // "list" or "kanban"
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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
    setEditingTask(task);
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
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
        toast.success("Task updated successfully");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully");
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(editingTask ? "Failed to update task" : "Failed to create task");
    }
  };

  const handleTaskDragEnd = async (result) => {
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
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex items-center glass-card rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <ApperIcon name="List" size={16} />
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                viewMode === "kanban"
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <ApperIcon name="Columns" size={16} />
              <span className="text-sm font-medium">Kanban</span>
            </button>
          </div>
          <Button onClick={handleAddTask} className="w-full sm:w-auto">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

{viewMode === "list" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tasks by title, status, or priority..."
            className="max-w-md"
          />
        </motion.div>
      )}

{viewMode === "list" ? (
        filteredTasks.length === 0 ? (
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
            <TaskList
              tasks={filteredTasks}
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <KanbanBoard
            tasks={tasks}
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDragEnd={handleTaskDragEnd}
          />
        </motion.div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        projects={projects}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
};

export default Tasks;