import { NextResponse } from "next/server";
import { getLoginOrgs } from "@/lib/auth/org-access";
import { getOrg, getOrgLogoPath } from "@/lib/orgs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const loginOrgs = getLoginOrgs().map((id) => {
    const org = getOrg(id);
    return {
      id: org.id,
      name: org.name,
      footer: org.footer,
      logoPath: getOrgLogoPath(org),
    };
  });

  return NextResponse.json({ orgs: loginOrgs });
}