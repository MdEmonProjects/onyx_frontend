import { isSameOriginJson, json } from "@/lib/auth/api";
import { deleteSession } from "@/lib/auth/session";

/** POST → ends this browser's session and clears the cookie. */
export async function POST(request: Request) {
  if (!isSameOriginJson(request)) return json({ error: "Bad request." }, 400);
  await deleteSession();
  return json({ ok: true });
}
