import type { Metadata } from "next";
import Link from "next/link";
import { travelSources } from "@/lib/content";
import StructuredData from "@/components/structured-data";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ethiopia Travel Information: Official Advisories, Visa & Health",
  description: "Direct links to official Ethiopia travel advisories, Ethiopian visa services, CDC health guidance, local weather, tourism, and airline sources.",
  alternates: { canonical: "/travel-intelligence" },
};

const sourcesSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Ethiopia travel information and official source directory",
  description: "Source directory for official travel advisories, visas, health, weather, flights, and tourism information.",
  url: absoluteUrl("/travel-intelligence"),
  publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
};

export default function TravelIntelligencePage() {
  return (
    <>
      <StructuredData data={sourcesSchema} />
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">The important details, with their sources</p><h1>Information that needs checking.</h1><p className="interior-hero__sub">Travel conditions change. Here is the official source directory for entry, health, weather and regional travel advice—with an honest account of what this platform does not monitor.</p></div></section>
      <section className="section section--deep"><div className="container">
        <div className="travel-safety-alert"><p className="eyebrow">Read this before you travel</p><h2>We do not rate Ethiopia's safety.</h2><p>We are not connected to a live government advisory feed and cannot confirm the status of any region, city, border, road, site or itinerary. Do not interpret a destination guide, a map pin, a route suggestion, or an old article as a statement that travel is safe, open or advisable.</p><p>Check the current country and region notices from <strong>your own government's travel-advice service</strong> and local authorities at the time you plan and again before departure. If official advice says not to travel, follow it.</p></div>
        <div className="section-heading" style={{ marginTop: 60 }}><div className="section-heading__main"><p className="eyebrow">Direct links · official first</p><h2>Open the source itself.</h2><p>Government notices change on their publishers' own schedules. We display the original source page so its current status and official publication date stay visible.</p></div></div>
        <div className="source-cards">{travelSources.map((source) => <article className="source-card" key={source.title}><span className="source-card__category">{source.category}</span><h2>{source.title}</h2><p>{source.description}</p><div className="source-card__links">{source.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>{link.label} ↗</a>)}</div><span className="source-status">Source date: see source · Our verification: not recorded</span></article>)}</div>
        <div className="editorial-split" style={{ marginTop: 74 }}><div className="editorial-copy editorial-copy--light"><p className="eyebrow">Entry requirements</p><h2>Check the government portal, not a guess.</h2><p>Visa rules and eligibility can depend on your passport, trip purpose and entry arrangements. This page does not quote fees, guarantee an application outcome or represent a third-party visa service.</p><Link className="button button--gold" href="https://www.evisa.gov.et/" target="_blank">Open the official Ethiopian eVisa ↗</Link><p style={{ marginTop: 15, fontSize: 11 }}>Verify the domain before entering passport details or submitting payment. For questions, use the official Ethiopian immigration service or your embassy.</p></div>
          <div className="notice notice--dark"><span aria-hidden="true">ⓘ</span><span><strong>Health and emergency preparation</strong><br/>Discuss itinerary-specific preparation with a qualified travel-health clinician and consult the CDC Ethiopia source above. In an emergency, use local emergency services and your country's embassy or consular contacts published by those authorities; numbers and availability can change. Ethiopia Unfolded does not operate an emergency line.</span></div>
        </div>
        <div style={{ marginTop: 54 }}><p className="eyebrow">Information record</p><p style={{ maxWidth: 810, color: "rgba(244,241,233,.68)", fontSize: 12, lineHeight: 1.85, marginTop: 14 }}>This directory was assembled as editorial source links, not as a live feed. The dates shown on government or agency pages are the publishers' dates; an Ethiopia Unfolded verification date is not recorded for this initial edition. We have no automated source monitoring, current-advisory status, verified emergency number, live forecast, local access bulletin or transport integration. If an official notice conflicts with any copy on this site, follow the official notice and contact its issuing authority.</p></div>
        <div style={{ marginTop: 38 }}><p className="eyebrow">Prepare one more step</p><h2 className="serif" style={{ margin: "12px 0", fontSize: "clamp(34px,5vw,53px)" }}>Before travel. And again before departure.</h2><div className="route-result__actions"><Link className="button button--gold" href="/travel-guides/ethiopia-travel-guide">Read the travel guide</Link><Link className="button button--outline" href="/travel-guides/ethiopia-visa-entry">Official visa checklist</Link><Link className="button button--outline" href="/contact?kind=privacy">Contact the team</Link></div></div>
      </div></section>
    </>
  );
}
