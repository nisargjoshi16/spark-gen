import {
  AUTH_COOKIE,
  ORG_COOKIE,
  getAuthSecret,
  isAuthEnabled,
  verifyToken,
  type AuthSession,
  type OrgSession,
} from "@/lib/auth/session";
import type { OrgId } from "@/types/poster";

export interface RequestAuthResult {
  ok: boolean;
  isApiKey: boolean;
  orgAccess: OrgId[];
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

function getGenerateApiSecret(): string | undefined {
  return process.env.GENERATE_API_SECRET?.trim() || undefined;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function authenticateRequest(
  request: Request,
  cookieHeader?: string | null,
): Promise<RequestAuthResult> {
  const apiSecret = getGenerateApiSecret();
  const bearer = getBearerToken(request);

  if (bearer && apiSecret && timingSafeEqual(bearer, apiSecret)) {
    return { ok: true, isApiKey: true, orgAccess: [] };
  }

  if (!isAuthEnabled()) {
    return { ok: true, isApiKey: false, orgAccess: [] };
  }

  const secret = getAuthSecret();
  if (!secret) {
    return { ok: false, isApiKey: false, orgAccess: [] };
  }

  const cookies = parseCookies(cookieHeader ?? request.headers.get("cookie"));
  const authToken = cookies[AUTH_COOKIE];
  if (!authToken) {
    return { ok: false, isApiKey: false, orgAccess: [] };
  }

  const session = await verifyToken<AuthSession>(authToken, secret);
  if (!session) {
    return { ok: false, isApiKey: false, orgAccess: [] };
  }

  const orgToken = cookies[ORG_COOKIE];
  let orgAccess: OrgId[] = [];
  if (orgToken) {
    const orgSession = await verifyToken<OrgSession>(orgToken, secret);
    if (orgSession?.orgs) {
      orgAccess = orgSession.orgs as OrgId[];
    }
  }

  return { ok: true, isApiKey: false, orgAccess };
}

export function hasOrgAccess(orgAccess: OrgId[], orgId: OrgId): boolean {
  return orgAccess.includes(orgId);
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [name, ...rest] = part.trim().split("=");
      return [name, decodeURIComponent(rest.join("="))];
    }),
  );
}