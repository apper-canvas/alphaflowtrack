import invoicesData from "@/services/mockData/invoices.json";

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.invoices]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invoice = this.invoices.find(i => i.Id === parseInt(id));
        if (invoice) {
          resolve({ ...invoice });
        } else {
          reject(new Error("Invoice not found"));
        }
      }, 200);
    });
  }

  async getByClientId(clientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clientInvoices = this.invoices.filter(i => i.clientId === parseInt(clientId));
        resolve([...clientInvoices]);
      }, 250);
    });
  }

  async create(invoiceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.invoices.map(i => i.Id)) + 1;
        const newInvoice = {
          Id: newId,
          ...invoiceData
        };
        this.invoices.push(newInvoice);
        resolve({ ...newInvoice });
      }, 300);
    });
  }

  async update(id, invoiceData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.invoices.findIndex(i => i.Id === parseInt(id));
        if (index !== -1) {
          this.invoices[index] = { ...this.invoices[index], ...invoiceData };
          resolve({ ...this.invoices[index] });
        } else {
          reject(new Error("Invoice not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.invoices.findIndex(i => i.Id === parseInt(id));
        if (index !== -1) {
          this.invoices.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Invoice not found"));
        }
      }, 300);
    });
  }
}

export default new InvoiceService();