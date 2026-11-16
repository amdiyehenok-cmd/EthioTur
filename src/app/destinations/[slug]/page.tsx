import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import DestinationCard from "@/components/destination-card";
import PhotoCredit from "@/components/photo-credit";
import StructuredData from "@/components/structured-data";
import { destinations } from "@/lib/content";
import { getPublishedDestination } from "@/lib/content-service";
import { absoluteUrl, siteName } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getPublishedDestination(slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: destination.seoTitle,
    description: destination.seoDescription,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      type: "article",
      title: destination.seoTitle,
      description: destination.seoDescription,
      url: `/destinations/${destination.slug}`,
      ...(destination.image ? { images: [{ url: destination.image.src, alt: destination.image.alt }] } : {}),
    },
    twitter: { card: destination.image ? "summary_large_image" : "summary", title: destination.seoTitle, description: destination.seoDescription },
  };
}

function MapEmbed({ slug, name, lat, lng }: { slug: string; name: string; lat: number; lng: number }) {
  const radius = slug === "omo-valley" ? 1.25 : slug === "lake-tana" ? 0.7 : 0.12;
  const west = lng - radius;
  const east = lng + radius;
  const south = lat - radius;
  const north = lat + radius;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lng}`;
  const open = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=9/${lat}/${lng}`;
  return (
    <div>
      <iframe className="destination-map-frame" src={map} title={`OpenStreetMap view near ${name}`} loading="lazy" referrerPolicy="no-referrer" />
      <p className="field-hint">Approximate planning marker only. Map data is supplied by OpenStreetMap; it does not display current access, road conditions, advisories, or travel routes. <a href={open} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Open the map ↗</a></p>
    </div>
  );
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getPublishedDestination(slug);
  if (!destination) notFound();
  const nearby = destination.nearby.map((item) => destinations.find((place) => place.slug === item)).filter((item) => item !== undefined);
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: destination.name,
      description: destination.seoDescription,
      url: absoluteUrl(`/destinations/${destination.slug}`),
      touristType: destination.experience,
      ...(destination.image ? { image: destination.image.src } : {}),
      sameAs: destination.sourceLinks.map((source) => source.url),
      containedInPlace: { "@type": "Country", name: "Ethiopia" },
    },
    ...(destination.faqs.length ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: destination.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    }] : []),
  ];

  return (
    <>
      <StructuredData data={structured} />
      <section className={`interior-hero ${destination.image ? "interior-hero--image" : ""}`}>
        {destination.image && <Image className="interior-hero__image" src={destination.image.src} alt={destination.image.alt} fill sizes="100vw" priority />}
        <div className="container interior-hero__content">
          <Breadcrumbs items={[{ label: "Destinations", href: "/destinations" }, { label: destination.name }]} />
          <p className="eyebrow">{destination.kicker} · {destination.region}</p><h1>{destination.name}</h1><p className="interior-hero__sub">{destination.tagline} {destination.summary}</p>
          <div className="interior-hero__actions"><Link className="button button--gold" href={`/plan?destination=${destination.slug}`}>Build a personal draft <span aria-hidden="true">↗</span></Link><Link className="button button--outline" href="#at-a-glance">Start with the essentials</Link></div>
          {destination.image && <PhotoCredit photo={destination.image} className="story-card__credit" />}
        </div>
      </section>
      <section className="section section--paper">
        <div className="container">
          <div className="notice" style={{ marginBottom: 30 }}><span aria-hidden="true">ⓘ</span><span><strong>Check before traveling.</strong> This editorial guide does not confirm present-day access or safety. Current advisories, regional conditions, permissions, prices, and opening details can change. Check your government's current guidance before planning any route.</span></div>
          <div className="destination-detail-grid">
            <article className="prose destination-detail-copy">
              <p className="prose-intro">{destination.summary}</p><div className="content-divider" />
              <h2 id="why-visit">Why visit {destination.name}?</h2><p>{destination.story}</p>
              <h2 id="things-to-do">Things to see and do</h2><p>Use these ideas as starting points, not as a confirmation that a site is open or accessible today. Ask a qualified local guide and relevant site custodian about the arrangements for your dates.</p><ul className="feature-list">{destination.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              <h2 id="cultural-significance">Cultural and natural significance</h2><p>{destination.significance}</p>
              <h2 id="best-time">Best time to visit</h2><p>{destination.bestTime}</p><p>For broader regional context, read our <Link href="/travel-guides/best-time-to-visit-ethiopia">best time to visit Ethiopia guide</Link> and check the <Link href="/travel-intelligence">official weather and travel-advice sources</Link> close to your travel dates.</p>
              <h2 id="getting-there">How to get there</h2><p>{destination.gettingThere}</p>
              <h2 id="costs">Estimated costs</h2><p>{destination.costs}</p>
              <h2 id="accommodation">Accommodation information</h2><p>{destination.accommodation}</p>
              <h2 id="travel-considerations">Travel considerations</h2><p>{destination.considerations}</p>
              <div className="content-divider" /><p className="field-hint">Editorially assembled by the Ethiopia Unfolded team. Source links are provided below; this page has no recorded independent verification date and does not sync updates automatically.</p>
            </article>
            <aside id="at-a-glance" className="destination-detail-aside">
              <div className="planner-panel"><p className="eyebrow eyebrow--dark">At a glance</p><h2>{destination.name}</h2><dl className="destination-facts"><div><dt>Region</dt><dd>{destination.region}</dd></div><div><dt>Explore</dt><dd>{destination.experience.join(" · ") || "Heritage & discovery"}</dd></div><div><dt>Price information</dt><dd>Current verified prices not published</dd></div><div><dt>Access status</dt><dd>Not monitored live</dd></div><div><dt>Source review date</dt><dd>Not recorded; review official sources before travel</dd></div></dl>
                <p className="eyebrow eyebrow--dark" style={{ marginTop: 25 }}>Location map</p><MapEmbed slug={destination.slug} name={destination.name} lat={destination.coordinates.lat} lng={destination.coordinates.lng} />
              </div>
              <div className="planner-panel" style={{ marginTop: 19 }}><p className="eyebrow eyebrow--dark">Go deeper</p><h2>Sources worth opening.</h2><div className="source-box">{destination.sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div><p className="field-hint" style={{ marginTop: 12 }}>Source pages display their own publication or update dates. No source feed is connected here.</p></div>
            </aside>
          </div>
          <div className="section-heading" style={{ marginTop: 86 }}><div className="section-heading__main"><p className="eyebrow eyebrow--dark">Questions, answered carefully</p><h2>Before you go.</h2></div></div>
          <div className="faq-list" style={{ maxWidth: 900 }}>{destination.faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}</summary><div className="faq-item__answer">{faq.answer}</div></details>)}</div>
          {nearby.length > 0 && <section style={{ marginTop: 84 }}><div className="section-heading"><div className="section-heading__main"><p className="eyebrow eyebrow--dark">Continue exploring</p><h2>Places to read about next.</h2><p>These are editorial links, not a verified travel route or recommendation to connect regions.</p></div></div><div className="destination-grid">{nearby.slice(0, 4).map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}</div></section>}
          <section className="section--dark" style={{ marginTop: 84, padding: "48px 35px" }}><p className="eyebrow">One more thoughtful step</p><h2 className="serif" style={{ margin: "14px 0", fontSize: "clamp(34px,5vw,55px)", color: "var(--cream)" }}>Check today's advice. Then build your draft.</h2><p style={{ maxWidth: 700, color: "rgba(244,241,233,.72)", fontSize: 13, lineHeight: 1.8 }}>A plan is a conversation with a place, not a promise that a route is open. Our planner helps organize your interests; it cannot assess access, recommend against an official advisory, or quote a price.</p><div className="route-result__actions"><Link className="button button--gold" href={`/plan?destination=${destination.slug}`}>Create an itinerary draft ↗</Link><Link className="button button--outline" href="/travel-intelligence">Review official sources</Link><Link className="button button--outline" href={`/contact?destination=${destination.slug}`}>Ask a question</Link></div></section>
        </div>
      </section>
    </>
  );
}
