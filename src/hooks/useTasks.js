import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (projectId) {
        data = await taskService.getByProjectId(projectId);
      } else {
        data = await taskService.getAll();
      }
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.update(id, taskData);
      setTasks(prev => prev.map(t => t.Id === parseInt(id) ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  };

  const searchTasks = async (query) => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.search(query);
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to search tasks");
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = (id) => {
    return tasks.find(t => t.Id === parseInt(id));
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
getTaskById,
    bulkUpdate,
    bulkDelete,
    bulkMove
  };

  async function bulkUpdate(taskIds, updates) {
    try {
      const updatedTasks = await taskService.bulkUpdate(taskIds, updates);
      setTasks(prev => prev.map(task => {
        const updated = updatedTasks.find(u => u.Id === task.Id);
        return updated || task;
      }));
      return updatedTasks;
    } catch (err) {
      throw new Error(err.message || "Failed to update tasks");
    }
  }

  async function bulkDelete(taskIds) {
    try {
      await taskService.bulkDelete(taskIds);
      setTasks(prev => prev.filter(task => !taskIds.includes(task.Id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete tasks");
    }
  }

  async function bulkMove(taskIds, targetStatus) {
    try {
      const updatedTasks = await taskService.bulkMove(taskIds, targetStatus);
      setTasks(prev => prev.map(task => {
        const updated = updatedTasks.find(u => u.Id === task.Id);
        return updated || task;
      }));
      return updatedTasks;
    } catch (err) {
      throw new Error(err.message || "Failed to move tasks");
    }
  }
};