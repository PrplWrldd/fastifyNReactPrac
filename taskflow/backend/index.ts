
// backend/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });

app.register(cors, { origin: "http://localhost:5173" });

app.get("/health", async () => ({ status: "ok" }));

app.listen({ port: 3000 }, () => {
  console.log("Server at http://localhost:3000");
});