import type { Metadata } from "next";
import ExperienceExplorer from "@/components/experience-explorer";

export const metadata: Metadata = {
  title: "Ethiopian Experiences: Heritage, Nature, Culture & More",
  description: "Explore Ethiopian heritage, highland adventure, wildlife, food and coffee culture, festivals, photography, community encounters, and considered luxury travel.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">Follow what makes you curious</p><h1>Find your way into Ethiopia.</h1><p className="interior-hero__sub">History, highland walking, coffee, wildlife, sacred places, photography. Choose an experience; let the people who call this place home guide the rest.</p></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 29 }}><span aria-hidden="true">ⓘ</span><span>Experience categories are editorial inspiration, not booking listings. Local guides, transport and live availability have not yet been verified or integrated. Always check current regional advice before arranging travel.</span></div><ExperienceExplorer /></div></section>
    </>
  );
}
