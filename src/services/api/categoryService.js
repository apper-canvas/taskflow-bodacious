import { toast } from "react-toastify";

class CategoryService {
  constructor() {
    this.tableName = 'category_c';
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } }
        ],
        orderBy: [
          { fieldName: "order_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(record => ({
        Id: record.Id,
        name: record.Name || '',
        color: record.color_c || 'blue',
        icon: record.icon_c || 'Folder',
        order: record.order_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, Id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const record = response.data;
      return {
        Id: record.Id,
        name: record.Name || '',
        color: record.color_c || 'blue',
        icon: record.icon_c || 'Folder',
        order: record.order_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with Id ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with Id ${Id}:`, error.message);
      }
      return null;
    }
  }

  create(categoryData) {
    try {
      if (!this.apperClient) this.initClient();
      
      // Transform UI format to database format - only Updateable fields
      const dbRecord = {
        Name: categoryData.name || '',
        color_c: categoryData.color || 'blue',
        icon_c: categoryData.icon || 'Folder',
        order_c: categoryData.order || 0
      };

      const params = {
        records: [dbRecord]
      };

      const response = this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} category records:${JSON.stringify(failedRecords)}`);
          
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
            name: createdRecord.Name || '',
            color: createdRecord.color_c || 'blue',
            icon: createdRecord.icon_c || 'Folder',
            order: createdRecord.order_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error.message);
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

      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color_c = updates.color;
      if (updates.icon !== undefined) dbUpdates.icon_c = updates.icon;
      if (updates.order !== undefined) dbUpdates.order_c = updates.order;

      const params = {
        records: [dbUpdates]
      };

      const response = this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} category records:${JSON.stringify(failedUpdates)}`);
          
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
            name: updatedRecord.Name || '',
            color: updatedRecord.color_c || 'blue',
            icon: updatedRecord.icon_c || 'Folder',
            order: updatedRecord.order_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error.message);
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
        console.error("Error deleting category:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} category records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error.message);
      }
      return false;
    }
  }
}

export const categoryService = new CategoryService();