// frontend/src/components/TaskBoard.tsx
const COLUMNS = ["todo", "in_progress", "done"] as const;
const LABELS = { todo: "📋 Todo", in_progress: "🔄 In Progress", done: "✅ Done" };

export function TaskBoard({ tasks, onUpdate, onDelete }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
      {COLUMNS.map(col => (
        <div key={col}>
          <h3>{LABELS[col]}</h3>
          {tasks
            .filter((t: any) => t.status === col)
            .map((task: any) => (
              <div key={task.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "0.75rem", marginBottom: "0.5rem" }}>
                <strong>{task.title}</strong>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>{task.description}</p>
                <span style={{ fontSize: "0.75rem" }}>🔥 {task.priority}</span>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  {col !== "done" && (
                    <button onClick={() => onUpdate(task.id, {
                      status: col === "todo" ? "in_progress" : "done"
                    })}>
                      Move →
                    </button>
                  )}
                  <button onClick={() => onDelete(task.id)}>🗑</button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}