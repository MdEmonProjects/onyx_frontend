import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { pgConfig } from "./pg-config";

/*
 * One Prisma client for the whole server, on Supabase Postgres.
 *
 * The app talks to Supabase's pooled connection (POSTGRES_PRISMA_URL, port
 * 6543), which suits serverless functions opening many short connections.
 * Migrations use the direct one instead (see prisma.config.ts).
 *
 * In dev, hot reload re-runs this module, so the client is parked on
 * globalThis to avoid opening a new pool on every edit.
 */
function createClient() {
  const adapter = new PrismaPg(pgConfig(process.env.POSTGRES_PRISMA_URL, "POSTGRES_PRISMA_URL"));
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
