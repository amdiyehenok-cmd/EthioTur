import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles, destinations, inquiries, mediaAssets, newsletterSubscribers, providers, reviews, travelUpdates } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { errorResponse, okResponse } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  try {
    const [destinationRecords, articleRecords, providerRecords, inquiryRecords, reviewRecords, updateRecords, assetRecords, subscribers] = await Promise.all([
      db.select().from(destinations).orderBy(desc(destinations.updatedAt)).limit(100),
      db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(100),
      db.select().from(providers).orderBy(desc(providers.updatedAt)).limit(100),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100),
      db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(100),
      db.select().from(travelUpdates).orderBy(desc(travelUpdates.updatedAt)).limit(100),
      db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(100),
      db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.consentedAt)).limit(100),
    ]);
    return okResponse({ destinations: destinationRecords, articles: articleRecords, providers: providerRecords, inquiries: inquiryRecords, reviews: reviewRecords, travelUpdates: updateRecords, mediaAssets: assetRecords, newsletterSubscribers: subscribers });
  } catch {
    return errorResponse("The protected admin records could not be loaded.", 503);
  }
}
