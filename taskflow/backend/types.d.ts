// backend/types.d.ts
import { Database } from "bun:sqlite";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}