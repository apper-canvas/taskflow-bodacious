import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks and categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completionStats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      completedTasks,
      totalTasks,
      completionRate
    };
  }, [tasks]);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => task.Id === updatedTask.Id ? updatedTask : task)
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleShowAll = () => {
    setSelectedCategoryId(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        onSearch={setSearchTerm}
        completionRate={completionStats.completionRate}
        totalTasks={completionStats.totalTasks}
        completedTasks={completionStats.completedTasks}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar
          categories={categories}
          tasks={tasks}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          onShowAll={handleShowAll}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <QuickAddTask 
                categories={categories}
                onTaskAdded={handleTaskAdded}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TaskList
                tasks={tasks}
                categories={categories}
                searchTerm={searchTerm}
                selectedCategoryId={selectedCategoryId}
                loading={loading}
                error={error}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                onRetry={loadData}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;