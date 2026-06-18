import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import {
  AUTH_COOKIE,
  getAuthSecret,
  isAuthEnabled,
  sessionCookieOptions,
  signToken,
} from "@/lib/auth/session";

export const runtime = "nodejs";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(request: Request) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) {
    return new Response("Too many login attempts. Try again later.", {
      status: 429,
    });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const expected = process.env.APP_PASSWORD?.trim();
  const secret = getAuthSecret();
  if (!expected || !secret) {
    return new Response("Auth is not configured", { status: 503 });
  }

  if (!timingSafeEqual(password, expected)) {
    return new Response("Incorrect password", { status: 401 });
  }

  const token = await signToken(
    { exp: Date.now() + sessionCookieOptions().maxAge * 1000 },
    secret,
  );

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, sessionCookieOptions());

  return NextResponse.json({ ok: true });
}