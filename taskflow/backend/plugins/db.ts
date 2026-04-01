// backend/plugins/db.ts
import fp from "fastify-plugin";
import { Database } from "bun:sqlite";

const db = new Database(process.env.DB_PATH ?? "taskflow.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT DEFAULT 'todo',      -- todo | in_progress | done
    priority    TEXT DEFAULT 'medium',    -- low | medium | high
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

export default fp(async (fastify) => {
  fastify.decorate("db", db);
});