import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "eu_admin_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60;

function safeEqual(candidate: string, expected: string): boolean {
  const left = Buffer.from(candidate, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export function hasConfiguredAdminToken(): boolean {
  return Boolean(process.env.ADMIN_API_TOKEN && process.env.ADMIN_API_TOKEN.length >= 32);
}

export function validateAdminToken(candidate: string): boolean {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || expected.length < 32) return false;
  return safeEqual(candidate, expected);
}

function sessionSignature(timestamp: string): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_API_TOKEN;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(timestamp).digest("hex");
}

export function signAdminTimestamp(timestamp: string): string | null {
  const signature = sessionSignature(timestamp);
  return signature ? `${timestamp}.${signature}` : null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const raw = store.get(ADMIN_COOKIE_NAME)?.value;
    if (!raw) return false;
    const [timestamp, signature, extra] = raw.split(".");
    if (!timestamp || !signature || extra) return false;
    const epoch = Number(timestamp);
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isSafeInteger(epoch) || epoch > now || now - epoch > SESSION_TTL_SECONDS) return false;
    const expected = sessionSignature(timestamp);
    return expected ? safeEqual(signature, expected) : false;
  } catch { return false; }
}
