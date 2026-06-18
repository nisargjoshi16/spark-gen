import type { Org, OrgId } from "@/types/poster";

export const DEFAULT_ORG_ID: OrgId = "prachodayat";
export const DEFAULT_WATERMARK = "प्रचोदयात्";

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
    pin: "16111982",
  },
];

/** PIN for prachodayat org — kept separate from public org list metadata */
const ORG_PINS: Partial<Record<OrgId, string>> = {
  prachodayat: "16111982",
};

export function getOrg(id: OrgId): Org {
  return orgs.find((o) => o.id === id) ?? orgs[0];
}

export function getOrgPin(id: OrgId): string | undefined {
  const org = getOrg(id);
  return org.pin ?? ORG_PINS[id];
}

export function orgRequiresPin(id: OrgId): boolean {
  return Boolean(getOrgPin(id));
}

export function verifyOrgPin(id: OrgId, pin: string): boolean {
  const expected = getOrgPin(id);
  if (!expected) return true;
  return pin === expected;
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