/*
 * Browser-side calls to the admin API. The admin pages render in the
 * browser; the server checks the session cookie on every one of these.
 */

export type Admin = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN";
  lastLoginAt: string | null;
  sessionExpiresAt: string;
};

/** The signed-in admin, or null when there's no valid session. */
export async function fetchMe(signal?: AbortSignal): Promise<Admin | null> {
  const res = await fetch("/api/admin/me", { cache: "no-store", signal });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ((await res.json()) as { user: Admin }).user;
}

/** POST JSON to an admin endpoint; resolves to the parsed body and status. */
export async function postJson<T = { ok?: boolean; error?: string }>(url: string, body: unknown = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}
