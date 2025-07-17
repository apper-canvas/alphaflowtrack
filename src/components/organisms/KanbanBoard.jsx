import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const KanbanBoard = ({ 
  tasks = [], 
  projects = [], 
  onStatusChange = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  const columns = [
    { id: "To Do", title: "To Do", color: "bg-slate-100 dark:bg-slate-700" },
    { id: "In Progress", title: "In Progress", color: "bg-amber-50 dark:bg-amber-900/20" },
    { id: "Review", title: "Review", color: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "Done", title: "Done", color: "bg-emerald-50 dark:bg-emerald-900/20" }
  ];

  const getProjectName = (projectId) => {
    const project = projects?.find(p => p.Id === projectId);
    return project?.name || "Unknown Project";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      "High": "error",
      "Medium": "warning",
      "Low": "info"
    };
    return variants[priority] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      "High": "ArrowUp",
      "Medium": "Minus",
      "Low": "ArrowDown"
    };
    return icons[priority] || "Minus";
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    onStatusChange(taskId, newStatus);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                {column.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {getTasksByStatus(column.id).length}
              </Badge>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[400px] space-y-3 transition-colors ${
                    snapshot.isDraggingOver ? "bg-primary-50 dark:bg-primary-900/20 rounded-lg" : ""
                  }`}
                >
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.Id} draggableId={task.Id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
                            snapshot.isDragging ? "shadow-lg scale-105" : ""
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-tight">
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit && onEdit(task);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <ApperIcon name="Edit2" className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete && onDelete(task);
                                  }}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <ApperIcon name="Trash2" className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 dark:text-slate-400">
                                {getProjectName(task.projectId)}
                              </span>
                              <div className="flex items-center gap-1">
                                <ApperIcon name={getPriorityIcon(task.priority)} className="h-3 w-3" />
                                <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Calendar" className="h-3 w-3 text-slate-400" />
                                <span className={`${
                                  isOverdue(task.dueDate) ? "text-red-600 font-medium" : "text-slate-500 dark:text-slate-400"
                                }`}>
                                  {format(new Date(task.dueDate), "MMM dd")}
                                </span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <ApperIcon name="User" className="h-3 w-3 text-slate-400" />
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {task.assignedTo}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;