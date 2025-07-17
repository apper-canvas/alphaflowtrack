import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const columns = [
  { id: "To Do", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "In Progress", title: "In Progress", color: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "Review", title: "Review", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "Done", title: "Done", color: "bg-emerald-50 dark:bg-emerald-900/20" }
];

const variants = { High: "error", Medium: "warning", Low: "info" };
const icons = { High: "ArrowUp", Medium: "Minus", Low: "ArrowDown" };

const KanbanBoard = ({ 
  tasks = [], 
  projects = [], 
  onStatusChange = () => {},
  onTaskClick = () => {},
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  const columns = [
    { id: "To Do", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
    { id: "In Progress", title: "In Progress", color: "bg-amber-50 dark:bg-amber-900/20" },
    { id: "Review", title: "Review", color: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "Done", title: "Done", color: "bg-emerald-50 dark:bg-emerald-900/20" }
  ];

  const getProjectName = (projectId) => {
    const project = projects?.find(p => p?.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getPriorityVariant = (priority) => {
    return variants[priority] || 'info';
  };

  const getPriorityIcon = (priority) => {
    return icons[priority] || 'Minus';
  };

  const getTasksByStatus = (status) => {
    return tasks?.filter(task => task?.status === status) || [];
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    if (onStatusChange) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
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
                    className={`
                      flex-1 p-4 rounded-lg transition-colors duration-200
                      ${column.color}
                      ${snapshot.isDraggingOver ? 'ring-2 ring-primary-500' : ''}
                    `}
                  >
                    <div className="space-y-3">
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable 
                          key={task?.id || `task-${index}`} 
                          draggableId={task?.id?.toString() || `task-${index}`} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`
                                bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm
                                border border-gray-200 dark:border-slate-700
                                cursor-pointer hover:shadow-md transition-shadow
                                ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}
                              `}
                              onClick={() => onTaskClick && onTaskClick(task)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {task?.title || 'Untitled Task'}
                                </h4>
                                <div className="flex items-center gap-1 ml-2">
                                  {onEdit && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task);
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <ApperIcon name="Edit2" className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {onDelete && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(task);
                                      }}
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <ApperIcon name="Trash2" className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Badge 
                                    variant={getPriorityVariant(task?.priority)} 
                                    className="text-xs"
                                  >
                                    <ApperIcon 
                                      name={getPriorityIcon(task?.priority)} 
                                      className="w-3 h-3 mr-1" 
                                    />
                                    {task?.priority || 'Low'}
                                  </Badge>
                                </div>
                              </div>
                              
                              {task?.description && (
                                <p className="text-gray-600 dark:text-slate-300 text-sm mb-3">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-slate-400">
                                  {getProjectName(task?.projectId)}
                                </span>
                                
                                {task?.dueDate && (
                                  <span className={`
                                    ${isOverdue(task.dueDate) 
                                      ? 'text-red-600 dark:text-red-400' 
                                      : 'text-gray-500 dark:text-slate-400'
                                    }
                                  `}>
                                    {format(new Date(task.dueDate), 'MMM dd')}
                                  </span>
                                )}
                              </div>
                              
                              {task?.assignedTo && (
                                <div className="flex items-center mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {task.assignedTo.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="ml-2 text-xs text-gray-600 dark:text-slate-300">
                                    {task.assignedTo}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;