import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedProviders } from "@/lib/marketplace-service";
import ProviderDirectory from "@/components/provider-directory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ethiopia Local Experiences: Responsible Provider Directory",
  description: "Discover local Ethiopian guides, drivers, cultural hosts, accommodation and experiences as listings are reviewed and approved for publication.",
  alternates: { canonical: "/marketplace" },
};

export default async function MarketplacePage() {
  const providers = await getApprovedProviders();
  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">Local knowledge, on local terms</p><h1>Meet the people behind the place.</h1><p className="interior-hero__sub">An inquiry-first directory for independent guides, thoughtful hosts and locally rooted experiences. No fabricated ratings, instant bookings, payments or availability.</p></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 34 }}><span aria-hidden="true">ⓘ</span><span><strong>A directory in careful preparation.</strong> Listings appear only after administrator review and approval. No experience can be reserved through this website; any inquiry is a request to talk, not a booking or a promise of availability.</span></div>
        {providers.length ? <ProviderDirectory providers={providers}/> : <div className="market-status"><span className="market-status__icon" aria-hidden="true">✳</span><div><h2>Local partners are being onboarded.</h2><p>No provider listing has been approved for public display yet. The provider application and approval workflow is ready; we will not invent local guides, hotels, restaurants, drivers, ratings, or review counts.</p><div className="route-result__actions"><Link className="button button--gold" href="/contact?kind=provider">Introduce a local provider ↗</Link><Link className="button button--ink-outline" href="/travel-guides">Explore the editorial guides</Link></div></div></div>}
        <div className="section-heading" style={{ marginTop: 62 }}><div className="section-heading__main"><p className="eyebrow eyebrow--dark">A human first, digital second</p><h2>Inquiry, not instant booking.</h2><p>Every booking begins with a conversation and a verified provider response. We don't imply availability or collect payment on behalf of an operator.</p></div></div>
        <div className="content-cards">{[{title:"Meet an independent guide", text:"Learn what an accountable guide does, where they are authorized to work, and how fees and cancellation are handled.",kind:"guide"},{title:"Ask about an experience",text:"Describe your interests and dates; have a local host confirm access, requirements and terms directly.",kind:"experience"},{title:"Request an accommodation introduction",text:"No lodging listings or live inventory are connected. Confirm rates, location, accessibility and cancellation directly with a property.",kind:"accommodation"}].map((item) => <Link className="content-card" href={`/contact?kind=provider`} key={item.title}><span className="content-card__label">{item.kind} · by inquiry</span><h3>{item.title}</h3><p>{item.text}</p><span className="content-card__foot">Start a conversation <span aria-hidden="true">↗</span></span></Link>)}</div>
        <p className="field-hint" style={{ marginTop: 22 }}>No platform commission, payment checkout, refund policy or booking provider has been connected. Commercial terms must be agreed directly with the provider.</p>
      </div></section>
    </>
  );
}
