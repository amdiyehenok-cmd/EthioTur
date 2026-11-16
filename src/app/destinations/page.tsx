import type { Metadata } from "next";
import Link from "next/link";
import DestinationCard from "@/components/destination-card";
import StructuredData from "@/components/structured-data";
import { getPublishedDestinations } from "@/lib/content-service";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Places to Visit in Ethiopia: 10 Destination Guides",
  description: "Explore the best places to visit in Ethiopia with ten source-linked guides to Lalibela, the Simien Mountains, Danakil, Omo Valley, Harar, Bale, Lake Tana, Gondar, Axum, and Addis Ababa.",
  alternates: { canonical: "/destinations" },
  openGraph: { title: "Best Places to Visit in Ethiopia | Ethiopia Unfolded", description: "Ten considered Ethiopia destination guides, with official heritage sources and practical planning caveats.", url: "/destinations" },
};

export default async function DestinationsPage() {
  const places = await getPublishedDestinations();
  const listData = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Best places to visit in Ethiopia", description: "A collection of source-linked Ethiopia destination guides.", url: absoluteUrl("/destinations"), mainEntity: { "@type": "ItemList", itemListElement: places.map((place, index) => ({ "@type": "ListItem", position: index + 1, name: place.name, url: absoluteUrl(`/destinations/${place.slug}`) })) } };
  return (
    <>
      <StructuredData data={listData}/>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">A map made of many meanings</p><h1>Find the place that finds you.</h1><p className="interior-hero__sub">From ancient highland sites to cities full of possibility, discover distinctive starting points—each with context, sources, and room for local knowledge.</p></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 35 }}><span aria-hidden="true">ⓘ</span><span><strong>Good to know.</strong> These guides describe a destination's cultural and natural significance. They are not live safety notices, access confirmations, schedules, current prices, or accommodation listings. Check official advice for every region before planning.</span></div>
        <div className="section-heading"><div className="section-heading__main"><p className="eyebrow eyebrow--dark">Ten distinct doorways</p><h2>Best places to visit in Ethiopia.</h2><p>Begin where your interests meet the places you have time to understand. Every destination guide separates sourced heritage context from information you still need to confirm.</p></div><Link className="text-link section-heading__link" href="/plan">Shape a first itinerary</Link></div>
        <div className="destination-grid">{places.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} feature={index === 0 || index === 6}/>)}</div>
        <div style={{ marginTop: 48, maxWidth: 760 }}><p className="eyebrow eyebrow--dark">Want a little more context?</p><h2 className="serif" style={{ fontSize: "clamp(35px,5vw,54px)", lineHeight: 1.03, margin: "15px 0" }}>A thoughtful trip starts before takeoff.</h2><p style={{ color: "var(--muted)", lineHeight: 1.9 }}>Explore our source-first <Link href="/travel-guides/ethiopia-travel-guide" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Ethiopia travel guide</Link> and the <Link href="/travel-intelligence" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>official travel information centre</Link> before you finalize a route.</p></div>
      </div></section>
    </>
  );
}
