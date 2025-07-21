import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";

const TaskCard = ({ task, categories = [], onTaskUpdated, onTaskDeleted }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const category = categories.find(cat => cat.Id === task.categoryId);
  
  const priorityColors = {
    high: "error",
    medium: "warning",
    low: "success",
  };

  const priorityIcons = {
    high: "AlertCircle",
    medium: "Clock",
    low: "CheckCircle2",
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const handleToggleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      const updatedTask = taskService.update(task.Id, { 
        ...task, 
        completed: !task.completed 
      });
      
      if (updatedTask.completed) {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as incomplete");
      }
      
      onTaskUpdated?.(updatedTask);
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      taskService.delete(task.Id);
      onTaskDeleted?.(task.Id);
      toast.success("Task deleted");
    }
  };

  return (
<motion.div
      className={`group bg-white rounded-xl border border-gray-200/50 p-5 transition-all duration-200 hover:card-shadow-hover ${
        task.completed ? "opacity-60" : ""
      } ${isOverdue ? "border-error/30 bg-red-50/30" : ""}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
<div className="flex items-start space-x-4">
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium truncate ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? "text-gray-400" : "text-gray-600"
                }`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-error"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
          
<div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              {category && (
                <Badge variant="primary" className="text-xs">
                  <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
                  {category.name}
                </Badge>
              )}
              
              <Badge variant={priorityColors[task.priority]} className="text-xs">
                <ApperIcon 
                  name={priorityIcons[task.priority]} 
                  className={`w-3 h-3 mr-1 ${task.priority === "high" ? "animate-pulse-glow" : ""}`} 
                />
                {task.priority}
              </Badge>
            </div>
            
            {task.dueDate && (
              <div className={`text-xs flex items-center ${
                isOverdue ? "text-error font-medium" : "text-gray-500"
              }`}>
                <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                {format(new Date(task.dueDate), "MMM d")}
                {isOverdue && (
                  <span className="ml-1 text-error">
                    <ApperIcon name="AlertTriangle" className="w-3 h-3" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;