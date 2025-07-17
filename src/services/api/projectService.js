const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
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
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "actualSpend_c" } },
          { field: { Name: "timeline_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "clientId_c" } }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error("Error fetching projects:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching projects:", error.message);
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
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "actualSpend_c" } },
          { field: { Name: "timeline_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "clientId_c" } }
        ]
      };
      
      const response = await this.getApperClient().getRecordById("project_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching project with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async getByClientId(clientId) {
    try {
      await delay(250);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "status_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "clientId_c" } }
        ],
        where: [
          {
            FieldName: "clientId_c",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error(`Error fetching projects for client ${clientId}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching projects for client ${clientId}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching projects for client ${clientId}:`, error.message);
        throw error;
      }
    }
  }

  async create(projectData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Name: projectData.name,
          status_c: projectData.status,
          progress_c: projectData.progress || 0,
          deadline_c: projectData.deadline,
          budget_c: projectData.budget,
          createdAt_c: new Date().toISOString(),
          actualSpend_c: 0,
          timeline_c: projectData.timeline || "",
          description_c: projectData.description || "",
          startDate_c: projectData.startDate || new Date().toISOString(),
          endDate_c: projectData.endDate || projectData.deadline,
          clientId_c: parseInt(projectData.clientId)
        }]
      };
      
      const response = await this.getApperClient().createRecord("project_c", params);
      
      if (!response.success) {
        console.error("Error creating project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create project");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating project:", error.message);
        throw error;
      }
    }
  }

  async update(id, projectData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Id: parseInt(id),
          Name: projectData.name,
          status_c: projectData.status,
          progress_c: projectData.progress,
          deadline_c: projectData.deadline,
          budget_c: projectData.budget,
          actualSpend_c: projectData.actualSpend,
          timeline_c: projectData.timeline || "",
          description_c: projectData.description || "",
          startDate_c: projectData.startDate,
          endDate_c: projectData.endDate,
          clientId_c: parseInt(projectData.clientId)
        }]
      };
      
      const response = await this.getApperClient().updateRecord("project_c", params);
      
      if (!response.success) {
        console.error(`Error updating project with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update project");
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating project with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error updating project with ID ${id}:`, error.message);
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
      
      const response = await this.getApperClient().deleteRecord("project_c", params);
      
      if (!response.success) {
        console.error(`Error deleting project with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete project");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error deleting project with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error deleting project with ID ${id}:`, error.message);
        throw error;
      }
    }
  }
}

export default new ProjectService();