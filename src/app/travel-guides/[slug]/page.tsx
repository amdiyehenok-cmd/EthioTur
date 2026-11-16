import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import StructuredData from "@/components/structured-data";
import { guides } from "@/lib/content";
import { absoluteUrl, siteName } from "@/lib/site";

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return { title: "Travel guide not found" };
  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    alternates: { canonical: `/travel-guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.seoTitle, description: guide.seoDescription, url: `/travel-guides/${guide.slug}`, ...(guide.coverImage ? { images: [{ url: guide.coverImage.src, alt: guide.coverImage.alt }] } : {}) },
  };
}

export default async function TravelGuideArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.seoDescription,
    url: absoluteUrl(`/travel-guides/${guide.slug}`),
    inLanguage: "en",
    author: { "@type": "Organization", name: `${siteName} Editorial Desk`, url: absoluteUrl("/travel-guides") },
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    citation: guide.sourceLinks.map((source) => source.url),
    ...(guide.coverImage ? { image: guide.coverImage.src } : {}),
    mainEntityOfPage: absoluteUrl(`/travel-guides/${guide.slug}`),
  };
  return (
    <>
      <StructuredData data={articleSchema} />
      <section className="interior-hero"><div className="container interior-hero__content"><Breadcrumbs items={[{ label: "Travel guides", href: "/travel-guides" }, { label: guide.title }]} /><p className="eyebrow">{guide.category} · {guide.readingTime}</p><h1>{guide.title}</h1><p className="interior-hero__sub">{guide.excerpt}</p><div className="interior-hero__meta"><span>Written by {siteName} Editorial Desk</span><span>Primary-source links included</span></div></div></section>
      <article className="section section--paper"><div className="container--narrow">
        <div className="notice" style={{ marginBottom: 30 }}><span aria-hidden="true">ⓘ</span><span>This is an editorial planning guide, not a live advisory or professional, medical, immigration, price, or booking service. It has no recorded individual reviewer or last-verified date. Follow the official sources below for current requirements.</span></div>
        <p className="prose-intro">{guide.excerpt}</p>
        <nav className="guide-toc" aria-label="On this page"><strong>In this guide</strong>{guide.body.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}>{section.heading}</a>)}<a href="#official-sources">Sources to check</a></nav>
        <div className="content-divider" />
        <div className="prose">{guide.body.map((section, index) => <section key={section.heading} id={`section-${index + 1}`}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <section id="official-sources"><h2>Official and primary sources</h2><p>We link to source owners so you can read current information directly. The source pages display their own publication or update date; we do not sync them or record an independent verification date here.</p><div className="source-box">{guide.sourceLinks.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div></section>
        </div>
        <div className="content-divider"/><p className="field-hint">Author: Ethiopia Unfolded Editorial Desk. No individual author or independent reviewer is named on this resource.</p><Link className="text-link" href="/plan">Build a personal planning draft</Link>
      </div></article>
    </>
  );
}
