import type { Org, OrgId } from "@/types/poster";

export const DEFAULT_ORG_ID: OrgId = "prachodayat";
export const DEFAULT_WATERMARK = "प्रचोदयात्";

/** Orgs that may require a PIN in production (UI hint; server enforces via env). */
const PIN_PROTECTED_ORGS: OrgId[] = ["prachodayat", "shardul"];

export const orgs: Org[] = [
  {
    id: "prachodayat",
    name: "Prachodayat",
    website: "www.prachodayat.in",
    footer: "प्रचोदयात् | prachodayat.in",
    logoPath: "/orgs/prachodayat/logo.png",
    isDefault: true,
  },
  {
    id: "gurukul",
    name: "राष्ट्रोत्थान गुरुकुल",
    website: "",
    footer: "राष्ट्रोत्थान गुरुकुल",
    logoPath: "/orgs/gurukul/logo.png",
  },
  {
    id: "shardul",
    name: "Shardul",
    website: "",
    footer: "शार्दूल शिशुविहार | वड़ोदरा",
    logoPath: "/orgs/shardul/logo.png",
    watermark: "शार्दूल",
  },
];

export function getOrg(id: OrgId): Org {
  return orgs.find((o) => o.id === id) ?? orgs[0];
}

export function orgRequiresPin(id: OrgId): boolean {
  return PIN_PROTECTED_ORGS.includes(id);
}

export function getWatermarkForOrg(
  org: Org,
  showWatermark: boolean,
): string | null {
  if (!showWatermark) return null;
  if (org.watermark === "") return null;
  if (org.watermark) return org.watermark;
  return DEFAULT_WATERMARK;
}