import { db } from "@/db";
import { travelUpdates } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cleanText, errorResponse, okResponse, readJsonObject } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value: unknown): Date | null {
  const input = cleanText(value, 80);
  if (!input) return null;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  const body = await readJsonObject(request, 6_000);
  if (!body) return errorResponse("Please submit valid travel-source metadata.", 400);
  const title = cleanText(body.title, 220);
  const region = cleanText(body.region, 160) || "Ethiopia";
  const category = cleanText(body.category, 80);
  const sourceName = cleanText(body.sourceName, 180);
  const sourceUrl = cleanText(body.sourceUrl, 1_000);
  const notes = cleanText(body.notes, 3_000);
  const sourcePublishedAt = parseDate(body.sourcePublishedAt);
  const verifiedAt = parseDate(body.verifiedAt);
  if (title.length < 5 || category.length < 3 || sourceName.length < 3 || notes.length < 15) return errorResponse("Add a title, category, source name and review notes.", 400);
  try { if (new URL(sourceUrl).protocol !== "https:") return errorResponse("Use an official HTTPS source link.", 400); } catch { return errorResponse("Enter a valid HTTPS source URL.", 400); }
  const status = verifiedAt ? "review" : "draft";
  try {
    const [saved] = await db.insert(travelUpdates).values({ title, region, category, sourceName, sourceUrl, sourcePublishedAt, verifiedAt, notes, status, updatedAt: new Date() }).returning({ id: travelUpdates.id, status: travelUpdates.status, verifiedAt: travelUpdates.verifiedAt });
    return okResponse({ message: "Source metadata saved for editorial review. It is not published as live advice.", update: saved }, 201);
  } catch { return errorResponse("The travel-source record could not be saved.", 503); }
}
