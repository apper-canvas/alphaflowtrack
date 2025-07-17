import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.projects]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = this.projects.find(p => p.Id === parseInt(id));
        if (project) {
          resolve({ ...project });
        } else {
          reject(new Error("Project not found"));
        }
      }, 200);
    });
  }

  async getByClientId(clientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clientProjects = this.projects.filter(p => p.clientId === parseInt(clientId));
        resolve([...clientProjects]);
      }, 250);
    });
  }

  async create(projectData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.projects.map(p => p.Id)) + 1;
        const newProject = {
          Id: newId,
          ...projectData,
          createdAt: new Date().toISOString()
        };
        this.projects.push(newProject);
        resolve({ ...newProject });
      }, 300);
    });
  }

  async update(id, projectData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.projects.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          this.projects[index] = { ...this.projects[index], ...projectData };
          resolve({ ...this.projects[index] });
        } else {
          reject(new Error("Project not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.projects.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          this.projects.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Project not found"));
        }
      }, 300);
    });
  }
}

export default new ProjectService();