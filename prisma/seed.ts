/*
 * Creates the default super admin from SUPER_ADMIN_* in .env.
 * Run with `npm run db:seed`. Safe to run again: an existing account is left
 * as it is, so this never resets a password you've changed.
 */
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { pgConfig } from "../src/lib/pg-config";

config({ path: [".env.local", ".env"], quiet: true });

const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";
const password = process.env.SUPER_ADMIN_PASSWORD;

async function main() {
  if (!email || !password) throw new Error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env");
  if (password.length < 10) throw new Error("SUPER_ADMIN_PASSWORD must be at least 10 characters");

  const adapter = new PrismaPg(pgConfig(process.env.POSTGRES_URL_NON_POOLING, "POSTGRES_URL_NON_POOLING"));
  const prisma = new PrismaClient({ adapter });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Super admin ${email} already exists; left unchanged.`);
      return;
    }
    await prisma.user.create({
      data: { email, name, role: "SUPER_ADMIN", passwordHash: await hashPassword(password) },
    });
    console.log(`Created super admin ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
