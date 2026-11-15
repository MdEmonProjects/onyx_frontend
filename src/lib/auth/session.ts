import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { prisma } from "@/lib/db";

/*
 * Database sessions. The browser gets a random 256-bit token in an httpOnly
 * cookie; the Session table stores only its SHA-256 hash. Signing out (or
 * deleting the row) ends the session immediately.
 */

export const SESSION_COOKIE = "onyxq_admin";
const SESSION_DAYS = 7;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { id: hashToken(token), userId, expiresAt } });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** The signed-in user and session, or null. Expired sessions are cleaned up. */
export async function readSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Only check the session against a real request: the expiry test needs the
  // current time, and Next can otherwise prerender this with the cookie
  // (runtime prefetch), where Date.now() isn't allowed.
  await connection();

  const session = await prisma.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, lastLoginAt: true } } },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { id: hashToken(token) } });
  store.delete(SESSION_COOKIE);
}
