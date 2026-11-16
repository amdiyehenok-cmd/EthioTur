import { db } from "@/db";
import { articles, destinations as destinationTable } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { destinations as editorialDestinations, stories } from "@/lib/content";
import { errorResponse, okResponse } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  try {
    const destinationRows = editorialDestinations.map(({ slug, name, region, tagline, summary, seoTitle, seoDescription, ...content }) => ({
      slug, name, region, tagline, summary, content, coverImage: content.image?.src ?? null, coverImageAlt: content.image?.alt ?? null, status: "published", seoTitle, seoDescription, publishedAt: new Date(), updatedAt: new Date(),
    }));
    const destinationRecords = await db.insert(destinationTable).values(destinationRows).onConflictDoNothing({ target: destinationTable.slug }).returning({ slug: destinationTable.slug });
    const articleRows = stories.map((story) => ({ slug: story.slug, title: story.title, excerpt: story.deck, body: story.body.map((section) => `## ${section.heading}\n${section.paragraphs.join("\n\n")}`).join("\n\n"), category: story.category, author: story.author, status: "published", seoTitle: story.title, seoDescription: story.deck, publishedAt: new Date(), updatedAt: new Date() }));
    const articleRecords = await db.insert(articles).values(articleRows).onConflictDoNothing({ target: articles.slug }).returning({ slug: articles.slug });
    return okResponse({ message: `Editorial content seeded safely. Added ${destinationRecords.length} destinations and ${articleRecords.length} stories; existing slugs were left unchanged.`, destinationCount: destinationRecords.length, storyCount: articleRecords.length });
  } catch {
    return errorResponse("The editorial seed could not be saved. Check the database schema and connection.", 503);
  }
}
