// backend/routes/auth.ts
import { FastifyPluginAsync } from "fastify";
import { hash, verify } from "bun-hash"; // or use crypto

const authRoutes: FastifyPluginAsync = async (fastify) => {

  // POST /auth/register
  fastify.post("/register", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email:    { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const hashed = await Bun.password.hash(password);

    try {
      const result = fastify.db
        .query("INSERT INTO users (email, password) VALUES (?, ?) RETURNING id, email")
        .get(email, hashed) as { id: number; email: string };

      const token = fastify.jwt.sign({ id: result.id, email: result.email });
      return reply.code(201).send({ token });
    } catch {
      reply.code(409).send({ error: "Email already registered" });
    }
  });

  // POST /auth/login
  fastify.post("/login", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email:    { type: "string" },
          password: { type: "string" },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = fastify.db
      .query("SELECT * FROM users WHERE email = ?")
      .get(email) as { id: number; email: string; password: string } | null;

    if (!user || !(await Bun.password.verify(password, user.password))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });
};

export default authRoutes;