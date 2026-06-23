import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import {
  getLoginOrgs,
  orgRequiresPin,
  verifyOrgPin,
} from "@/lib/auth/org-access";
import {
  AUTH_COOKIE,
  ORG_COOKIE,
  getAuthSecret,
  isAuthEnabled,
  sessionCookieOptions,
  signToken,
} from "@/lib/auth/session";
import type { OrgId } from "@/types/poster";

export const runtime = "nodejs";

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

  let orgId: OrgId | undefined;
  let password = "";
  try {
    const body = (await request.json()) as { orgId?: OrgId; password?: string };
    orgId = body.orgId;
    password = body.password?.trim() ?? "";
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  if (!orgId) {
    return new Response("Select an organization", { status: 400 });
  }

  const loginOrgs = getLoginOrgs();
  if (!loginOrgs.includes(orgId)) {
    return new Response("This organization is not available for login", {
      status: 400,
    });
  }

  if (!orgRequiresPin(orgId)) {
    return new Response("Organization login is not configured", { status: 503 });
  }

  if (!verifyOrgPin(orgId, password)) {
    return new Response("Incorrect password", { status: 401 });
  }

  const secret = getAuthSecret();
  if (!secret) {
    return new Response("Auth is not configured", { status: 503 });
  }

  const maxAge = sessionCookieOptions().maxAge;
  const authToken = await signToken(
    { orgId, exp: Date.now() + maxAge * 1000 },
    secret,
  );
  const orgToken = await signToken(
    { orgs: [orgId], exp: Date.now() + maxAge * 1000 },
    secret,
  );

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, authToken, sessionCookieOptions());
  cookieStore.set(ORG_COOKIE, orgToken, sessionCookieOptions());

  return NextResponse.json({ ok: true, orgId });
}