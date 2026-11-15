import { NextResponse, type NextRequest } from "next/server";

/*
 * Quick gate for /admin: no session cookie, straight to the login page
 * without rendering anything. This only checks that a cookie exists; the
 * real check (is the session in the database and still valid?) happens in
 * requireAdmin() in src/lib/auth/dal.ts.
 */

const SESSION_COOKIE = "onyxq_admin"; // keep in step with src/lib/auth/session.ts

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
