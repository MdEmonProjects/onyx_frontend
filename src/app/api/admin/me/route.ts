import { json } from "@/lib/auth/api";
import { getAdmin } from "@/lib/auth/dal";

/** GET → the signed-in admin, or 401. The admin pages use this to check the session. */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return json({ error: "Not signed in." }, 401);
  return json({ user: admin });
}
