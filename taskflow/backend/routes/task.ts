// backend/routes/tasks.ts
import { FastifyPluginAsync } from "fastify";

const taskRoutes: FastifyPluginAsync = async (fastify) => {

  // All routes require auth
  fastify.addHook("onRequest", fastify.authenticate);

  const taskSchema = {
    type: "object",
    properties: {
      title:       { type: "string", minLength: 1 },
      description: { type: "string" },
      status:      { type: "string", enum: ["todo", "in_progress", "done"] },
      priority:    { type: "string", enum: ["low", "medium", "high"] },
    },
  };

  // GET /tasks?status=todo&priority=high
  fastify.get("/", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          status:   { type: "string" },
          priority: { type: "string" },
        },
      },
    },
  }, async (request) => {
    const user = request.user as { id: number };
    const { status, priority } = request.query as { status?: string; priority?: string };

    let q = "SELECT * FROM tasks WHERE user_id = ?";
    const params: any[] = [user.id];

    if (status)   { q += " AND status = ?";   params.push(status); }
    if (priority) { q += " AND priority = ?"; params.push(priority); }

    q += " ORDER BY created_at DESC";
    return fastify.db.query(q).all(...params);
  });

  // POST /tasks
  fastify.post("/", {
    schema: {
      body: {
        ...taskSchema,
        required: ["title"],
      },
    },
  }, async (request, reply) => {
    const user = request.user as { id: number };
    const { title, description, status, priority } = request.body as any;

    const task = fastify.db.query(`
      INSERT INTO tasks (user_id, title, description, status, priority)
      VALUES (?, ?, ?, ?, ?) RETURNING *
    `).get(user.id, title, description ?? null, status ?? "todo", priority ?? "medium");

    return reply.code(201).send(task);
  });

  // PATCH /tasks/:id
  fastify.patch("/:id", {
    schema: { body: taskSchema },
  }, async (request, reply) => {
    const user = request.user as { id: number };
    const { id } = request.params as { id: string };
    const fields = request.body as any;

    const existing = fastify.db
      .query("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
      .get(id, user.id);

    if (!existing) return reply.code(404).send({ error: "Task not found" });

    const updated = { ...existing as any, ...fields, updated_at: new Date().toISOString() };

    fastify.db.run(
      `UPDATE tasks SET title=?, description=?, status=?, priority=?, updated_at=? WHERE id=?`,
      [updated.title, updated.description, updated.status, updated.priority, updated.updated_at, id]
    );

    return updated;
  });

  // DELETE /tasks/:id
  fastify.delete("/:id", async (request, reply) => {
    const user = request.user as { id: number };
    const { id } = request.params as { id: string };

    const existing = fastify.db
      .query("SELECT id FROM tasks WHERE id = ? AND user_id = ?")
      .get(id, user.id);

    if (!existing) return reply.code(404).send({ error: "Task not found" });

    fastify.db.run("DELETE FROM tasks WHERE id = ?", [id]);
    return reply.code(204).send();
  });
};

export default taskRoutes;