import React, { useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import TaskCard from '@/components/molecules/TaskCard'
import Empty from '@/components/ui/Empty'

const KanbanBoard = ({ tasks, projects, onEdit, onDelete, onDragEnd }) => {
  // Suppress defaultProps warning from react-beautiful-dnd library
  // This is a known issue with the library's internal implementation
  // TODO: Remove when react-beautiful-dnd is updated to remove defaultProps
  useEffect(() => {
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args[0]?.includes && args[0].includes('Support for defaultProps will be removed from memo components')) {
        return
      }
      originalWarn.apply(console, args)
    }
    
    return () => {
      console.warn = originalWarn
    }
  }, [])
  const columns = [
    { id: "To Do", title: "To Do", color: "bg-slate-100 dark:bg-slate-800", icon: "Circle" },
    { id: "In Progress", title: "In Progress", color: "bg-amber-100 dark:bg-amber-900/20", icon: "Clock" },
    { id: "Review", title: "Review", color: "bg-blue-100 dark:bg-blue-900/20", icon: "Eye" },
    { id: "Done", title: "Done", color: "bg-emerald-100 dark:bg-emerald-900/20", icon: "CheckCircle" }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.name : "Unknown Project";
  };

  if (tasks.length === 0) {
    return (
      <Empty
        icon="Kanban"
        title="No tasks available"
        description="Tasks will appear here once you create them. Get started by adding your first task!"
        actionLabel="Add Task"
        onAction={() => {}}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-md ${column.color}`}>
                    <ApperIcon name={column.icon} size={16} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {column.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {columnTasks.length} tasks
                    </p>
                  </div>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-3 transition-colors duration-200 ${
                      snapshot.isDraggingOver ? "bg-slate-50 dark:bg-slate-800/50 rounded-lg" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.Id} draggableId={task.Id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? "rotate-2 scale-105" : ""
                            }`}
                          >
                            <TaskCard
                              task={task}
                              projectName={getProjectName(task.projectId)}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <ApperIcon name="Plus" size={20} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;