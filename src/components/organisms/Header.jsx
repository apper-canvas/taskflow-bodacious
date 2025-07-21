import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onSearch, completionRate = 0, totalTasks = 0, completedTasks = 0 }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
<motion.header
      className="bg-white border-b border-gray-200/50 px-8 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-8">
          <div>
            <h1 className="text-2xl font-bold gradient-text font-display">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {greeting}! You have {totalTasks - completedTasks} tasks remaining.
            </p>
          </div>
        </div>

<div className="flex items-center space-x-8">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-64"
          />
          
          {totalTasks > 0 && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {completedTasks} of {totalTasks}
                </div>
                <div className="text-xs text-gray-500">
                  tasks completed
                </div>
              </div>
              <ProgressRing 
                progress={completionRate} 
                size={50} 
                strokeWidth={4}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <motion.div 
              className="p-2 rounded-lg bg-gradient-to-br from-surface to-gray-50 hover:from-primary-50 hover:to-accent-50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Bell" className="w-5 h-5 text-gray-600" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;