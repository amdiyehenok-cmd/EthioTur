import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { destinations as destinationTable } from "@/db/schema";
import { destinations as editorialDestinations, type Destination } from "@/lib/content";

function draftDestinationFromRow(row: typeof destinationTable.$inferSelect, base?: Destination): Destination {
  const content = row.content as Partial<Destination>;
  return {
    ...(base ?? {
      slug: row.slug,
      name: row.name,
      region: row.region,
      kicker: "Destination guide",
      tagline: row.tagline,
      summary: row.summary,
      story: row.summary,
      experience: [],
      coordinates: { lat: 9.145, lng: 39.24 },
      highlights: [],
      significance: row.summary,
      bestTime: "Contact a qualified local source to verify current weather, event, and access information.",
      gettingThere: "Check current government travel advice and confirm all transport with the operating provider.",
      costs: "No verified prices or availability are published here. Request a current itemized quote.",
      accommodation: "No independently vetted accommodation inventory is listed yet.",
      nearby: [],
      considerations: "This page does not provide live access, safety, price, or booking information. Check official sources before travel.",
      sourceLinks: [],
      faqs: [],
      seoTitle: row.seoTitle || `${row.name} travel guide | Ethiopia Unfolded`,
      seoDescription: row.seoDescription || row.summary,
    }),
    ...content,
    slug: row.slug,
    name: row.name,
    region: row.region,
    tagline: row.tagline,
    summary: row.summary,
    seoTitle: row.seoTitle || content.seoTitle || base?.seoTitle || `${row.name} travel guide | Ethiopia Unfolded`,
    seoDescription: row.seoDescription || content.seoDescription || base?.seoDescription || row.summary,
  };
}

export async function getPublishedDestinations(): Promise<Destination[]> {
  try {
    const rows = await db.select().from(destinationTable).orderBy(asc(destinationTable.name));
    const merged = new Map(editorialDestinations.map((destination) => [destination.slug, destination]));
    for (const row of rows) {
      if (row.status === "published") merged.set(row.slug, draftDestinationFromRow(row, merged.get(row.slug)));
      else merged.delete(row.slug);
    }
    return [...merged.values()];
  } catch {
    return editorialDestinations;
  }
}

export async function getPublishedDestination(slug: string): Promise<Destination | undefined> {
  const base = editorialDestinations.find((destination) => destination.slug === slug);
  try {
    const [row] = await db.select().from(destinationTable).where(eq(destinationTable.slug, slug)).limit(1);
    if (row) return row.status === "published" ? draftDestinationFromRow(row, base) : undefined;
  } catch {
    return base;
  }
  return base;
}
