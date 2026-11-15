import type { PoolConfig } from "pg";

/*
 * Turns a Supabase/Vercel Postgres URL into node-postgres settings.
 *
 * The URLs carry `sslmode=require` (plus Prisma-only flags like
 * `pgbouncer=true`). node-postgres reads `sslmode=require` as "verify the
 * certificate chain", which Supabase's pooler certificate doesn't pass
 * without its CA file, so SSL is set here instead: always encrypted, the
 * same guarantee libpq gives for `sslmode=require`.
 *
 * No "server-only" import: the seed script uses this outside Next.js.
 */
export function pgConfig(url: string | undefined, name: string): PoolConfig {
  if (!url) throw new Error(`${name} is not set (see .env.local)`);
  const parsed = new URL(url);
  for (const key of ["sslmode", "pgbouncer", "supa", "connection_limit"]) parsed.searchParams.delete(key);
  return {
    connectionString: parsed.toString(),
    ssl: { rejectUnauthorized: false },
  };
}
