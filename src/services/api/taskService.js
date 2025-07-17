import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByProjectId(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === projectId.toString());
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
);
  },

  async bulkUpdate(taskIds, updates) {
    await delay(400);
    const validIds = taskIds.filter(id => Number.isInteger(id) || Number.isInteger(parseInt(id)));
    const updatedTasks = [];
    
    for (const id of validIds) {
      const index = tasks.findIndex(t => t.Id === parseInt(id));
      if (index !== -1) {
        const updatedTask = {
          ...tasks[index],
          ...updates,
          Id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
        tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  },

  async bulkDelete(taskIds) {
    await delay(350);
    const validIds = taskIds.filter(id => Number.isInteger(id) || Number.isInteger(parseInt(id)));
    
    for (const id of validIds) {
      const index = tasks.findIndex(t => t.Id === parseInt(id));
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    }
    
    return { success: true, deletedCount: validIds.length };
  },

  async bulkMove(taskIds, targetStatus) {
    await delay(300);
    const validIds = taskIds.filter(id => Number.isInteger(id) || Number.isInteger(parseInt(id)));
    const updatedTasks = [];
    
    for (const id of validIds) {
      const index = tasks.findIndex(t => t.Id === parseInt(id));
      if (index !== -1) {
        const updatedTask = {
          ...tasks[index],
          status: targetStatus,
          updatedAt: new Date().toISOString()
        };
        tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  }
};