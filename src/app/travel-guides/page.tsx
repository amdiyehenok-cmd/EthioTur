import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ethiopia Travel Guides: Practical, Source-First Advice",
  description: "Find careful Ethiopia travel planning guides for first visits, itinerary building, costs, seasons, visa checks, and things to do in Addis Ababa.",
  alternates: { canonical: "/travel-guides" },
};

export default function TravelGuidesPage() {
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">Good trips begin with good questions</p><h1>Travel guides, with the facts in focus.</h1><p className="interior-hero__sub">A practical library for curious travelers: clear sourcing, useful next steps, and honest notes wherever we do not have live information.</p></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 35 }}><span aria-hidden="true">ⓘ</span><span>These guides provide planning context, not legal, medical, live weather, safety, booking, or current price advice. Verify important details against the linked official source and a qualified provider.</span></div><div className="content-cards">{guides.map((guide) => <Link className="content-card" key={guide.slug} href={`/travel-guides/${guide.slug}`}><span className="content-card__label">{guide.category} · {guide.readingTime}</span><h2>{guide.title}</h2><p>{guide.excerpt}</p><span className="content-card__foot"><span>Editorial desk · source links</span><span aria-hidden="true">↗</span></span></Link>)}</div></div></section>
    </>
  );
}
