import { cookies } from "next/headers";

export const SESSION_COOKIE = "gcap_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  u: string;
  exp: number;
};

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  return toBase64Url(signature);
}

async function verifySignature(data: string, signature: string): Promise<boolean> {
  const expected = await sign(data);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const valid = await verifySignature(encoded, signature);
  if (!valid) return null;

  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.u || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function validateAdminCredentials(
  username: string,
  password: string,
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  return username === expectedUser && password === expectedPass;
}
