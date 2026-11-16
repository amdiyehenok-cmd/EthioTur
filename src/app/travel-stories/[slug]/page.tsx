import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import PhotoCredit from "@/components/photo-credit";
import StructuredData from "@/components/structured-data";
import { stories } from "@/lib/content";
import { getArticleRecord } from "@/lib/article-service";
import { articleToStory } from "@/lib/story-adapter";
import { absoluteUrl, siteName } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() { return stories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [record] = await Promise.all([getArticleRecord(slug)]);
  const base = stories.find((item) => item.slug === slug);
  if (record && record.status !== "published") return { title: "Story unavailable", robots: { index: false, follow: false } };
  const story = record ? articleToStory(record, base) : base;
  if (!story) return { title: "Story not found" };
  return { title: story.title, description: story.deck, alternates: { canonical: `/travel-stories/${story.slug}` }, openGraph: { type: "article", title: story.title, description: story.deck, url: `/travel-stories/${story.slug}`, ...(story.image ? { images: [{ url: story.image.src, alt: story.image.alt }] } : {}) } };
}

export default async function TravelStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getArticleRecord(slug);
  if (record && record.status !== "published") notFound();
  const base = stories.find((item) => item.slug === slug);
  const story = record ? articleToStory(record, base) : base;
  if (!story) notFound();
  const sourceLinks = record?.sourceLinks || [];
  const structured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.deck,
    url: absoluteUrl(`/travel-stories/${story.slug}`),
    inLanguage: "en",
    author: { "@type": "Organization", name: story.author, url: absoluteUrl("/travel-stories") },
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    ...(record?.publishedAt ? { datePublished: record.publishedAt.toISOString(), dateModified: record.updatedAt.toISOString() } : {}),
    ...(sourceLinks.length ? { citation: sourceLinks.map((source) => source.url) } : {}),
    ...(story.image ? { image: story.image.src } : {}),
  };
  return (
    <>
      <StructuredData data={structured}/>
      <section className={`interior-hero ${story.image ? "interior-hero--image" : ""}`}>{story.image && <Image className="interior-hero__image" src={story.image.src} alt={story.image.alt} fill sizes="100vw" priority/>}<div className="container interior-hero__content"><Breadcrumbs items={[{ label: "Travel stories", href: "/travel-stories" }, { label: story.title }]}/><p className="eyebrow">{story.category}</p><h1>{story.title}</h1><p className="interior-hero__sub">{story.deck}</p><div className="interior-hero__meta"><span>By {story.author}</span><span>Editorial perspective · not first-hand reportage</span>{record?.publishedAt && <span>Published {record.publishedAt.toISOString().slice(0, 10)}</span>}</div>{story.image && <PhotoCredit photo={story.image} className="story-card__credit"/>}</div></section>
      <article className="section section--paper"><div className="container--narrow"><div className="notice" style={{ marginBottom: 31 }}><span aria-hidden="true">ⓘ</span><span>Editorial note: this is an original perspective by the Ethiopia Unfolded Editorial Desk, not an account of a personally reported journey. Follow the relevant community, property custodian and official sources.</span></div><p className="prose-intro">{story.deck}</p><div className="content-divider"/><div className="prose">{story.body.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={`${section.heading}-${index}`}>{paragraph}</p>)}</section>)}{sourceLinks.length > 0 && <section><h2>Source links</h2><p>Follow these source owners for primary information. This editorial does not sync external updates.</p><div className="source-box">{sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div></section>}</div><div className="content-divider"/><Link className="text-link" href={story.href}>{base ? story.href.startsWith("/") && story.href.includes("#") ? "Continue to the culture companion" : "Explore the related destination" : "Explore all travel guides"}</Link><span className="field-hint" style={{ display: "block", marginTop: 14 }}>{record ? `CMS publication date: ${record.publishedAt?.toISOString().slice(0, 10) || "not recorded"}.` : "No individual author or separate review date is recorded on this piece."}</span></div></article>
    </>
  );
}
