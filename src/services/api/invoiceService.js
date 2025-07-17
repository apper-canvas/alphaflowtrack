import activityService from './activityService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InvoiceService {
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
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "projectId_c" } }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("app_invoice_c", params);
      
      if (!response.success) {
        console.error("Error fetching invoices:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching invoices:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching invoices:", error.message);
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
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "projectId_c" } }
        ]
      };
      
      const response = await this.getApperClient().getRecordById("app_invoice_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching invoice with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching invoice with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching invoice with ID ${id}:`, error.message);
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
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "projectId_c" } }
        ],
        where: [
          {
            FieldName: "clientId_c",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };
      
      const response = await this.getApperClient().fetchRecords("app_invoice_c", params);
      
      if (!response.success) {
        console.error(`Error fetching invoices for client ${clientId}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching invoices for client ${clientId}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching invoices for client ${clientId}:`, error.message);
        throw error;
      }
    }
  }

  async create(invoiceData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Name: `INV-${Date.now()}`,
          amount_c: invoiceData.amount,
          status_c: invoiceData.status,
          dueDate_c: invoiceData.dueDate,
          items_c: JSON.stringify(invoiceData.items),
          clientId_c: parseInt(invoiceData.clientId),
          projectId_c: parseInt(invoiceData.projectId)
        }]
      };
      
      const response = await this.getApperClient().createRecord("app_invoice_c", params);
      
      if (!response.success) {
        console.error("Error creating invoice:", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create invoice");
        }
        
        const createdInvoice = successfulRecords[0]?.data;
        if (createdInvoice) {
          // Log activity
          await activityService.logActivity('Create', 'Invoice', createdInvoice.Id);
        }
        
        return createdInvoice;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating invoice:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating invoice:", error.message);
        throw error;
      }
    }
  }

  async update(id, invoiceData) {
    try {
      await delay(300);
      const params = {
        records: [{
          Id: parseInt(id),
          Name: invoiceData.name,
          amount_c: invoiceData.amount,
          status_c: invoiceData.status,
          dueDate_c: invoiceData.dueDate,
          items_c: JSON.stringify(invoiceData.items),
          clientId_c: parseInt(invoiceData.clientId),
          projectId_c: parseInt(invoiceData.projectId)
        }]
      };
      
      const response = await this.getApperClient().updateRecord("app_invoice_c", params);
      
      if (!response.success) {
        console.error(`Error updating invoice with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update invoice");
        }
        
        const updatedInvoice = successfulRecords[0]?.data;
        if (updatedInvoice) {
          // Log activity
          await activityService.logActivity('Update', 'Invoice', parseInt(id));
        }
        
        return updatedInvoice;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating invoice with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error updating invoice with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async updateStatus(id, status, paymentDate = null) {
    try {
      await delay(300);
      const updateData = { status_c: status };
      if (paymentDate) {
        updateData.paymentDate = new Date(paymentDate).toISOString();
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await this.getApperClient().updateRecord("app_invoice_c", params);
      
      if (!response.success) {
        console.error(`Error updating invoice status with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update invoice status");
        }
        
        const updatedInvoice = successfulRecords[0]?.data;
        if (updatedInvoice) {
          // Log activity for status update
          await activityService.logActivity('Update', 'Invoice', parseInt(id));
        }
        
        return updatedInvoice;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating invoice status with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error updating invoice status with ID ${id}:`, error.message);
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
      
      const response = await this.getApperClient().deleteRecord("app_invoice_c", params);
      
      if (!response.success) {
        console.error(`Error deleting invoice with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete invoice");
        }
        
        if (successfulDeletions.length > 0) {
          // Log activity
          await activityService.logActivity('Delete', 'Invoice', parseInt(id));
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error deleting invoice with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error deleting invoice with ID ${id}:`, error.message);
        throw error;
      }
    }
  }
}

export default new InvoiceService();