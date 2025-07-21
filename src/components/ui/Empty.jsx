import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet", 
  description = "Create your first task to get started with TaskFlow", 
  actionLabel = "Add Task",
  onAction,
  icon = "CheckCircle2"
}) => {
return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-8 mb-8">
        <ApperIcon name={icon} className="w-12 h-12 gradient-text" />
      </div>
<h3 className="text-xl font-bold gradient-text mb-4">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-10 max-w-md leading-relaxed">
        {description}
      </p>
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} variant="accent" size="lg">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
      
<div className="flex items-center space-x-8 mt-12 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" className="w-4 h-4" />
          <span>Quick Add</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Tag" className="w-4 h-4" />
          <span>Categories</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Due Dates</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;