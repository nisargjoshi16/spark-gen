import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  getAuthSecret,
  isAuthEnabled,
  verifyToken,
  type AuthSession,
} from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export async function proxy(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (
    PUBLIC_PATHS.some((path) => pathname === path) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/orgs/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const secret = getAuthSecret();
  if (!secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token) {
    const session = await verifyToken<AuthSession>(token, secret);
    if (session) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};