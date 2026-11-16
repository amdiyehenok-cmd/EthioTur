export async function readJsonObject(request: Request, maxBytes = 16_000): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) return null;
  let raw: string;
  try { raw = await request.text(); } catch { return null; }
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch { return null; }
}

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, maxLength);
}

export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 100;
}

export function validUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function okResponse(data: Record<string, unknown>, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
