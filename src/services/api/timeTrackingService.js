class TimeTrackingService {
  constructor() {
    this.timeEntries = [];
    this.activeTimers = new Map(); // taskId -> { startTime, intervalId }
    this.lastId = 0;
  }

  async getAllEntries() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.timeEntries]);
      }, 300);
    });
  }

  async getEntriesByTaskId(taskId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = this.timeEntries.filter(entry => entry.taskId === parseInt(taskId));
        resolve([...entries]);
      }, 300);
    });
  }

  async getEntriesByProjectId(projectId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would need task-project mapping in a real app
        // For now, return all entries as mock data
        resolve([...this.timeEntries]);
      }, 300);
    });
  }

  async startTimer(taskId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const taskIdInt = parseInt(taskId);
        
        if (this.activeTimers.has(taskIdInt)) {
          reject(new Error("Timer already active for this task"));
          return;
        }

        const startTime = new Date();
        this.activeTimers.set(taskIdInt, {
          startTime,
          taskId: taskIdInt
        });

        resolve({
          taskId: taskIdInt,
          startTime: startTime.toISOString(),
          isActive: true
        });
      }, 300);
    });
  }

  async stopTimer(taskId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const taskIdInt = parseInt(taskId);
        const activeTimer = this.activeTimers.get(taskIdInt);
        
        if (!activeTimer) {
          reject(new Error("No active timer found for this task"));
          return;
        }

        const endTime = new Date();
        const duration = Math.round((endTime - activeTimer.startTime) / 1000); // seconds
        
        // Create time entry
        const timeEntry = {
          Id: ++this.lastId,
          taskId: taskIdInt,
          startTime: activeTimer.startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };

        this.timeEntries.push(timeEntry);
        this.activeTimers.delete(taskIdInt);

        resolve({
          ...timeEntry,
          isActive: false
        });
      }, 300);
    });
  }

  async getActiveTimer(taskId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIdInt = parseInt(taskId);
        const activeTimer = this.activeTimers.get(taskIdInt);
        
        if (activeTimer) {
          resolve({
            taskId: taskIdInt,
            startTime: activeTimer.startTime.toISOString(),
            isActive: true
          });
        } else {
          resolve(null);
        }
      }, 100);
    });
  }

  async getTotalTimeByTask(taskId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = this.timeEntries.filter(entry => entry.taskId === parseInt(taskId));
        const totalSeconds = entries.reduce((sum, entry) => sum + entry.duration, 0);
        resolve(totalSeconds);
      }, 200);
    });
  }

  async getTotalTimeByProject(projectId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would filter by project through task associations
        const totalSeconds = this.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
        resolve(totalSeconds);
      }, 200);
    });
  }

  async deleteEntry(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
        if (index !== -1) {
          this.timeEntries.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Time entry not found"));
        }
      }, 300);
    });
  }

  // Utility method to format duration
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Get all active timers
  getActiveTimers() {
    return Array.from(this.activeTimers.values());
  }
}

export default new TimeTrackingService();