import activityService from './activityService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClientService {
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
          { field: { Name: "email_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("client_c", params);
      
      if (!response.success) {
        console.error("Error fetching clients:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching clients:", error.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };
      
      const response = await this.getApperClient().getRecordById("client_c", parseInt(id), params);
      
if (!response.success) {
        console.error("Error fetching client with ID " + id + ":", response.message);
        throw new Error(response.message);
      }
      
      return response.data;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching client with ID " + id + ":", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching client with ID " + id + ":", error.message);
        throw error;
      }
    }
  }

  async create(clientData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Name: clientData.name,
          email_c: clientData.email,
          company_c: clientData.company,
          phone_c: clientData.phone || "",
          createdAt_c: new Date().toISOString()
        }]
      };
      
      const response = await this.getApperClient().createRecord("client_c", params);
      
      if (!response.success) {
        console.error("Error creating client:", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create client");
        }
        
        const createdClient = successfulRecords[0]?.data;
        if (createdClient) {
          // Log activity
          await activityService.logActivity('Create', 'Client', createdClient.Id);
        }
        
        return createdClient;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating client:", error.message);
        throw error;
      }
    }
  }

  async update(id, clientData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Id: parseInt(id),
          Name: clientData.name,
          email_c: clientData.email,
          company_c: clientData.company,
          phone_c: clientData.phone || ""
        }]
      };
      
      const response = await this.getApperClient().updateRecord("client_c", params);
      
      if (!response.success) {
console.error("Error updating client with ID " + id + ":", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update client");
        }
        
        const updatedClient = successfulRecords[0]?.data;
        if (updatedClient) {
          // Log activity
          await activityService.logActivity('Update', 'Client', parseInt(id));
        }
        
        return updatedClient;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
console.error("Error updating client with ID " + id + ":", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating client with ID " + id + ":", error.message);
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
      
      const response = await this.getApperClient().deleteRecord("client_c", params);
      
      if (!response.success) {
console.error("Error deleting client with ID " + id + ":", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete client");
        }
        
        if (successfulDeletions.length > 0) {
          // Log activity
          await activityService.logActivity('Delete', 'Client', parseInt(id));
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
console.error("Error deleting client with ID " + id + ":", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting client with ID " + id + ":", error.message);
        throw error;
      }
    }
  }
}

export default new ClientService();