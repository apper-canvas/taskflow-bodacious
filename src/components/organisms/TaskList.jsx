import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  searchTerm = "",
  selectedCategoryId,
  loading = false,
  error = null,
  onTaskUpdated,
  onTaskDeleted,
  onRetry 
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = localTasks;

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(task => task.categoryId === selectedCategoryId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by completion status, then by due date, then by priority
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Sort by due date (overdue first, then by date)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [localTasks, selectedCategoryId, searchTerm]);

  const handleTaskUpdated = (updatedTask) => {
    setLocalTasks(prev => 
      prev.map(task => task.Id === updatedTask.Id ? updatedTask : task)
    );
    onTaskUpdated?.(updatedTask);
  };

  const handleTaskDeleted = (taskId) => {
    setLocalTasks(prev => prev.filter(task => task.Id !== taskId));
    onTaskDeleted?.(taskId);
  };

  if (loading) return <Loading />;
  
  if (error) return <Error message={error} onRetry={onRetry} />;

  if (filteredTasks.length === 0) {
    const emptyMessage = searchTerm 
      ? `No tasks found for "${searchTerm}"`
      : selectedCategoryId 
        ? "No tasks in this category"
        : "No tasks yet";
    
    const emptyDescription = searchTerm
      ? "Try adjusting your search terms or check a different category."
      : selectedCategoryId
        ? "Create a new task in this category to get started."
        : "Create your first task to get started with TaskFlow";

    return (
      <Empty 
        title={emptyMessage}
        description={emptyDescription}
        icon={searchTerm ? "Search" : "CheckCircle2"}
      />
    );
  }

return (
    <div className="space-y-6">
    <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
            {selectedCategoryId ? categories.find(cat => cat.Id === selectedCategoryId)?.name || "Category" : "All Tasks"}
            <span className="text-sm font-normal text-gray-500 ml-2">({filteredTasks.filter(task => !task.completed).length}active)
                          </span>
        </h2>
    </div>
    <div className="space-y-4">
        <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => <motion.div
                key={task.Id}
                layout
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    scale: 0.95
                }}
                transition={{
                    duration: 0.3,
                    delay: index * 0.05
                }}>
                <TaskCard
                    task={task}
                    categories={categories}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted} />
            </motion.div>)}))
                    </AnimatePresence>
    </div></div>
  );
};

export default TaskList;