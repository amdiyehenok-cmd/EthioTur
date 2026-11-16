import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export async function getArticleRecords() {
  try {
    return await db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(100);
  } catch {
    return [];
  }
}

export async function getPublishedArticles() {
  try {
    return await db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt)).limit(100);
  } catch {
    return [];
  }
}

export async function getArticleRecord(slug: string) {
  try {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return article;
  } catch {
    return undefined;
  }
}

export async function getPublishedArticle(slug: string) {
  const article = await getArticleRecord(slug);
  return article?.status === "published" ? article : undefined;
}
