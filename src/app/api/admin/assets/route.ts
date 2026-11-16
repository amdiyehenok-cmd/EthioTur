import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cleanText, errorResponse, okResponse, readJsonObject } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return errorResponse("Administrator sign-in required.", 401);
  const body = await readJsonObject(request, 4_000);
  if (!body) return errorResponse("Please submit valid image metadata.", 400);
  const url = cleanText(body.url, 1_000);
  const altText = cleanText(body.altText, 350);
  const creator = cleanText(body.creator, 180);
  const creditUrl = cleanText(body.creditUrl, 1_000);
  const rightsNote = cleanText(body.rightsNote, 500);
  try {
    const imageUrl = new URL(url);
    const pageUrl = new URL(creditUrl);
    if (imageUrl.protocol !== "https:" || imageUrl.hostname !== "images.pexels.com" || pageUrl.protocol !== "https:" || !pageUrl.hostname.endsWith("pexels.com")) return errorResponse("Use an HTTPS Pexels image URL and contributor credit link. File upload storage is not configured.", 400);
  } catch { return errorResponse("Enter a valid HTTPS Pexels image URL and Pexels contributor page.", 400); }
  if (altText.length < 8 || creator.length < 2 || rightsNote.length < 4) return errorResponse("Include descriptive alt text, a contributor name and a rights/licensing note.", 400);
  try {
    const [asset] = await db.insert(mediaAssets).values({ url, altText, creator, creditUrl, rightsNote, status: "draft" }).returning({ id: mediaAssets.id, status: mediaAssets.status });
    return okResponse({ message: "Image source metadata saved as a draft. This is not a file upload or image-rights clearance.", asset }, 201);
  } catch { return errorResponse("Image metadata could not be saved.", 503); }
}
