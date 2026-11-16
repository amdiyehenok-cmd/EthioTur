import { db } from "@/db";
import { providers } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cleanText, errorResponse, okResponse, readJsonObject, validEmail, validSlug } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  const body = await readJsonObject(request, 7_000);
  if (!body) return errorResponse("Please submit a valid provider record.", 400);
  const slug = cleanText(body.slug, 140);
  const name = cleanText(body.name, 180);
  const type = cleanText(body.type, 60);
  const location = cleanText(body.location, 180);
  const description = cleanText(body.description, 3_000);
  const contactEmail = cleanText(body.contactEmail, 254).toLowerCase();
  const website = cleanText(body.website, 1_000);
  if (!validSlug(slug) || name.length < 2 || type.length < 2 || location.length < 2 || description.length < 30 || !validEmail(contactEmail)) return errorResponse("Provider records need a safe slug, name, category, location, substantive description and valid contact email.", 400);
  if (website) { try { if (new URL(website).protocol !== "https:") return errorResponse("Provider websites must use HTTPS.", 400); } catch { return errorResponse("Enter a valid HTTPS provider website.", 400); } }
  try {
    const [saved] = await db.insert(providers).values({ slug, name, type, location, description, contactEmail, website: website || null, gallery: [], status: "pending_review" }).onConflictDoUpdate({ target: providers.slug, set: { name, type, location, description, contactEmail, website: website || null, status: "pending_review", approvedAt: null, updatedAt: new Date() } }).returning({ id: providers.id, slug: providers.slug, status: providers.status });
    return okResponse({ message: `Provider profile saved as ${saved.status}; it is not public until approved.`, provider: saved }, 201);
  } catch { return errorResponse("The provider record could not be saved. Check the slug.", 503); }
}
