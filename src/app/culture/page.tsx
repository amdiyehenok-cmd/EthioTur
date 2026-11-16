import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PhotoCredit from "@/components/photo-credit";
import StructuredData from "@/components/structured-data";
import { cultureSources, photos } from "@/lib/content";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ethiopian Culture Companion: Greetings, Coffee, Food & Etiquette",
  description: "A respectful visitor's companion to Amharic greetings, Ethiopian food and coffee, cultural etiquette, clothing, festivals, and living heritage.",
  alternates: { canonical: "/culture" },
  openGraph: { title: "Ethiopian Culture Companion | Ethiopia Unfolded", description: "Approach Ethiopian culture with curiosity, respect, and the invitation to listen." },
};

const guideSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "A Respectful Visitor's Companion to Ethiopian Culture",
  description: "Thoughtful cultural context, source links, and practical etiquette for visitors to Ethiopia.",
  url: absoluteUrl("/culture"),
  inLanguage: "en",
  author: { "@type": "Organization", name: `${siteName} Editorial Desk`, url: absoluteUrl("/travel-guides") },
  publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
  citation: cultureSources.map((source) => source.url),
};

export default function CulturePage() {
  return (
    <>
      <StructuredData data={guideSchema} />
      <section className="interior-hero interior-hero--image"><Image className="interior-hero__image" src={photos.culture.src} alt={photos.culture.alt} fill sizes="100vw" priority/><div className="container interior-hero__content"><p className="eyebrow">Listen before you look</p><h1>A culture is never a checklist.</h1><p className="interior-hero__sub">A respectful companion for curious visitors: small words, shared food, living heritage, and the everyday kindness of letting a host set the pace.</p><PhotoCredit photo={photos.culture} className="story-card__credit" /></div></section>
      <section className="section section--paper"><div className="container">
        <div className="notice" style={{ marginBottom: 30 }}><span aria-hidden="true">ⓘ</span><span><strong>Ethiopia is home to many communities, languages and traditions.</strong> No short guide can speak for everyone. These visitor notes are general prompts; listen to the people and hosts in the place you are visiting.</span></div>
        <div className="culture-grid">
          <section className="culture-card" id="phrases"><span className="culture-card__kicker">A few words · Amharic</span><h2>Start with a greeting.</h2><p>Amharic is one of Ethiopia's many languages. Transliteration and pronunciation vary; make a gentle effort, smile, and ask which language a person prefers.</p><div className="phrase-row" style={{ marginTop: 20 }}><strong lang="am">Selam · ሰላም</strong><span>Hello · also used as “peace”</span></div><div className="phrase-row"><strong lang="am">Ameseginalehu · አመሰግናለሁ</strong><span>Thank you · a common polite phrase</span></div><p className="field-hint" style={{ marginTop: 12 }}>Transliterations are approximations. Please ask a fluent speaker for pronunciation and local-language alternatives.</p></section>
          <section className="culture-card" id="etiquette"><span className="culture-card__kicker">A good guest</span><h2>Let local etiquette lead.</h2><p>Watch what your host does and ask when unsure. Practices differ by place, faith, family and situation.</p><div className="phrase-row" style={{ marginTop: 19 }}><strong>Ask first.</strong><span>Request permission before photographing people, homes or ceremonies.</span></div><div className="phrase-row"><strong>Dress thoughtfully.</strong><span>Ask what to wear at a specific religious or community site.</span></div><div className="phrase-row"><strong>Accept a boundary.</strong><span>“No” is a complete answer to a request or photograph.</span></div></section>
          <section className="culture-card" id="food"><span className="culture-card__kicker">At the table</span><h2>Food is an invitation to listen.</h2><p>Injera and shared dishes are familiar in many Ethiopian meals, but food traditions and dietary practices vary. Ask what a dish contains, explain allergies clearly, and follow the host's lead rather than assuming one custom applies everywhere.</p><p style={{ marginTop: 13 }}>If you have dietary requirements, contact a restaurant or host in advance, and confirm ingredients again when ordering. This guide cannot verify an individual kitchen's preparation.</p></section>
          <section className="culture-card" id="coffee"><span className="culture-card__kicker">A shared moment</span><h2>Coffee, with gratitude.</h2><p>Ethiopian coffee culture carries deep meaning and is expressed in different ways. A coffee invitation is a host's act of hospitality, not a performance owed to visitors. Ask before filming and let the people sharing it decide how to tell its story.</p><div className="source-box" style={{ marginTop: 16 }}><a href="https://visitethiopia.et/" target="_blank" rel="noreferrer">Ethiopia's Ministry of Tourism</a></div></section>
          <section className="culture-card" id="clothing"><span className="culture-card__kicker">Clothing & custom</span><h2>Respect the setting.</h2><p>There is no single dress code for the whole country. Around an active religious site or a private cultural gathering, ask a host what is appropriate before you arrive; follow requests about shoes, clothing, or access.</p><p style={{ marginTop: 13 }}>Traditional garments are worn in many contexts and have their own cultural significance. Treat them respectfully; ask permission before handling, styling or photographing someone in clothing that is not yours.</p></section>
          <section className="culture-card" id="festivals"><span className="culture-card__kicker">Festivals & living heritage</span><h2>Attend as a guest.</h2><p>Ethiopian Epiphany (Timket) is inscribed by UNESCO as intangible cultural heritage. A listing explains recognized heritage; it does not mean every gathering is a public visitor event. Confirm local dates and access with the community and follow its direction.</p><div className="source-box" style={{ marginTop: 17 }}><a href="https://ich.unesco.org/en/RL/ethiopian-epiphany-01491" target="_blank" rel="noreferrer">UNESCO — Ethiopian Epiphany</a></div></section>
          <section className="culture-card" id="history"><span className="culture-card__kicker">Historical heritage</span><h2>Many chapters. No single shortcut.</h2><p>Rock-hewn churches, ancient archaeological landscapes, fortified cities and natural heritage tell different stories. Read the primary UNESCO record and seek local interpretation rather than reducing a complex place to one headline.</p><div className="source-box" style={{ marginTop: 17 }}>{cultureSources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div></section>
          <section className="culture-card" id="photography"><span className="culture-card__kicker">Photography & consent</span><h2>The best frame may be the one you ask about.</h2><p>Ask before taking a portrait, share how an image will be used, and do not assume consent is transferable to publishing, selling or geotagging. Keep private interiors, children and worshippers out of frame unless a responsible host explicitly permits it.</p><p style={{ marginTop: 13 }}>If a person changes their mind, stop and delete the image. Respect for the subject matters more than the photograph.</p></section>
        </div>
        <div style={{ marginTop: 50 }}><p className="eyebrow eyebrow--dark">A practice worth carrying</p><h2 className="serif" style={{ maxWidth: 760, margin: "14px 0", fontSize: "clamp(35px,5vw,56px)", lineHeight: 1.02 }}>The most beautiful encounter is one everyone chose.</h2><p style={{ maxWidth: 740, color: "var(--muted)", fontSize: 13, lineHeight: 1.9 }}>These introductory notes are not community-authored guidance or a replacement for a host's wishes. We have not recorded an independent cultural review date. Read the source material, and follow the people you meet.</p><Link className="text-link" href="/travel-guides">Continue with the travel guides</Link></div>
      </div></section>
    </>
  );
}
