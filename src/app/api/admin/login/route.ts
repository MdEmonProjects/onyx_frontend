import { isSameOriginJson, json } from "@/lib/auth/api";
import { DUMMY_HASH, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const GENERIC_ERROR = "That email and password don't match an admin account.";

/** POST { email, password } → sets the session cookie. */
export async function POST(request: Request) {
  if (!isSameOriginJson(request)) return json({ error: "Bad request." }, 400);

  const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) return json({ error: "Enter your email and password." }, 400);
  if (email.length > 254 || password.length > 200) return json({ error: GENERIC_ERROR }, 401);

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run one hash check so a missing account takes as long as a wrong password.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return json({ error: GENERIC_ERROR }, 401);

  await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return json({ ok: true });
}
