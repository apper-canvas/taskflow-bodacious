import { toast } from "react-toastify";

class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.apperClient = null;
    this.initClient();
  }

  initClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "is_recurring_c" } },
          { field: { Name: "recurring_id_c" } }
        ],
        orderBy: [
          { fieldName: "order_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        categoryId: record.category_id_c?.Id || record.category_id_c || '',
        priority: record.priority_c || 'medium',
        dueDate: record.due_date_c || null,
        completed: record.completed_c || false,
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        order: record.order_c || 0,
        isRecurring: record.is_recurring_c || false,
        recurringId: record.recurring_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
      }
      return [];
    }
  }

  async getById(Id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "is_recurring_c" } },
          { field: { Name: "recurring_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, Id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const record = response.data;
      return {
        Id: record.Id,
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        categoryId: record.category_id_c?.Id || record.category_id_c || '',
        priority: record.priority_c || 'medium',
        dueDate: record.due_date_c || null,
        completed: record.completed_c || false,
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        order: record.order_c || 0,
        isRecurring: record.is_recurring_c || false,
        recurringId: record.recurring_id_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with Id ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with Id ${Id}:`, error.message);
      }
      return null;
    }
  }

  create(taskData) {
    try {
      if (!this.apperClient) this.initClient();
      
      // Transform UI format to database format - only Updateable fields
      const dbRecord = {
        Name: taskData.title || '',
        title_c: taskData.title || '',
        description_c: taskData.description || '',
        category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        priority_c: taskData.priority || 'medium',
        due_date_c: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        completed_c: taskData.completed || false,
        created_at_c: new Date().toISOString(),
        order_c: taskData.order || 0,
        is_recurring_c: taskData.isRecurring || false,
        recurring_id_c: taskData.recurringId || null
      };

      const params = {
        records: [dbRecord]
      };

      const response = this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            title: createdRecord.title_c || createdRecord.Name || '',
            description: createdRecord.description_c || '',
            categoryId: createdRecord.category_id_c?.Id || createdRecord.category_id_c || '',
            priority: createdRecord.priority_c || 'medium',
            dueDate: createdRecord.due_date_c || null,
            completed: createdRecord.completed_c || false,
            createdAt: createdRecord.created_at_c || createdRecord.CreatedOn || new Date().toISOString(),
            order: createdRecord.order_c || 0,
            isRecurring: createdRecord.is_recurring_c || false,
            recurringId: createdRecord.recurring_id_c || null
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      return null;
    }
  }

  update(Id, updates) {
    try {
      if (!this.apperClient) this.initClient();
      
      // Transform UI format to database format - only Updateable fields
      const dbUpdates = {
        Id: Id
      };

      if (updates.title !== undefined) {
        dbUpdates.Name = updates.title;
        dbUpdates.title_c = updates.title;
      }
      if (updates.description !== undefined) dbUpdates.description_c = updates.description;
      if (updates.categoryId !== undefined) dbUpdates.category_id_c = updates.categoryId ? parseInt(updates.categoryId) : null;
      if (updates.priority !== undefined) dbUpdates.priority_c = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date_c = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;
      if (updates.completed !== undefined) dbUpdates.completed_c = updates.completed;
      if (updates.order !== undefined) dbUpdates.order_c = updates.order;
      if (updates.isRecurring !== undefined) dbUpdates.is_recurring_c = updates.isRecurring;
      if (updates.recurringId !== undefined) dbUpdates.recurring_id_c = updates.recurringId;

      const params = {
        records: [dbUpdates]
      };

      const response = this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            title: updatedRecord.title_c || updatedRecord.Name || '',
            description: updatedRecord.description_c || '',
            categoryId: updatedRecord.category_id_c?.Id || updatedRecord.category_id_c || '',
            priority: updatedRecord.priority_c || 'medium',
            dueDate: updatedRecord.due_date_c || null,
            completed: updatedRecord.completed_c || false,
            createdAt: updatedRecord.created_at_c || updatedRecord.CreatedOn || new Date().toISOString(),
            order: updatedRecord.order_c || 0,
            isRecurring: updatedRecord.is_recurring_c || false,
            recurringId: updatedRecord.recurring_id_c || null
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
      }
      return null;
    }
  }

  delete(Id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        RecordIds: [Id]
      };

      const response = this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      return false;
    }
  }

  async createRecurring(taskData) {
    try {
      const tasks = this.generateRecurringTasks(taskData);
      
      // Create all tasks in database
      const createdTasks = [];
      for (const task of tasks) {
        const created = this.create(task);
        if (created) {
          createdTasks.push(created);
        }
      }
      
      return createdTasks;
    } catch (error) {
      console.error("Error creating recurring tasks:", error.message);
      return [];
    }
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
    
    const maxTasks = endType === "occurrences" ? occurrences : 50;
    const endDateTime = endDate ? new Date(endDate) : null;
    const recurringId = `recurring_${Date.now()}`;

    for (let i = 0; i < maxTasks; i++) {
      if (endType === "date" && endDateTime && currentDate > endDateTime) {
        break;
      }

      const task = {
        ...baseTask,
        dueDate: new Date(currentDate).toISOString(),
        createdAt: new Date().toISOString(),
        order: i,
        isRecurring: true,
        recurringId: recurringId,
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