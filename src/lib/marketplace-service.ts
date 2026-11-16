import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { providers, reviews } from "@/db/schema";

export async function getApprovedProviders() {
  try {
    return await db.select().from(providers).where(eq(providers.status, "approved")).orderBy(asc(providers.name));
  } catch {
    return [];
  }
}

export async function getApprovedProvider(slug: string) {
  try {
    const [provider] = await db.select().from(providers).where(eq(providers.slug, slug)).limit(1);
    return provider?.status === "approved" ? provider : undefined;
  } catch {
    return undefined;
  }
}

export async function getApprovedReviews(providerId: string) {
  try {
    return await db.select().from(reviews).where(eq(reviews.providerId, providerId)).orderBy(asc(reviews.createdAt));
  } catch {
    return [];
  }
}
