import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, destinations } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { destinations as editorialDestinations, type Destination } from "@/lib/content";
import { cleanText, errorResponse, okResponse, readJsonObject, validEmail, validSlug } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const statuses = new Set(["draft", "review", "scheduled", "published"]);

function parseContent(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  try { if (JSON.stringify(value).length > 30_000) return null; } catch { return null; }
  return value as Record<string, unknown>;
}

function imageIsCredited(image: unknown): boolean {
  if (!image || typeof image !== "object" || Array.isArray(image)) return true;
  const value = image as Record<string, unknown>;
  if (typeof value.src !== "string" || typeof value.alt !== "string" || typeof value.creator !== "string" || typeof value.creditUrl !== "string") return false;
  try {
    const imageUrl = new URL(value.src);
    const creditUrl = new URL(value.creditUrl);
    return imageUrl.protocol === "https:" && imageUrl.hostname === "images.pexels.com" && creditUrl.protocol === "https:" && creditUrl.hostname.endsWith("pexels.com") && cleanText(value.alt, 350).length >= 8;
  } catch { return false; }
}

function isCompleteDestination(value: Partial<Destination>): boolean {
  const textFields: Array<keyof Destination> = ["story", "significance", "bestTime", "gettingThere", "costs", "accommodation", "considerations", "seoTitle", "seoDescription"];
  if (textFields.some((field) => typeof value[field] !== "string" || String(value[field]).trim().length < 12)) return false;
  if (!Array.isArray(value.experience) || !Array.isArray(value.highlights) || value.highlights.length < 2 || !Array.isArray(value.nearby) || !Array.isArray(value.sourceLinks) || !Array.isArray(value.faqs)) return false;
  if (!value.coordinates || !Number.isFinite(value.coordinates.lat) || !Number.isFinite(value.coordinates.lng)) return false;
  return true;
}

function parseSources(value: unknown): Array<{ label: string; url: string }> | null {
  if (value === undefined || value === null || value === "") return [];
  if (!Array.isArray(value) || value.length > 24) return null;
  const result: Array<{ label: string; url: string }> = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const record = entry as Record<string, unknown>;
    const label = cleanText(record.label, 180);
    const url = cleanText(record.url, 1_000);
    try { if (!label || new URL(url).protocol !== "https:") return null; } catch { return null; }
    result.push({ label, url });
  }
  return result;
}

function getSchedule(body: Record<string, unknown>, status: string): Date | null | false {
  if (status !== "scheduled") return null;
  const input = cleanText(body.scheduledAt, 60);
  if (!input) return false;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) || date.getTime() <= Date.now() ? false : date;
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  const body = await readJsonObject(request, 40_000);
  if (!body) return errorResponse("Please submit valid content under 40 KB.", 400);
  const kind = cleanText(body.type, 24);
  const slug = cleanText(body.slug, 100);
  const status = cleanText(body.status, 24);
  if (!validSlug(slug) || !statuses.has(status)) return errorResponse("Choose a valid clean URL slug and publication status.", 400);
  const scheduledAt = getSchedule(body, status);
  if (scheduledAt === false) return errorResponse("Scheduled items need a valid future publication time. Scheduled publishing still requires an operator or cron job.", 400);
  if (kind === "destination") {
    const name = cleanText(body.name, 160);
    const region = cleanText(body.region, 160);
    const tagline = cleanText(body.tagline, 240);
    const summary = cleanText(body.summary, 5_000);
    const seoTitle = cleanText(body.seoTitle, 180);
    const seoDescription = cleanText(body.seoDescription, 320);
    const content = parseContent(body.content) ?? {};
    if (name.length < 2 || region.length < 2 || tagline.length < 6 || summary.length < 25) return errorResponse("A destination needs a name, region, descriptive tagline and substantive summary.", 400);
    if (content.image && !imageIsCredited(content.image)) return errorResponse("Destination photographs must use a Pexels image URL with descriptive alt text and contributor credit. Upload storage is not configured.", 400);
    const base = editorialDestinations.find((destination) => destination.slug === slug);
    const candidate = { ...(base ?? {}), ...content, slug, name, region, tagline, summary, seoTitle: seoTitle || base?.seoTitle || "", seoDescription: seoDescription || base?.seoDescription || "" } as Partial<Destination>;
    if (status === "published" && !isCompleteDestination(candidate)) return errorResponse("Before publishing, complete the destination story, highlights, interests, approximate coordinates, local planning notes, source links, FAQs, and SEO fields. Existing editorial destinations supply their own reviewed template content.", 400);
    try {
      const [saved] = await db.insert(destinations).values({ slug, name, region, tagline, summary, content, coverImage: typeof (content.image as Record<string, unknown> | undefined)?.src === "string" ? String((content.image as Record<string, unknown>).src) : null, coverImageAlt: typeof (content.image as Record<string, unknown> | undefined)?.alt === "string" ? String((content.image as Record<string, unknown>).alt) : null, status, seoTitle: seoTitle || null, seoDescription: seoDescription || null, scheduledAt: scheduledAt || null, publishedAt: status === "published" ? new Date() : null, updatedAt: new Date() }).onConflictDoUpdate({ target: destinations.slug, set: { name, region, tagline, summary, content, coverImage: typeof (content.image as Record<string, unknown> | undefined)?.src === "string" ? String((content.image as Record<string, unknown>).src) : null, coverImageAlt: typeof (content.image as Record<string, unknown> | undefined)?.alt === "string" ? String((content.image as Record<string, unknown>).alt) : null, status, seoTitle: seoTitle || null, seoDescription: seoDescription || null, scheduledAt: scheduledAt || null, publishedAt: status === "published" ? new Date() : null, updatedAt: new Date() } }).returning({ id: destinations.id, slug: destinations.slug, status: destinations.status });
      return okResponse({ message: `Destination “${saved.slug}” saved as ${saved.status}.`, destination: saved }, 201);
    } catch { return errorResponse("The destination could not be saved. Check the slug and database connection.", 503); }
  }
  if (kind === "article") {
    const title = cleanText(body.title, 220);
    const excerpt = cleanText(body.excerpt, 5_000);
    const articleBody = cleanText(body.body, 15_000);
    const category = cleanText(body.category, 80) || "Travel story";
    const author = cleanText(body.author, 160) || "Ethiopia Unfolded Editorial Desk";
    const seoTitle = cleanText(body.seoTitle, 180) || title;
    const seoDescription = cleanText(body.seoDescription, 320) || excerpt;
    const sourceLinks = parseSources(body.sourceLinks);
    if (title.length < 5 || excerpt.length < 20 || articleBody.length < 30 || !author) return errorResponse("A guide or article needs a clear title, useful summary, body and author or editorial desk.", 400);
    if (!sourceLinks) return errorResponse("Source links must be an array of labeled HTTPS URLs.", 400);
    if (status === "published" && articleBody.length < 100) return errorResponse("Add substantive article text before publishing.", 400);
    try {
      const [saved] = await db.insert(articles).values({ slug, title, excerpt, body: articleBody, category, author, sourceLinks, status, seoTitle, seoDescription, scheduledAt: scheduledAt || null, publishedAt: status === "published" ? new Date() : null, updatedAt: new Date() }).onConflictDoUpdate({ target: articles.slug, set: { title, excerpt, body: articleBody, category, author, sourceLinks, status, seoTitle, seoDescription, scheduledAt: scheduledAt || null, publishedAt: status === "published" ? new Date() : null, updatedAt: new Date() } }).returning({ id: articles.id, slug: articles.slug, status: articles.status });
      return okResponse({ message: `Article “${saved.slug}” saved as ${saved.status}.`, article: saved }, 201);
    } catch { return errorResponse("The article could not be saved. Check the slug and database connection.", 503); }
  }
  return errorResponse("Choose destination or article content.", 400);
}
