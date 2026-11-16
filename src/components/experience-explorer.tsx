"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { destinations, experienceCategories } from "@/lib/content";

export default function ExperienceExplorer() {
  const [active, setActive] = useState("all");
  const categories = active === "all" ? experienceCategories : experienceCategories.filter((item) => item.slug === active);
  const placeSlugs = useMemo(() => new Set(categories.flatMap((item) => item.links)), [categories]);
  const places = destinations.filter((destination) => placeSlugs.has(destination.slug));

  return (
    <>
      <div className="choice-chips" role="group" aria-label="Filter experiences by interest">
        <label className="choice-chip"><input type="radio" name="experience-filter" checked={active === "all"} onChange={() => setActive("all")} /><span>Everything</span></label>
        {experienceCategories.map((category) => (
          <label className="choice-chip" key={category.slug}>
            <input type="radio" name="experience-filter" checked={active === category.slug} onChange={() => setActive(category.slug)} />
            <span>{category.title}</span>
          </label>
        ))}
      </div>
      <div className="experience-grid" style={{ marginTop: 27 }}>
        {categories.map((item, index) => (
          <Link className="experience-card" id={item.slug} href={`/experiences#${item.slug}`} key={item.slug}>
            <span className="experience-card__number">0{index + 1} — EXPERIENCE</span>
            <div><h2 className="experience-card__title">{item.title}</h2><p className="experience-card__description">{item.description}</p></div>
            <span className="experience-card__arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <section style={{ marginTop: 44 }} aria-live="polite">
        <div className="section-heading" style={{ marginBottom: 25 }}>
          <div className="section-heading__main"><p className="eyebrow eyebrow--dark">Start with a place</p><h2 style={{ fontSize: "clamp(30px,4vw,46px)" }}>{active === "all" ? "Places to begin" : `Places for ${experienceCategories.find((item) => item.slug === active)?.title.toLowerCase()}`}</h2></div>
        </div>
        <div className="content-cards">
          {places.map((place) => (
            <Link className="content-card" href={`/destinations/${place.slug}`} key={place.slug}>
              <span className="content-card__label">{place.region}</span><h3>{place.name}</h3><p>{place.tagline}</p><span className="content-card__foot"><span>Open destination guide</span><span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
        {active !== "all" && <p className="field-hint" style={{ marginTop: 18 }}>Editorial inspiration only. This is not live access advice or a vetted service listing. Check current local and official information before travel.</p>}
      </section>
    </>
  );
}
