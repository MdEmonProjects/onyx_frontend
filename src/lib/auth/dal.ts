import "server-only";
import { cache } from "react";
import { readSession } from "./session";

/*
 * Data access layer: the one place server code asks "who is signed in?".
 * Every call checks the session in the database, so this is the real gate;
 * the proxy only does a quick cookie check, and the admin pages (rendered
 * in the browser) just ask /api/admin/me. Any future admin API route should
 * start with `const admin = await getAdmin(); if (!admin) return 401`.
 */

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN";
  lastLoginAt: Date | null;
  sessionExpiresAt: Date;
};

/** The signed-in admin, or null. Deduplicated per request. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await readSession();
  if (!session) return null;
  return { ...session.user, sessionExpiresAt: session.expiresAt };
});
