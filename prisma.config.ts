import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Same files Next.js reads; the first file to set a variable wins.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct (session) connection, not the transaction
    // pooler the app uses at runtime.
    url: env("POSTGRES_URL_NON_POOLING"),
  },
});
