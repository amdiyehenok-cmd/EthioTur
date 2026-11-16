import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import InquiryForm from "@/components/inquiry-form";
import ReviewForm from "@/components/review-form";
import { getApprovedProvider, getApprovedReviews } from "@/lib/marketplace-service";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getApprovedProvider(slug);
  if (!provider) return { title: "Provider profile not found" };
  return {
    title: `${provider.name}: Local ${provider.type} in ${provider.location}`,
    description: provider.description.slice(0, 155),
    alternates: { canonical: `/marketplace/providers/${provider.slug}` },
    openGraph: { type: "website", title: provider.name, description: provider.description.slice(0, 155), url: `/marketplace/providers/${provider.slug}` },
  };
}

export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getApprovedProvider(slug);
  if (!provider) notFound();
  const publicReviews = (await getApprovedReviews(provider.id)).filter((review) => review.status === "approved");
  const averageRating = publicReviews.length ? publicReviews.reduce((sum, review) => sum + review.rating, 0) / publicReviews.length : null;
  const structured = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.description,
    url: absoluteUrl(`/marketplace/providers/${provider.slug}`),
    ...(provider.contactEmail ? { email: provider.contactEmail } : {}),
    ...(provider.website ? { sameAs: [provider.website] } : {}),
    ...(publicReviews.length ? { review: publicReviews.map((review) => ({ "@type": "Review", author: { "@type": "Person", name: review.reviewerName }, reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 }, reviewBody: review.body })) } : {}),
    ...(averageRating !== null ? { aggregateRating: { "@type": "AggregateRating", ratingValue: averageRating.toFixed(1), reviewCount: publicReviews.length, bestRating: 5 } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}/>
      <section className="interior-hero"><div className="container interior-hero__content"><Breadcrumbs items={[{ label: "Local experiences", href: "/marketplace" }, { label: provider.name }]} /><p className="eyebrow">Administrator-approved listing · inquiry only</p><h1>{provider.name}</h1><p className="interior-hero__sub">{provider.type} in {provider.location}. {provider.description}</p><div className="interior-hero__meta"><span>Provider-submitted information</span><span>{publicReviews.length ? `${averageRating?.toFixed(1)} from ${publicReviews.length} moderated ${publicReviews.length === 1 ? "review" : "reviews"}` : "No published reviews yet"}</span></div></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 35 }}><span aria-hidden="true">ⓘ</span><span><strong>An approved listing is not a guarantee.</strong> This profile is published with administrator approval, but the platform does not verify real-time availability, every claim, licensing, insurance, pricing or booking terms. Confirm directly with the provider before paying. Inquiries are not reservations.</span></div>
        {provider.gallery.length > 0 && <div className="content-cards" style={{ marginBottom: 44 }}>{provider.gallery.map((image, index) => <figure className="editorial-media" key={`${image.url}-${index}`} style={{ minHeight: 270 }}><Image className="editorial-media__image" src={image.url} alt={image.alt} fill sizes="(max-width:700px) 100vw, 33vw"/><figcaption className="editorial-media__note">{image.credit || "Provider-supplied image; verify rights with the provider."}</figcaption></figure>)}</div>}
        <div className="editorial-split" style={{ alignItems: "start" }}><section><p className="eyebrow eyebrow--dark">A conversation, first</p><h2 className="serif" style={{ margin: "14px 0 20px", fontSize: "clamp(36px,5vw,54px)" }}>Ask for the details.</h2><p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9 }}>Share your question or proposed dates. This sends a request for a conversation; the site does not book, charge, reserve or transmit your request to the provider automatically.</p><div className="planner-panel"><InquiryForm providerId={provider.id} defaultKind="provider"/></div></section><aside className="planner-panel"><p className="eyebrow eyebrow--dark">Before you confirm</p><h2>Make an informed decision.</h2><ul className="editorial-copy__list"><li>Ask about current dates, total price, currency and inclusions.</li><li>Request cancellation terms, authorization and insurance details.</li><li>Check local access, permissions, and official regional advice.</li><li>Confirm payment goes to the provider you have independently identified.</li></ul>{provider.website && <p style={{ fontSize: 12 }}><a className="text-link" href={provider.website} target="_blank" rel="noreferrer">Visit provider website ↗</a></p>}</aside></div>
        <section style={{ marginTop: 72 }}><div className="section-heading"><div className="section-heading__main"><p className="eyebrow eyebrow--dark">Reviews are moderated</p><h2>Travelers' perspectives.</h2><p>Reviews are displayed only after administrator approval. This website does not independently verify that a reviewer purchased a service.</p></div></div>
          {publicReviews.length ? <div className="content-cards">{publicReviews.map((review) => <article className="content-card" key={review.id}><span className="content-card__label">{review.rating} / 5 · moderated visitor review</span><h3>{review.reviewerName}</h3><p>{review.body}</p></article>)}</div> : <div className="market-status"><span className="market-status__icon" aria-hidden="true">✳</span><div><h2>No published reviews yet.</h2><p>There are no administrator-approved reviews for this listing. We do not invent ratings or review counts.</p></div></div>}
          <div className="planner-panel" style={{ marginTop: 24 }}><p className="eyebrow eyebrow--dark">Share an experience</p><h2>Send a review for moderation.</h2><ReviewForm providerId={provider.id}/></div>
        </section>
        <div style={{ marginTop: 36 }}><Link className="text-link" href="/marketplace">Back to the provider directory</Link></div>
      </div></section>
    </>
  );
}
