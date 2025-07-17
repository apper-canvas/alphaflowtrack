const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
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

  async getAll(limit = 10) {
    try {
      await delay(300);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "activityType_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "entityType_c" } },
          { 
            field: { Name: "user_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };
      
      const response = await this.getApperClient().fetchRecords("activity_log_c", params);
      
      if (!response.success) {
        console.error("Error fetching activities:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities:", error.message);
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
          { field: { Name: "activityType_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "entityType_c" } },
          { 
            field: { Name: "user_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.getApperClient().getRecordById("activity_log_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching activity with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching activity with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(activityData) {
    try {
      await delay(200);
      const params = {
        records: [{
          Name: `${activityData.activityType} - ${activityData.entityType}`,
          activityType_c: activityData.activityType,
          timestamp_c: new Date().toISOString(),
          entityId_c: activityData.entityId.toString(),
          entityType_c: activityData.entityType,
          user_c: activityData.userId || 1 // Default to user ID 1 if not provided
        }]
      };
      
      const response = await this.getApperClient().createRecord("activity_log_c", params);
      
      if (!response.success) {
        console.error("Error creating activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create activity");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating activity:", error.message);
        throw error;
      }
    }
  }

  async update(id, activityData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${activityData.activityType} - ${activityData.entityType}`,
          activityType_c: activityData.activityType,
          timestamp_c: activityData.timestamp,
          entityId_c: activityData.entityId.toString(),
          entityType_c: activityData.entityType,
          user_c: activityData.userId
        }]
      };
      
      const response = await this.getApperClient().updateRecord("activity_log_c", params);
      
      if (!response.success) {
        console.error(`Error updating activity with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update activity");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating activity with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error updating activity with ID ${id}:`, error.message);
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
      
      const response = await this.getApperClient().deleteRecord("activity_log_c", params);
      
      if (!response.success) {
        console.error(`Error deleting activity with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete activity");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error deleting activity with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error deleting activity with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  // Helper method to log activity
  async logActivity(activityType, entityType, entityId, userId = 1) {
    try {
      await this.create({
        activityType,
        entityType,
        entityId,
        userId
      });
    } catch (error) {
      // Log error but don't throw - activity logging shouldn't break main operations
      console.error("Failed to log activity:", error);
    }
  }
}

export default new ActivityService();