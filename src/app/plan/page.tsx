import type { Metadata } from "next";
import ItineraryBuilder from "@/components/itinerary-builder";
import { destinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ethiopia Itinerary Builder: Shape a Thoughtful First Draft",
  description: "Build and export an Ethiopia itinerary draft around your duration, destination interests, travel style, and self-set budget—with clear current-access caveats.",
  alternates: { canonical: "/plan" },
  openGraph: { title: "Plan Your Ethiopia Journey | Ethiopia Unfolded", description: "Create a personal itinerary draft. No fake transport prices, booking availability, or safety claims." },
};

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination } = await searchParams;
  const initialDestination = destinations.some((place) => place.slug === destination) ? destination : undefined;
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">A personal first draft</p><h1>Make the journey yours.</h1><p className="interior-hero__sub">Choose what draws you in. Create, save, and export a flexible planning draft—without pretending to know today's routes, prices, bookings, or regional access.</p></div></section>
      <section className="section section--paper"><div className="container"><ItineraryBuilder initialDestination={initialDestination} /></div></section>
    </>
  );
}
