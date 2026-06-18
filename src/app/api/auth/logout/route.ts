import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, ORG_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(ORG_COOKIE);
  return NextResponse.json({ ok: true });
}