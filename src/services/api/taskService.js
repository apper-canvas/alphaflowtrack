import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.tasks]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = this.tasks.find(t => t.Id === parseInt(id));
        if (task) {
          resolve({ ...task });
        } else {
          reject(new Error("Task not found"));
        }
      }, 200);
    });
  }

  async getByProjectId(projectId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectTasks = this.tasks.filter(t => t.projectId === parseInt(projectId));
        resolve([...projectTasks]);
      }, 250);
    });
  }

async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.tasks.map(t => t.Id)) + 1;
        const newTask = {
          Id: newId,
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status || "To Do",
          priority: taskData.priority || "Medium",
          dueDate: taskData.dueDate,
          projectId: taskData.projectId,
          assignedTo: taskData.assignedTo || "Unassigned"
        };
        this.tasks.push(newTask);
        resolve({ ...newTask });
      }, 300);
    });
  }

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...taskData };
          resolve({ ...this.tasks[index] });
        } else {
          reject(new Error("Task not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.tasks.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Task not found"));
        }
      }, 300);
    });
  }
}

export default new TaskService();