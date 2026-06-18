import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { OrgId } from "@/types/poster";

export function getOrgLogoBase64(orgId: OrgId): string | null {
  const logoPath = join(process.cwd(), "public", "orgs", orgId, "logo.png");
  if (!existsSync(logoPath)) return null;
  return readFileSync(logoPath).toString("base64");
}