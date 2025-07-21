import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const CategoryCard = ({ category, taskCount, isActive, onClick }) => {
  return (
<motion.div
      className={`group cursor-pointer rounded-xl p-5 transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-br from-primary-600 to-primary-500 text-white card-shadow-hover" 
          : "bg-white hover:bg-surface border border-gray-200/50 hover:card-shadow"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${
            isActive 
              ? "bg-white/20" 
              : `bg-gradient-to-br from-${category.color}-100 to-${category.color}-50`
          }`}>
            <ApperIcon 
              name={category.icon} 
              className={`w-4 h-4 ${
                isActive ? "text-white" : `text-${category.color}-600`
              }`} 
            />
          </div>
          <div>
            <h3 className={`font-medium text-sm ${
              isActive ? "text-white" : "text-gray-900"
            }`}>
              {category.name}
            </h3>
          </div>
        </div>
        
        <div className={`text-sm font-semibold ${
          isActive ? "text-white" : "text-gray-500"
        }`}>
          {taskCount}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;