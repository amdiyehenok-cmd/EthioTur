import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { cleanText, errorResponse, okResponse, readJsonObject, validEmail } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJsonObject(request, 2_000);
  if (!body) return errorResponse("Please submit a valid, small request.", 400);
  if (body.consent !== true) return errorResponse("Please confirm that we may store your email as newsletter interest.", 400);
  const email = cleanText(body.email, 254).toLowerCase();
  if (!validEmail(email)) return errorResponse("Enter a valid email address.", 400);
  try {
    const inserted = await db.insert(newsletterSubscribers).values({ email, status: "active" }).onConflictDoNothing({ target: newsletterSubscribers.email }).returning({ id: newsletterSubscribers.id });
    return okResponse({ message: inserted.length ? "Your interest has been recorded. Email delivery is not configured, so no newsletter will be sent." : "This email is already recorded as interested. Email delivery is not configured." }, inserted.length ? 201 : 200);
  } catch {
    return errorResponse("We couldn't save your interest just now. Please try again later.", 503);
  }
}
