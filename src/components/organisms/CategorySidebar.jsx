import { motion } from "framer-motion";
import CategoryCard from "@/components/molecules/CategoryCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CategorySidebar = ({ 
  categories = [], 
  tasks = [], 
  selectedCategoryId, 
  onCategorySelect,
  onShowAll 
}) => {
  const getTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length;
  };

  const allTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <motion.aside
      className="w-80 bg-gradient-to-br from-surface/30 to-white border-r border-gray-200/50 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Categories
          </h2>
          
          <div className="space-y-3">
            <CategoryCard
              category={{
                Id: "all",
                name: "All Tasks",
                icon: "Inbox",
                color: "gray"
              }}
              taskCount={allTasksCount}
              isActive={!selectedCategoryId}
              onClick={onShowAll}
            />
            
            {categories.map((category) => (
              <CategoryCard
                key={category.Id}
                category={category}
                taskCount={getTaskCount(category.Id)}
                isActive={selectedCategoryId === category.Id}
                onClick={() => onCategorySelect(category.Id)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 font-display">
            Quick Stats
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200/50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-success/10 rounded">
                  <ApperIcon name="CheckCircle2" className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="font-semibold text-success">
                {tasks.filter(task => task.completed).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200/50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-error/10 rounded">
                  <ApperIcon name="AlertTriangle" className="w-4 h-4 text-error" />
                </div>
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <span className="font-semibold text-error">
                {tasks.filter(task => 
                  task.dueDate && 
                  new Date(task.dueDate) < new Date() && 
                  !task.completed
                ).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200/50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-accent/10 rounded">
                  <ApperIcon name="Clock" className="w-4 h-4 text-accent-600" />
                </div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
              <span className="font-semibold text-accent-600">
                {tasks.filter(task => {
                  if (!task.dueDate || task.completed) return false;
                  const today = new Date().toDateString();
                  return new Date(task.dueDate).toDateString() === today;
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default CategorySidebar;