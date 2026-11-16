import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, providers } from "@/db/schema";
import { cleanText, errorResponse, okResponse, readJsonObject, validEmail, validUuid } from "@/lib/http";

export const runtime = "nodejs";
const inquiryKinds = new Set(["general", "provider", "trip-planning", "editorial", "privacy"]);

export async function POST(request: Request) {
  const body = await readJsonObject(request, 8_000);
  if (!body) return errorResponse("Please submit a valid inquiry under 8 KB.", 400);
  if (cleanText(body.website, 180)) return okResponse({ message: "Your inquiry has been received for review. This is not a booking." }, 202);
  if (body.consent !== true) return errorResponse("Please confirm that we may store your details to respond.", 400);
  const name = cleanText(body.name, 160);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 50);
  const subject = cleanText(body.subject, 180);
  const message = cleanText(body.message, 5_000);
  const kind = cleanText(body.kind, 60);
  const destinationSlug = cleanText(body.destinationSlug, 100) || null;
  const providerIdRaw = cleanText(body.providerId, 40);
  const providerId = providerIdRaw || null;
  if (name.length < 2 || !validEmail(email) || subject.length < 3 || message.length < 10) return errorResponse("Check your name, email, subject and message, then try again.", 400);
  if (!inquiryKinds.has(kind)) return errorResponse("Choose a valid inquiry type.", 400);
  if (destinationSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(destinationSlug)) return errorResponse("The destination reference is invalid.", 400);
  if (providerId && !validUuid(providerId)) return errorResponse("The provider reference is invalid.", 400);
  if (providerId) {
    try {
      const [provider] = await db.select({ id: providers.id }).from(providers).where(and(eq(providers.id, providerId), eq(providers.status, "approved"))).limit(1);
      if (!provider) return errorResponse("This provider listing is no longer accepting inquiries.", 404);
    } catch { return errorResponse("We couldn't check this provider listing just now.", 503); }
  }
  try {
    await db.insert(inquiries).values({ name, email, phone: phone || null, subject, kind, destinationSlug, providerId, message, consentedAt: new Date(), status: "new" });
    return okResponse({ message: "Your inquiry was received for review. No booking, payment, provider contact or availability is confirmed." }, 201);
  } catch {
    return errorResponse("We couldn't save your inquiry just now. Please try again later.", 503);
  }
}
