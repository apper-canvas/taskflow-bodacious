import taskData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.tasks];
  }

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const task = this.tasks.find(t => t.Id === Id);
    if (!task) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    return { ...task };
  }

  create(taskData) {
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      order: this.tasks.length,
    };
    
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  update(Id, updates) {
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  delete(Id) {
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  getByCategory(categoryId) {
    return this.tasks.filter(task => task.categoryId === categoryId);
  }

  getOverdue() {
    const now = new Date();
    return this.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      !task.completed
    );
  }

  getToday() {
    const today = new Date().toDateString();
    return this.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate).toDateString() === today &&
      !task.completed
);
  }

  async createRecurring(taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tasks = this.generateRecurringTasks(taskData);
    
    // Add all tasks to the collection
    tasks.forEach(task => {
      this.tasks.unshift(task);
    });
    
    return [...tasks];
  }

  generateRecurringTasks(taskData) {
    const {
      frequency,
      interval,
      endType,
      occurrences,
      endDate,
      weekdays,
      dueDate,
      ...baseTask
    } = taskData;

    const tasks = [];
    const startDate = new Date(dueDate);
    let currentDate = new Date(startDate);
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    
    const maxTasks = endType === "occurrences" ? occurrences : 50;
    const endDateTime = endDate ? new Date(endDate) : null;

    for (let i = 0; i < maxTasks; i++) {
      if (endType === "date" && endDateTime && currentDate > endDateTime) {
        break;
      }

      const task = {
        ...baseTask,
        Id: maxId + i + 1,
        dueDate: new Date(currentDate).toISOString(),
        createdAt: new Date().toISOString(),
        order: this.tasks.length + i,
        isRecurring: true,
        recurringId: `recurring_${maxId + 1}`,
        completed: false,
      };

      tasks.push(task);

      // Calculate next occurrence
      switch (frequency) {
        case "daily":
          currentDate = this.addDays(currentDate, interval);
          break;
        case "weekly":
          if (weekdays && weekdays.length > 0) {
            currentDate = this.getNextWeekday(currentDate, weekdays, interval);
          } else {
            currentDate = this.addWeeks(currentDate, interval);
          }
          break;
        case "monthly":
          currentDate = this.addMonths(currentDate, interval);
          break;
        default:
          break;
      }
    }

    return tasks;
  }

  // Helper methods for date calculations
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addWeeks(date, weeks) {
    return this.addDays(date, weeks * 7);
  }

  addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  getNextWeekday(date, weekdays, intervalWeeks) {
    let nextDate = this.addDays(date, 1);
    
    for (let i = 0; i < 7; i++) {
      const dayOfWeek = nextDate.getDay();
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      
      if (weekdays.includes(adjustedDay)) {
        return nextDate;
      }
      
      nextDate = this.addDays(nextDate, 1);
    }
    
    // If no weekday found in current week, move to next interval
    return this.addWeeks(date, intervalWeeks);
  }
}

export const taskService = new TaskService();