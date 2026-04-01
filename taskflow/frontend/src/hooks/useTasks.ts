// frontend/src/hooks/useTasks.ts
import { useState, useEffect } from "react";


const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export function useTasks(token: string) {
  const [tasks, setTasks] = useState<any[]>([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`, { headers });
    setTasks(await res.json());
  };

  const createTask = async (data: any) => {
    await fetch(`${API}/tasks`, { method: "POST", headers, body: JSON.stringify(data) });
    fetchTasks();
  };

  const updateTask = async (id: number, data: any) => {
    await fetch(`${API}/tasks/${id}`, { method: "PATCH", headers, body: JSON.stringify(data) });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE", headers });
    fetchTasks();
  };

  useEffect(() => { if (token) fetchTasks(); }, [token]);

  return { tasks, createTask, updateTask, deleteTask };
}