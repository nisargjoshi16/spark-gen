import type { OrgId } from "@/types/poster";

const PIN_PROTECTED_ORGS: OrgId[] = ["prachodayat", "shardul"];

const ORG_PIN_ENV: Partial<Record<OrgId, string>> = {
  prachodayat: "ORG_PIN_PRACHODAYAT",
  shardul: "ORG_PIN_SHARDUL",
};

export function orgRequiresPin(id: OrgId): boolean {
  return PIN_PROTECTED_ORGS.includes(id) && Boolean(getOrgPin(id));
}

export function getOrgPin(id: OrgId): string | undefined {
  const envName = ORG_PIN_ENV[id];
  if (!envName) return undefined;
  const value = process.env[envName]?.trim();
  return value || undefined;
}

export function verifyOrgPin(id: OrgId, pin: string): boolean {
  const expected = getOrgPin(id);
  if (!expected) return true;
  if (pin.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= pin.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

