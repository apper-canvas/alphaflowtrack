const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      await delay(300);
const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { Name: "projectId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "title_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignedTo_c" } }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      await delay(200);
const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { Name: "projectId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "title_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignedTo_c" } }
        ]
      };
      
      const response = await this.getApperClient().getRecordById("task_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching task with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async getByProjectId(projectId) {
    try {
      await delay(250);
const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { Name: "projectId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "title_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignedTo_c" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(`Error fetching tasks for project ${projectId}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching tasks for project ${projectId}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching tasks for project ${projectId}:`, error.message);
        throw error;
      }
    }
  }

  async create(taskData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Name: taskData.title,
          projectId_c: parseInt(taskData.projectId),
          title_c: taskData.title,
          status_c: taskData.status,
          priority_c: taskData.priority,
          dueDate_c: taskData.dueDate,
          assignedTo_c: taskData.assignedTo || ""
        }]
      };
      
      const response = await this.getApperClient().createRecord("task_c", params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create task");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating task:", error.message);
        throw error;
      }
    }
  }

  async update(id, taskData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          projectId_c: parseInt(taskData.projectId),
          title_c: taskData.title,
          status_c: taskData.status,
          priority_c: taskData.priority,
          dueDate_c: taskData.dueDate,
          assignedTo_c: taskData.assignedTo || ""
        }]
      };
      
      const response = await this.getApperClient().updateRecord("task_c", params);
      
      if (!response.success) {
        console.error(`Error updating task with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update task");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating task with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error updating task with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      await delay(300);
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.getApperClient().deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error(`Error deleting task with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete task");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error deleting task with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error deleting task with ID ${id}:`, error.message);
        throw error;
      }
    }
  }
}

export default new TaskService();