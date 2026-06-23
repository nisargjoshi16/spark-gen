export const AUTH_COOKIE = "spark_auth";
export const ORG_COOKIE = "spark_org";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export interface AuthSession {
  exp: number;
}

export interface OrgSession {
  orgs: string[];
  exp: number;
}

export function isAuthEnabled(): boolean {
  return Boolean(process.env.APP_PASSWORD?.trim());
}

export function getAuthSecret(): string | undefined {
  const secret = process.env.AUTH_SECRET?.trim() || process.env.APP_PASSWORD?.trim();
  return secret || undefined;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/_/g, "/").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signToken(
  payload: object,
  secret: string,
): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  return `${bytesToBase64Url(data)}.${bytesToBase64Url(new Uint8Array(sig))}`;
}

export async function verifyToken<T>(
  token: string,
  secret: string,
): Promise<T | null> {
  const [payloadPart, sigPart] = token.split(".");
  if (!payloadPart || !sigPart) return null;

  try {
    const data = new Uint8Array(base64UrlToBytes(payloadPart));
    const sig = new Uint8Array(base64UrlToBytes(sigPart));
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify("HMAC", key, sig, data);
    if (!valid) return null;

    const parsed = JSON.parse(new TextDecoder().decode(data)) as T & { exp?: number };
    if (typeof parsed.exp === "number" && parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function cookieSecure(): boolean {
  const override = process.env.COOKIE_SECURE?.trim().toLowerCase();
  if (override === "true") return true;
  if (override === "false") return false;
  return process.env.NODE_ENV === "production";
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}