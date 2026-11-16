import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DestinationCard from "@/components/destination-card";
import NewsletterForm from "@/components/newsletter-form";
import PhotoCredit from "@/components/photo-credit";
import StructuredData from "@/components/structured-data";
import { destinations, experienceCategories, guides, photos, stories, type Story } from "@/lib/content";
import { getPublishedDestinations } from "@/lib/content-service";
import { getArticleRecords } from "@/lib/article-service";
import { articleToStory } from "@/lib/story-adapter";
import { absoluteUrl, siteName } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover Ethiopia Beyond the Ordinary",
  description: "Explore Ethiopia's landscapes, living heritage and culture with thoughtfully sourced destination guides, honest planning tools, and official visitor resources.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Discover Ethiopia Beyond the Ordinary | Ethiopia Unfolded",
    description: "Ancient heritage, extraordinary landscapes, living cultures. Begin a more thoughtful journey into Ethiopia.",
    url: "/",
    images: [{ url: photos.lalibela.src, width: 1600, height: 1100, alt: photos.lalibela.alt }],
  },
};

const itineraryIdeas = [
  { label: "HERITAGE, AT A GENTLER PACE", title: "Stone, story & highland sky", text: "A starting point for travelers drawn to living religious heritage and highland landscapes. Verify every regional advisory and connection before committing.", stops: "Lalibela · Gondar · Simien", tags: ["lalibela", "gondar", "simien-mountains"] },
  { label: "WILDERNESS & WIDE HORIZONS", title: "Wild places, carefully considered", text: "A nature-led planning prompt shaped by thoughtful guiding, wildlife respect, and up-to-date local access information.", stops: "Bale Mountains · Simien Mountains", tags: ["bale-mountains", "simien-mountains"] },
  { label: "A CITY & ITS MANY VOICES", title: "Begin with Addis Ababa", text: "Make room for museums, neighborhoods, food and coffee—then let local knowledge shape what comes next.", stops: "Addis Ababa · A wider Ethiopia", tags: ["addis-ababa", "harar"] },
];

const pageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Discover Ethiopia Beyond the Ordinary",
  description: "Thoughtfully sourced Ethiopia travel discovery and planning.",
  url: absoluteUrl("/"),
  isPartOf: { "@type": "WebSite", name: siteName, url: absoluteUrl("/") },
  mainEntity: {
    "@type": "ItemList",
    name: "Featured Ethiopia destinations",
    itemListElement: destinations.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absoluteUrl(`/destinations/${item.slug}`) })),
  },
};

function SectionHeading({ kicker, title, text, href, link }: { kicker: string; title: string; text?: string; href?: string; link?: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading__main"><p className="eyebrow eyebrow--dark">{kicker}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>
      {href && link && <Link className="text-link section-heading__link" href={href}>{link}</Link>}
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="story-card">
      <Link className="story-card__image-wrap" href={`/travel-stories/${story.slug}`} aria-label={`Read ${story.title}`}>
        {story.image ? <Image className="story-card__image" src={story.image.src} alt={story.image.alt} fill sizes="(max-width:700px) 100vw, 33vw" /> : <span className="story-card__empty" />}
      </Link>
      <div className="story-card__body"><span className="story-card__category">{story.category}</span><h3><Link href={`/travel-stories/${story.slug}`}>{story.title}</Link></h3><p>{story.deck}</p><Link className="text-link" href={`/travel-stories/${story.slug}`}>Read the story</Link>{story.image && <span className="story-card__credit">Photo by <a href={story.image.creditUrl} target="_blank" rel="noreferrer">{story.image.creator} / Pexels</a></span>}</div>
    </article>
  );
}

export default async function HomePage() {
  const [records, featuredDestinations] = await Promise.all([getArticleRecords(), getPublishedDestinations()]);
  const articleBySlug = new Map(records.map((record) => [record.slug, record]));
  const featuredStories: Story[] = stories.flatMap((story) => {
    const record = articleBySlug.get(story.slug);
    if (record && record.status !== "published") return [];
    return [record ? articleToStory(record, story) : story];
  });
  const additionalStories: Story[] = records.filter((record) => record.status === "published" && !stories.some((story) => story.slug === record.slug)).map((record) => articleToStory(record));
  const homeStories = [...featuredStories, ...additionalStories].slice(0, 3);

  return (
    <>
      <StructuredData data={pageData} />
      <section className="hero" aria-labelledby="hero-title">
        <Image className="hero__image" src={photos.lalibela.src} alt={photos.lalibela.alt} fill priority sizes="100vw" />
        <span className="hero__shade" aria-hidden="true"/><span className="hero__grain" aria-hidden="true"/>
        <div className="container hero__content"><div className="hero__copy">
          <p className="eyebrow">The beginning of somewhere extraordinary</p>
          <h1 className="hero__title" id="hero-title">ETHIOPIA.<span>A WORLD WAITING TO BE DISCOVERED.</span></h1>
          <p className="hero__description">Ancient civilizations, extraordinary landscapes, living cultures and unforgettable experiences. Your journey into Ethiopia begins here.</p>
          <div className="hero__actions"><Link className="button button--gold" href="/destinations">Explore Ethiopia <span aria-hidden="true">↗</span></Link><Link className="button button--outline" href="/plan">Plan your journey</Link></div>
        </div></div>
        <span className="hero__caption"><span><a href={photos.lalibela.creditUrl} target="_blank" rel="noreferrer">Photograph by {photos.lalibela.creator} / Pexels</a></span></span>
        <div className="hero-bottom container"><span className="hero-bottom__note"><span aria-hidden="true">✳</span><span>Take the time to discover.<br/>Travel informed. Travel with care.</span></span><a className="hero-bottom__scroll" href="#discover"><span>Scroll to explore</span><span aria-hidden="true"/></a></div>
      </section>

      <section className="destination-rail container" aria-label="Begin exploring Ethiopia"><div className="destination-rail__inner">
        {[{ name: "Lalibela", slug: "lalibela", image: photos.church }, { name: "Gondar", slug: "gondar", image: photos.gondar }, { name: "Danakil", slug: "danakil-depression", image: photos.danakil }, { name: "Addis Ababa", slug: "addis-ababa", image: photos.addis }].map((item, index) => (
          <Link className="rail-card" key={item.slug} href={`/destinations/${item.slug}`}><Image className="rail-card__image" src={item.image.src} alt={item.image.alt} fill sizes="(max-width:700px) 50vw,25vw"/><span className="rail-card__label"><small>Begin here · 0{index + 1}</small><strong>{item.name}</strong></span><span className="rail-card__arrow" aria-hidden="true">↗</span></Link>
        ))}
      </div></section>

      <section className="container intro-band" id="discover"><div><p className="eyebrow eyebrow--dark">There is no single story</p><h2>A country made of many worlds.</h2></div><div className="intro-band__copy"><p>From sacred highland places to brilliant lowland color. From a quiet forest walk to the bustle of a capital. Ethiopia rewards curiosity—and the humility to let each place introduce itself on its own terms.</p><Link className="text-link" href="/travel-guides/ethiopia-travel-guide">Start with our travel guide</Link></div></section>

      <section className="section section--paper" id="destinations"><div className="container"><SectionHeading kicker="Ten ways in" title="Find your Ethiopia." text="Distinctive places, considered individually. Read each guide for its history, source links, planning context and what still needs checking locally." href="/destinations" link="All destinations"/><div className="destination-grid">{destinations.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} feature={index === 0 || index === 6}/>)}</div></div></section>

      <section className="section section--dark" id="experiences"><div className="container"><SectionHeading kicker="Travel by what moves you" title="Go deeper than the itinerary." text="Find a way in through heritage, wildlife, food, photography, or the simple pleasure of being somewhere new." href="/experiences" link="Explore experiences"/><div className="experience-grid">{experienceCategories.map((item, index) => <Link className="experience-card" href={`/experiences#${item.slug}`} key={item.slug}><span className="experience-card__number">0{index + 1} — EXPERIENCE</span><div><h3 className="experience-card__title">{item.title}</h3><p className="experience-card__description">{item.description}</p></div><span className="experience-card__arrow" aria-hidden="true">↗</span></Link>)}</div></div></section>

      <section className="section section--cream"><div className="container editorial-split"><div className="editorial-copy"><p className="eyebrow eyebrow--dark">A deeper kind of encounter</p><h2>Come with curiosity.<br/>Leave room to listen.</h2><p>Ethiopia is not a backdrop. It is home to communities whose stories, faiths and traditions belong to them first. The most meaningful travel starts with local knowledge, thoughtful questions and respect for the right to say no.</p><ul className="editorial-copy__list"><li>Choose locally accountable guides and hosts.</li><li>Ask before photographing a person, home or ceremony.</li><li>Let local access guidance—not an old itinerary—shape your plans.</li></ul><Link className="button button--ink-outline" href="/culture">Meet the culture companion <span aria-hidden="true">↗</span></Link></div><figure className="editorial-media editorial-media--tall"><Image className="editorial-media__image" src={photos.culture.src} alt={photos.culture.alt} fill sizes="(max-width:700px) 100vw,50vw"/><span className="editorial-media__stamp">Go with<br/>respect</span><figcaption className="editorial-media__note"><a href={photos.culture.creditUrl} target="_blank" rel="noreferrer">Photograph by {photos.culture.creator} / Pexels</a></figcaption></figure></div></section>

      <section className="section section--deep" id="itineraries"><div className="container"><SectionHeading kicker="An idea, not a prescription" title="Routes worth imagining." text="Begin with an interest, not a rigid checklist. All sample sequences are editorial prompts—not live routes, safety clearance, or current transport advice." href="/plan" link="Build your own"/><div className="itinerary-teasers">{itineraryIdeas.map((item, index) => <article className="itinerary-teaser" key={item.title}><span className="itinerary-teaser__number">0{index + 1} / {item.label}</span><h3>{item.title}</h3><p>{item.text}</p><div className="itinerary-teaser__foot"><span><strong>Places to consider</strong><br/>{item.stops}</span><Link href={`/plan?destination=${item.tags[0]}`} aria-label={`Start planning ${item.title}`}>↗</Link></div></article>)}</div><div className="itinerary-warning"><span aria-hidden="true">ⓘ</span><span><strong>Before you go:</strong> destinations in an illustrative route can have different and changing access conditions. Check current official government advice for every region before making a travel decision.</span></div></div></section>

      <section className="section section--paper" id="coffee"><div className="container editorial-split editorial-split--reverse"><figure className="editorial-media"><Image className="editorial-media__image" src={photos.coffee.src} alt={photos.coffee.alt} fill sizes="(max-width:700px) 100vw,50vw"/><figcaption className="editorial-media__note"><a href={photos.coffee.creditUrl} target="_blank" rel="noreferrer">Photograph by {photos.coffee.creator} / Pexels</a></figcaption></figure><div className="editorial-copy"><p className="eyebrow eyebrow--dark">An invitation, not a performance</p><h2>Make time for a cup of coffee.</h2><p>In Ethiopia, sharing coffee can be a meaningful act of hospitality. Customs and ceremonies vary. Follow your host's lead, listen before reaching for a camera, and let the people who welcome you decide what the moment means.</p><ul className="editorial-copy__list"><li>Ask permission before filming or photographing.</li><li>Choose a local host who explains what the experience includes.</li><li>Approach all cultural encounters with consent and curiosity.</li></ul><Link className="text-link" href="/culture#coffee">A visitor's culture companion</Link></div></div></section>

      <section className="section section--cream" id="guides"><div className="container"><SectionHeading kicker="Better questions make better journeys" title="Plan with more clarity." text="Straight answers, authoritative links and clear boundaries around what we have not verified." href="/travel-guides" link="Read all travel guides"/><div className="content-cards">{guides.slice(0,3).map((guide) => <Link className="content-card" href={`/travel-guides/${guide.slug}`} key={guide.slug}><span className="content-card__label">{guide.category} · {guide.readingTime}</span><h3>{guide.title}</h3><p>{guide.excerpt}</p><span className="content-card__foot">Read the guide <span aria-hidden="true">↗</span></span></Link>)}</div></div></section>

      <section className="section section--dark"><div className="container editorial-split"><div className="editorial-copy editorial-copy--light"><p className="eyebrow">Season is a question, not an answer</p><h2>When to come?<br/>It depends where.</h2><p>Altitude, regional weather, cultural calendars and current access all shape a good time to go. One month cannot speak for the whole country, and a forecast is never a safety notice.</p><ul className="editorial-copy__list"><li>Check the forecast for the place you actually plan to visit.</li><li>Ask local guides about conditions on your dates.</li><li>Read the latest official regional advisory before booking.</li></ul><Link className="button button--outline" href="/travel-guides/best-time-to-visit-ethiopia">A better seasons guide <span aria-hidden="true">↗</span></Link></div><figure className="editorial-media"><Image className="editorial-media__image" src={photos.highlands.src} alt={photos.highlands.alt} fill sizes="(max-width:700px) 100vw,50vw"/><figcaption className="editorial-media__note"><a href={photos.highlands.creditUrl} target="_blank" rel="noreferrer">Photograph by {photos.highlands.creator} / Pexels</a></figcaption></figure></div></section>

      <section className="section section--cream" id="stories"><div className="container"><SectionHeading kicker="Notes for a more thoughtful journey" title="A story in every detail." text="Editorial essays on culture, heritage, and responsible ways to encounter a place. These are not first-hand reporting; we point you toward primary sources for deeper reading." href="/travel-stories" link="More travel stories"/><div className="story-grid">{homeStories.map((story) => <StoryCard key={story.slug} story={story}/>)}</div></div></section>

      <section className="section section--deep" id="trust"><div className="container editorial-split editorial-split--reverse"><div className="notice notice--dark"><span aria-hidden="true">ⓘ</span><span>Safety advice and access information can change. We do not receive real-time advisory feeds. No destination, route, price or accommodation on this site should be read as a live availability or safety guarantee. <Link href="/travel-intelligence" style={{ color: "var(--gold-light)", textDecoration: "underline", textUnderlineOffset: 3 }}>Open the source directory ↗</Link></span></div><div className="editorial-copy editorial-copy--light"><p className="eyebrow">Trust is part of the journey</p><h2>Facts with sources.<br/>Advice with humility.</h2><p>Explore official government advisories, the Ethiopian eVisa portal, travel-health information, and weather services. Each resource states what we do—and do not—monitor.</p><Link className="button button--gold" href="/travel-intelligence">Visit travel intelligence <span aria-hidden="true">↗</span></Link></div></div></section>

      <section className="section section--paper" id="newsletter"><div className="container"><div className="newsletter-band"><div><p className="eyebrow">A little more Ethiopia, now and then</p><h2>Keep a curious heart.</h2><p>Field notes, culture and inspiration for the journey ahead. Be the first to hear when the editorial letter is ready.</p></div><NewsletterForm/></div></div></section>
    </>
  );
}
