import { db } from "@/db";
import { itineraries } from "@/db/schema";
import { destinations as knownDestinations } from "@/lib/content";
import { cleanText, errorResponse, okResponse, readJsonObject, validEmail } from "@/lib/http";

export const runtime = "nodejs";
const allowedInterests = new Set(["history", "heritage", "adventure", "wildlife", "food", "coffee", "festivals", "photography", "culture", "slow travel", "luxury"]);
const allowedStyles = new Set(["Curious explorer", "Culture first", "Active outdoors", "A slower pace", "Comfort led"]);

export async function POST(request: Request) {
  const body = await readJsonObject(request, 8_000);
  if (!body) return errorResponse("Please submit a valid itinerary under 8 KB.", 400);
  if (body.consent !== true) return errorResponse("Please confirm that we may store your itinerary draft.", 400);
  const title = cleanText(body.title, 180);
  const days = Number(body.days);
  const travelStyle = cleanText(body.travelStyle, 60);
  const emailValue = body.email === null || body.email === undefined || body.email === "" ? "" : cleanText(body.email, 254).toLowerCase();
  const budgetUsd = body.budgetUsd === null || body.budgetUsd === undefined || body.budgetUsd === "" ? null : Number(body.budgetUsd);
  const selectedDestinations = Array.isArray(body.destinations) ? body.destinations.filter((slug): slug is string => typeof slug === "string" && knownDestinations.some((item) => item.slug === slug)).slice(0, 10) : [];
  const selectedInterests = Array.isArray(body.interests) ? body.interests.filter((interest): interest is string => typeof interest === "string" && allowedInterests.has(interest)).slice(0, 11) : [];
  if (title.length < 2 || !Number.isInteger(days) || days < 3 || days > 21 || !allowedStyles.has(travelStyle) || !selectedDestinations.length) return errorResponse("Check your title, 3–21 day duration, travel style and at least one destination.", 400);
  if (emailValue && !validEmail(emailValue)) return errorResponse("The optional email address is invalid.", 400);
  if (budgetUsd !== null && (!Number.isInteger(budgetUsd) || budgetUsd < 0 || budgetUsd > 1_000_000)) return errorResponse("Enter an optional whole-dollar budget between 0 and 1,000,000 USD.", 400);
  const routeNotes = `Traveler-selected destination sequence: ${selectedDestinations.join(" → ")}. Preferences: ${selectedInterests.join(", ") || "not specified"}. This saved draft is not a verified route, booking, price estimate, timetable, or safety clearance.`;
  try {
    const [saved] = await db.insert(itineraries).values({ title, days, destinations: selectedDestinations, interests: selectedInterests, travelStyle, budgetUsd, contactEmail: emailValue || null, routeNotes, consentedAt: new Date() }).returning({ id: itineraries.id });
    return okResponse({ message: "Your private planning draft has been saved. No email or booking was created.", id: saved.id }, 201);
  } catch {
    return errorResponse("We couldn't save this itinerary just now. Please try again later.", 503);
  }
}
