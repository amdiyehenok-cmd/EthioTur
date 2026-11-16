import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { stories } from "@/lib/content";
import { getArticleRecords } from "@/lib/article-service";
import { articleToStory } from "@/lib/story-adapter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ethiopia Travel Stories: Notes on Culture, Heritage & Place",
  description: "Read thoughtful editorial perspectives on Ethiopian coffee culture, living heritage, wildlife etiquette, and more respectful ways to travel.",
  alternates: { canonical: "/travel-stories" },
};

export default async function TravelStoriesPage() {
  const records = await getArticleRecords();
  const recordBySlug = new Map(records.map((record) => [record.slug, record]));
  const editorialStories = stories.flatMap((story) => {
    const record = recordBySlug.get(story.slug);
    if (record && record.status !== "published") return [];
    return [record ? articleToStory(record, story) : story];
  });
  const additionalStories = records.filter((record) => record.status === "published" && !stories.some((story) => story.slug === record.slug)).map((record) => articleToStory(record));
  const publishedStories = [...editorialStories, ...additionalStories];

  return (
    <>
      <section className="interior-hero"><div className="container interior-hero__content"><p className="eyebrow">Field notes for the curious</p><h1>A story in every detail.</h1><p className="interior-hero__sub">Original editorial perspectives on Ethiopian culture, heritage and the ways we move through a place—without pretending to be first-hand reportage.</p></div></section>
      <section className="section section--paper"><div className="container"><div className="notice" style={{ marginBottom: 32 }}><span aria-hidden="true">ⓘ</span><span>These are editorial essays authored by the Ethiopia Unfolded Editorial Desk. They are not personal travel diaries or independently reported, and we name source gaps rather than inventing them.</span></div><div className="story-grid">{publishedStories.map((story) => <article className="story-card" key={story.slug}><Link className="story-card__image-wrap" href={`/travel-stories/${story.slug}`} aria-label={`Read ${story.title}`}>{story.image ? <Image className="story-card__image" src={story.image.src} alt={story.image.alt} fill sizes="(max-width:700px) 100vw, 33vw"/> : <span className="story-card__empty"/>}</Link><div className="story-card__body"><span className="story-card__category">{story.category}</span><h2><Link href={`/travel-stories/${story.slug}`}>{story.title}</Link></h2><p>{story.deck}</p><Link className="text-link" href={`/travel-stories/${story.slug}`}>Read the story</Link>{story.image && <span className="story-card__credit">Photo by <a href={story.image.creditUrl} target="_blank" rel="noreferrer">{story.image.creator} / Pexels</a></span>}</div></article>)}</div>{!publishedStories.length && <div className="market-status"><h2>No published stories yet.</h2><p>Check back as editorially reviewed stories are approved.</p></div>}<div style={{ marginTop: 48 }}><Link className="text-link" href="/travel-guides">Continue with practical travel guides</Link></div></div></section>
    </>
  );
}
