import clientsData from "@/services/mockData/clients.json";

class ClientService {
  constructor() {
    this.clients = [...clientsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.clients]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = this.clients.find(c => c.Id === parseInt(id));
        if (client) {
          resolve({ ...client });
        } else {
          reject(new Error("Client not found"));
        }
      }, 200);
    });
  }

  async create(clientData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.clients.map(c => c.Id)) + 1;
        const newClient = {
          Id: newId,
          ...clientData,
          createdAt: new Date().toISOString()
        };
        this.clients.push(newClient);
        resolve({ ...newClient });
      }, 300);
    });
  }

  async update(id, clientData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.clients.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.clients[index] = { ...this.clients[index], ...clientData };
          resolve({ ...this.clients[index] });
        } else {
          reject(new Error("Client not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.clients.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.clients.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Client not found"));
        }
      }, 300);
    });
  }
}

export default new ClientService();