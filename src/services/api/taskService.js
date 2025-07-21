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
}

export const taskService = new TaskService();