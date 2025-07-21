import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RecurringTaskModal from "@/components/molecules/RecurringTaskModal";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
const QuickAddTask = ({ onTaskAdded, categories = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: "",
  });
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    if (isExpanded) {
      handleFullAdd();
    } else {
      // Quick add with just title
      const newTask = {
        title: taskData.title,
        description: "",
        categoryId: categories[0]?.Id || "",
        priority: "medium",
        dueDate: null,
        completed: false,
      };
      
      const createdTask = taskService.create(newTask);
      onTaskAdded?.(createdTask);
      toast.success("Task added successfully!");
      setTaskData({ ...taskData, title: "" });
    }
  };

  const handleFullAdd = () => {
    const newTask = {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      completed: false,
    };
    
    const createdTask = taskService.create(newTask);
    onTaskAdded?.(createdTask);
    toast.success("Task added successfully!");
    setTaskData({
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
      dueDate: "",
    });
    setIsExpanded(false);
  };

  return (
<motion.div
      className="bg-gradient-to-br from-white to-surface rounded-xl border border-gray-200/50 card-shadow p-8"
      layout
      transition={{ duration: 0.3 }}
    >
<form onSubmit={handleQuickAdd} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="text-base border-0 bg-transparent focus:ring-0 focus:border-0 p-0 placeholder:text-gray-400"
              autoFocus
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name={isExpanded ? "ChevronUp" : "Settings"} className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!taskData.title.trim()}
            className="px-6"
          >
            Add
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
className="space-y-6 pt-6 border-t border-gray-100"
          >
            <FormField label="Description">
              <Input
                type="text"
                placeholder="Task description..."
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
            </FormField>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Category">
                <Select
                  value={taskData.categoryId}
                  onChange={(e) => setTaskData({ ...taskData, categoryId: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Priority">
                <Select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormField>

<FormField label="Due Date">
                <Input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                />
              </FormField>
            </div>

<div className="flex justify-end pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRecurringModal(true)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Repeat" className="w-4 h-4" />
                <span>Set as Recurring</span>
              </Button>
            </div>
          </motion.div>
        )}
      </form>

      {showRecurringModal && (
        <RecurringTaskModal
          taskData={taskData}
          categories={categories}
          isOpen={showRecurringModal}
          onClose={() => setShowRecurringModal(false)}
          onTasksCreated={(tasks) => {
            tasks.forEach(task => onTaskAdded?.(task));
            setShowRecurringModal(false);
            setTaskData({
              title: "",
              description: "",
              categoryId: "",
              priority: "medium",
              dueDate: "",
            });
            setIsExpanded(false);
          }}
        />
)}
    </motion.div>
  );
};

export default QuickAddTask;