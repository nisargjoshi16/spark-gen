import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { orgRequiresPin, verifyOrgPin } from "@/lib/auth/org-access";
import { authenticateRequest } from "@/lib/auth/request-auth";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import {
  ORG_COOKIE,
  getAuthSecret,
  sessionCookieOptions,
  signToken,
  verifyToken,
  type OrgSession,
} from "@/lib/auth/session";
import type { OrgId } from "@/types/poster";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`org-pin:${ip}`, 20, 15 * 60 * 1000);
  if (!limit.allowed) {
    return new Response("Too many attempts. Try again later.", { status: 429 });
  }

  let orgId: OrgId | undefined;
  let pin = "";
  try {
    const body = (await request.json()) as { orgId?: OrgId; pin?: string };
    orgId = body.orgId;
    pin = body.pin?.trim() ?? "";
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  if (!orgId) {
    return new Response("orgId is required", { status: 400 });
  }

  if (!orgRequiresPin(orgId)) {
    return NextResponse.json({ ok: true, orgId });
  }

  if (!verifyOrgPin(orgId, pin)) {
    return new Response("Incorrect PIN", { status: 401 });
  }

  const secret = getAuthSecret();
  if (!secret) {
    return new Response("Auth is not configured", { status: 503 });
  }

  const cookieStore = await cookies();
  const existingToken = cookieStore.get(ORG_COOKIE)?.value;
  const existing = existingToken
    ? await verifyToken<OrgSession>(existingToken, secret)
    : null;

  const orgs = new Set(existing?.orgs ?? []);
  orgs.add(orgId);

  const token = await signToken(
    {
      orgs: [...orgs],
      exp: Date.now() + sessionCookieOptions().maxAge * 1000,
    },
    secret,
  );

  cookieStore.set(ORG_COOKIE, token, sessionCookieOptions());
  return NextResponse.json({ ok: true, orgId });
}