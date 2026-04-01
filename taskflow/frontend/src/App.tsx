// frontend/src/App.tsx
import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskBoard } from "./components/TaskBoard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const { tasks, createTask, updateTask, deleteTask } = useTasks(token);

  const login = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const { token: t } = await res.json();
    localStorage.setItem("token", t);
    setToken(t);
  };

  if (!token) return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      <input placeholder="Email"    value={email}    onChange={e => setEmail(e.target.value)}    style={{ display: "block", width: "100%", marginBottom: "0.5rem" }} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" style={{ display: "block", width: "100%", marginBottom: "0.5rem" }} />
      <button onClick={login}>Login</button>
    </div>
  );

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TaskFlow</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input placeholder="New task title..." value={title} onChange={e => setTitle(e.target.value)} />
        <button onClick={() => { createTask({ title }); setTitle(""); }}>Add Task</button>
        <button onClick={() => { localStorage.removeItem("token"); setToken(""); }}>Logout</button>
      </div>
      <TaskBoard tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
    </main>
  );
}