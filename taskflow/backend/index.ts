
import Fastify from "fastify";
import cors from "@fastify/cors";
import dbPlugin from "./plugins/db";
import authPlugin from "./plugins/auth";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const app = Fastify({ logger: true });

app.register(cors, { origin: "http://localhost:5173" });
app.register(dbPlugin);
app.register(authPlugin);
app.register(authRoutes, { prefix: "/auth" });
app.register(taskRoutes, { prefix: "/tasks" });

app.get("/health", async () => ({ status: "ok" }));

app.listen({ port: 3000 });