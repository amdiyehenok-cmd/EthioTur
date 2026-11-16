import type { Metadata } from "next";
import ConciergeChat from "@/components/concierge-chat";

export const metadata: Metadata = {
  title: "Ethiopia Travel Concierge: Source-Aware Planning Help",
  description: "Ask questions, explore trip preferences, and build an Ethiopia travel starting point with clear limits and official-source links.",
  alternates: { canonical: "/concierge" },
};

export default function ConciergePage() {
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">A thoughtful first conversation</p><h1>Let the questions lead.</h1><p className="interior-hero__sub">Tell us what you care about, how long you have, and how you like to travel. Your concierge can offer a grounded starting point and show you where to verify the details.</p></div></section>
      <section className="section section--paper"><div className="container">
        <div className="editorial-split" style={{ alignItems: "start" }}><div className="editorial-copy"><p className="eyebrow eyebrow--dark">Designed to be honest</p><h2>Useful guidance has limits.</h2><p>The concierge draws from Ethiopia Unfolded's editorial destination guides and official source links. Without a provider connection, responses come from a carefully bounded, deterministic guide—not a live research engine.</p><ul className="editorial-copy__list"><li>It does not know live hotel availability, fares, bookings, or weather.</li><li>It cannot evaluate current security or tell you a region is safe to visit.</li><li>It can help organize interests, time and your own budget preference.</li><li>Do not submit passports, medical records, financial details, or sensitive information.</li></ul><div className="notice"><span aria-hidden="true">ⓘ</span><span>Optional AI integration uses a <strong>server-only</strong> <code>OPENAI_API_KEY</code> and can be enabled by the operator. When configured, your message and recent chat context are sent to the selected provider. No key is exposed in browser code; review your provider's retention terms first.</span></div><p className="field-hint" style={{ marginTop: 15 }}>No response should replace government travel advice, a qualified clinician, an official immigration source, or a confirmed booking.</p></div><div><ConciergeChat /></div></div>
      </div></section>
    </>
  );
}
