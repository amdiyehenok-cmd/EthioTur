import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, mediaAssets, newsletterSubscribers, providers, reviews, travelUpdates } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cleanText, errorResponse, okResponse, readJsonObject, validUuid } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: Record<string, Set<string>> = {
  inquiry: new Set(["new", "in_progress", "responded", "closed"]),
  provider: new Set(["pending_review", "approved", "rejected"]),
  review: new Set(["pending_review", "approved", "rejected"]),
  travel_update: new Set(["draft", "review", "verified", "published", "archived"]),
  media_asset: new Set(["draft", "review", "approved", "archived"]),
  newsletter: new Set(["active", "unsubscribed"]),
};

export async function PATCH(request: Request) {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  const body = await readJsonObject(request, 3_000);
  if (!body) return errorResponse("Please submit a valid moderation update.", 400);
  const kind = cleanText(body.kind, 30);
  const id = cleanText(body.id, 40);
  const status = cleanText(body.status, 24);
  if (!validUuid(id) || !allowedStatuses[kind]?.has(status)) return errorResponse("Choose a valid moderation record and status.", 400);
  try {
    if (kind === "inquiry") await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
    else if (kind === "provider") await db.update(providers).set({ status, approvedAt: status === "approved" ? new Date() : null, updatedAt: new Date() }).where(eq(providers.id, id));
    else if (kind === "review") await db.update(reviews).set({ status }).where(eq(reviews.id, id));
    else if (kind === "travel_update") await db.update(travelUpdates).set({ status, updatedAt: new Date() }).where(eq(travelUpdates.id, id));
    else if (kind === "media_asset") await db.update(mediaAssets).set({ status }).where(eq(mediaAssets.id, id));
    else if (kind === "newsletter") await db.update(newsletterSubscribers).set({ status }).where(eq(newsletterSubscribers.id, id));
    return okResponse({ message: `Record status updated to ${status}.` });
  } catch { return errorResponse("The moderation update could not be saved.", 503); }
}
