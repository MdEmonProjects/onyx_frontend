import "server-only";

/*
 * Helpers for the /api/admin route handlers.
 *
 * Requests that change state must be JSON from this same site. A plain HTML
 * form on another website can't send `application/json` without the browser
 * asking first (CORS preflight), and the Origin check stops the rest, so the
 * session cookie can't be used by a forged cross-site request (CSRF).
 */
export function isSameOriginJson(request: Request): boolean {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin fetches from older browsers may omit it
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
