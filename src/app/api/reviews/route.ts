import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { providers, reviews } from "@/db/schema";
import { cleanText, errorResponse, okResponse, readJsonObject, validUuid } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJsonObject(request, 5_000);
  if (!body) return errorResponse("Please submit a valid review under 5 KB.", 400);
  if (cleanText(body.website, 180)) return okResponse({ message: "Your review has been received for moderation." }, 202);
  if (body.consent !== true) return errorResponse("Please confirm that the review is yours and can be moderated.", 400);
  const providerId = cleanText(body.providerId, 40);
  const reviewerName = cleanText(body.reviewerName, 120);
  const rating = Number(body.rating);
  const reviewText = cleanText(body.body, 3_000);
  if (!validUuid(providerId) || reviewerName.length < 2 || !Number.isInteger(rating) || rating < 1 || rating > 5 || reviewText.length < 20) return errorResponse("Check the provider, display name, 1–5 rating and review text (20–3,000 characters).", 400);
  try {
    const [provider] = await db.select({ id: providers.id }).from(providers).where(and(eq(providers.id, providerId), eq(providers.status, "approved"))).limit(1);
    if (!provider) return errorResponse("This provider is not accepting reviews.", 404);
    await db.insert(reviews).values({ providerId, reviewerName, rating, body: reviewText, consentedAt: new Date(), status: "pending_review" });
    return okResponse({ message: "Your review has been received and will appear only if an administrator approves it. We do not verify purchases or label a stay as verified." }, 201);
  } catch {
    return errorResponse("We couldn't submit this review just now. Please try again later.", 503);
  }
}
