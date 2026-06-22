import { IS_STATIC_EXPORT } from "@/lib/static-export";
import type { OrgId } from "@/types/poster";

const CLIENT_PIN_ENV: Partial<Record<OrgId, string>> = {
  prachodayat: "NEXT_PUBLIC_ORG_PIN_PRACHODAYAT",
  shardul: "NEXT_PUBLIC_ORG_PIN_SHARDUL",
};

function getClientOrgPin(id: OrgId): string | undefined {
  const envName = CLIENT_PIN_ENV[id];
  if (!envName) return undefined;
  const value = process.env[envName]?.trim();
  return value || undefined;
}

export function orgRequiresClientPin(id: OrgId): boolean {
  return IS_STATIC_EXPORT && Boolean(getClientOrgPin(id));
}

export function verifyClientOrgPin(id: OrgId, pin: string): boolean {
  const expected = getClientOrgPin(id);
  if (!expected) return true;
  if (pin.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= pin.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}