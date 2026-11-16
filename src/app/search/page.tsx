import type { Metadata } from "next";
import Link from "next/link";
import { destinations, guides, stories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search Ethiopia Unfolded",
  description: "Search Ethiopia Unfolded destination guides, trip-planning resources, and editorial stories.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 90);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = [
    ...destinations.filter((item) => terms.length === 0 || terms.some((term) => `${item.name} ${item.region} ${item.summary} ${item.experience.join(" ")}`.toLowerCase().includes(term))).map((item) => ({ title: item.name, description: item.tagline, label: `Destination · ${item.region}`, href: `/destinations/${item.slug}` })),
    ...guides.filter((item) => terms.length === 0 || terms.some((term) => `${item.title} ${item.category} ${item.excerpt} ${item.body.map((block) => block.paragraphs.join(" ")).join(" ")}`.toLowerCase().includes(term))).map((item) => ({ title: item.title, description: item.excerpt, label: `Travel guide · ${item.category}`, href: `/travel-guides/${item.slug}` })),
    ...stories.filter((item) => terms.length === 0 || terms.some((term) => `${item.title} ${item.deck} ${item.category}`.toLowerCase().includes(term))).map((item) => ({ title: item.title, description: item.deck, label: `Story · ${item.category}`, href: `/travel-stories/${item.slug}` })),
  ];

  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">An open book, with good directions</p><h1>Search the journey.</h1><p className="interior-hero__sub">Find destination guides, practical planning notes and editorial perspectives.</p></div></section>
      <section className="section section--paper"><div className="container">
        <form action="/search" method="get" role="search" style={{ display: "flex", gap: 10, maxWidth: 800, marginBottom: 35 }}><label className="visually-hidden" htmlFor="site-query">Search destinations, guides and stories</label><input id="site-query" name="q" type="search" defaultValue={query} placeholder="Try “Lalibela”, “coffee”, or “travel costs”" maxLength={90} style={{ flex: 1, minWidth: 0, minHeight: 49, padding: "12px 15px", border: "1px solid var(--line)", background: "white", fontSize: 13 }}/><button className="button button--gold" type="submit">Search ↗</button></form>
        <p className="eyebrow eyebrow--dark">{query ? `Results for “${query}”` : "A few good places to start"} · {results.length} {results.length === 1 ? "result" : "results"}</p>
        {results.length ? <div className="content-cards" style={{ marginTop: 21 }}>{results.map((item) => <Link className="content-card" href={item.href} key={item.href}><span className="content-card__label">{item.label}</span><h2>{item.title}</h2><p>{item.description}</p><span className="content-card__foot">Open this guide <span aria-hidden="true">↗</span></span></Link>)}</div> : <div className="market-status" style={{ marginTop: 20 }}><span className="market-status__icon" aria-hidden="true">?</span><div><h2>No exact match—yet.</h2><p>Try a destination, region, interest or planning topic. You can also browse all <Link href="/destinations" style={{ textDecoration: "underline" }}>destinations</Link>.</p></div></div>}
      </div></section>
    </>
  );
}
