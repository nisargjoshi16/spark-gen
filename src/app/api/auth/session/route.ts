import { NextResponse } from "next/server";
import { getOrg } from "@/lib/orgs";
import { authenticateRequest } from "@/lib/auth/request-auth";
import { isAuthEnabled } from "@/lib/auth/session";
import type { OrgId } from "@/types/poster";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ orgId: null as OrgId | null, orgName: null });
  }

  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const orgId = auth.orgAccess[0] ?? null;
  if (!orgId) {
    return NextResponse.json({ orgId: null, orgName: null });
  }

  const org = getOrg(orgId);
  return NextResponse.json({ orgId, orgName: org.name });
}