import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Checkbox from "@/components/atoms/Checkbox";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from "date-fns";

const RecurringTaskModal = ({ taskData, categories, isOpen, onClose, onTasksCreated }) => {
  const [recurringData, setRecurringData] = useState({
    frequency: "daily",
    interval: 1,
    endType: "occurrences",
    occurrences: 5,
    endDate: "",
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
    monthlyType: "dayOfMonth",
    dayOfMonth: 1,
  });

  const [previewDates, setPreviewDates] = useState([]);

  useEffect(() => {
    if (isOpen && taskData.dueDate) {
      generatePreviewDates();
    }
  }, [recurringData, taskData.dueDate, isOpen]);

  const generatePreviewDates = () => {
    if (!taskData.dueDate) return;

    const startDate = new Date(taskData.dueDate);
    const dates = [];
    let currentDate = new Date(startDate);
    const maxPreview = 10;

    for (let i = 0; i < Math.min(recurringData.occurrences, maxPreview); i++) {
      if (recurringData.endType === "date" && recurringData.endDate) {
        const endDate = new Date(recurringData.endDate);
        if (currentDate > endDate) break;
      }

      dates.push(new Date(currentDate));

      // Calculate next occurrence
      switch (recurringData.frequency) {
        case "daily":
          currentDate = addDays(currentDate, recurringData.interval);
          break;
        case "weekly":
          if (recurringData.weekdays.length > 0) {
            // Find next weekday
            let nextDate = addDays(currentDate, 1);
            let found = false;
            for (let j = 0; j < 7; j++) {
              const dayOfWeek = nextDate.getDay();
              const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
              if (recurringData.weekdays.includes(adjustedDay)) {
                currentDate = nextDate;
                found = true;
                break;
              }
              nextDate = addDays(nextDate, 1);
            }
            if (!found) {
              currentDate = addWeeks(currentDate, recurringData.interval);
            }
          } else {
            currentDate = addWeeks(currentDate, recurringData.interval);
          }
          break;
        case "monthly":
          currentDate = addMonths(currentDate, recurringData.interval);
          break;
        default:
          break;
      }
    }

    setPreviewDates(dates);
  };

  const handleCreateRecurring = async () => {
    if (!taskData.title.trim() || !taskData.dueDate) {
      toast.error("Please fill in task title and due date");
      return;
    }

    try {
      const recurringTasks = await taskService.createRecurring({
        ...taskData,
        ...recurringData,
        completed: false,
      });

      toast.success(`Created ${recurringTasks.length} recurring tasks!`);
      onTasksCreated(recurringTasks);
    } catch (error) {
      toast.error("Failed to create recurring tasks");
    }
  };

  const weekdayOptions = [
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
    { value: 7, label: "Sun" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <ApperIcon name="Repeat" className="w-5 h-5" />
              <span>Set Recurring Task</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Task Details</h3>
            <p className="text-sm text-gray-600">
              <strong>Title:</strong> {taskData.title || "No title"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Due Date:</strong> {taskData.dueDate ? format(new Date(taskData.dueDate), "PPP") : "No date set"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Repeat Frequency">
              <Select
                value={recurringData.frequency}
                onChange={(e) => setRecurringData({ ...recurringData, frequency: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormField>

            <FormField label="Repeat Every">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={recurringData.interval}
                  onChange={(e) => setRecurringData({ ...recurringData, interval: parseInt(e.target.value) || 1 })}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">
                  {recurringData.frequency === "daily" && "day(s)"}
                  {recurringData.frequency === "weekly" && "week(s)"}
                  {recurringData.frequency === "monthly" && "month(s)"}
                </span>
              </div>
            </FormField>
          </div>

          {recurringData.frequency === "weekly" && (
            <FormField label="Repeat On">
              <div className="flex flex-wrap gap-2">
                {weekdayOptions.map((day) => (
                  <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={recurringData.weekdays.includes(day.value)}
                      onChange={(checked) => {
                        if (checked) {
                          setRecurringData({
                            ...recurringData,
                            weekdays: [...recurringData.weekdays, day.value].sort(),
                          });
                        } else {
                          setRecurringData({
                            ...recurringData,
                            weekdays: recurringData.weekdays.filter(d => d !== day.value),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            </FormField>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="End Condition">
              <Select
                value={recurringData.endType}
                onChange={(e) => setRecurringData({ ...recurringData, endType: e.target.value })}
              >
                <option value="occurrences">After number of occurrences</option>
                <option value="date">On specific date</option>
              </Select>
            </FormField>

            {recurringData.endType === "occurrences" ? (
              <FormField label="Number of Tasks">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={recurringData.occurrences}
                  onChange={(e) => setRecurringData({ ...recurringData, occurrences: parseInt(e.target.value) || 1 })}
                />
              </FormField>
            ) : (
              <FormField label="End Date">
                <Input
                  type="date"
                  value={recurringData.endDate}
                  onChange={(e) => setRecurringData({ ...recurringData, endDate: e.target.value })}
                />
              </FormField>
            )}
          </div>

          {previewDates.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>Preview - First {Math.min(previewDates.length, 10)} Tasks</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {previewDates.slice(0, 10).map((date, index) => (
                  <div key={index} className="bg-white p-2 rounded text-sm text-center border">
                    {format(date, "MMM d, yyyy")}
                  </div>
                ))}
              </div>
              {previewDates.length > 10 && (
                <p className="text-sm text-blue-600 mt-2">
                  And {previewDates.length - 10} more tasks...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRecurring}
            disabled={!taskData.title.trim() || !taskData.dueDate}
          >
            Create {recurringData.occurrences} Recurring Tasks
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecurringTaskModal;