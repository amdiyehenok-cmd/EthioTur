import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, hasConfiguredAdminToken, signAdminTimestamp, validateAdminToken } from "@/lib/admin-auth";
import { cleanText, errorResponse, okResponse, readJsonObject } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasConfiguredAdminToken()) return errorResponse("Admin sign-in is not configured. Set a strong server-only ADMIN_API_TOKEN before using this dashboard.", 503);
  const body = await readJsonObject(request, 2_000);
  if (!body) return errorResponse("Please submit a valid sign-in request.", 400);
  const token = cleanText(body.token, 500);
  if (!validateAdminToken(token)) return errorResponse("The administrator credential was not accepted.", 401);
  const timestamp = String(Math.floor(Date.now() / 1_000));
  const signedValue = signAdminTimestamp(timestamp);
  if (!signedValue) return errorResponse("Admin session signing is unavailable. Check server secrets.", 503);
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, signedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return okResponse({ authenticated: true, message: "Administrator session opened. It expires automatically after 12 hours." });
}

export async function DELETE() {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return okResponse({ authenticated: false, message: "Signed out." });
}
