import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/inquiry-form";
import { destinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Ethiopia Unfolded: Trip Questions & Provider Inquiries",
  description: "Send a trip-planning question, provider introduction, editorial request, partnership proposal, or privacy request to Ethiopia Unfolded.",
  alternates: { canonical: "/contact" },
};

const inquiryKinds = ["general", "provider", "trip-planning", "editorial", "privacy"];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ kind?: string; destination?: string }> }) {
  const query = await searchParams;
  const defaultKind = query.kind && inquiryKinds.includes(query.kind) ? query.kind : query.destination ? "trip-planning" : "general";
  const destination = destinations.find((place) => place.slug === query.destination);
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">A question is a good beginning</p><h1>Let's talk about the journey.</h1><p className="interior-hero__sub">Trip planning, a local provider introduction, an editorial note, or a privacy request. Start a conversation; a message is never a booking.</p></div></section>
      <section className="section section--paper"><div className="container editorial-split" style={{ alignItems: "start" }}><div className="editorial-copy"><p className="eyebrow eyebrow--dark">Send a note</p><h2>What would you like to explore?</h2><p>We store your message for administrative review so the site operator can follow up. No local provider is booked or contacted automatically, and no live response time is promised.</p><ul className="editorial-copy__list"><li>Do not submit passport, payment, medical or emergency information.</li><li>Do not treat an inquiry as a reservation or confirmed service.</li><li>To apply as a provider, introduce your independently verifiable business and services.</li></ul><p className="field-hint">Need current travel advice? This inbox is not an emergency service. Consult the current official government and authority sources in our <Link href="/travel-intelligence" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>travel information centre</Link>.</p></div><div className="planner-panel"><p className="eyebrow eyebrow--dark">Your message</p><InquiryForm destinationSlug={destination?.slug} defaultKind={defaultKind}/></div></div></section>
    </>
  );
}
