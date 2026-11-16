"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { destinations, experienceCategories } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const outline = "M183,18 245,32 287,46 319,62 358,73 374,103 403,119 414,150 397,174 404,210 386,226 386,260 360,279 366,310 344,324 341,361 318,374 300,402 266,390 248,409 213,392 184,406 160,384 129,391 115,362 83,359 71,331 45,317 53,285 31,264 45,237 38,207 56,187 47,160 67,142 64,109 94,103 105,75 136,76 148,49 171,48 Z";
const interests = ["history", "adventure", "wildlife", "food", "festivals", "photography", "culture", "slow travel"];
const travelStyles = ["Curious explorer", "Culture first", "Active outdoors", "A slower pace", "Comfort led"];

function getPoint(lat: number, lng: number) {
  const x = 38 + ((lng - 32) / 16.5) * 370;
  const y = 18 + ((15 - lat) / 12.5) * 385;
  return { x, y };
}

export default function ItineraryBuilder({ initialDestination }: { initialDestination?: string }) {
  const [days, setDays] = useState(7);
  const [selected, setSelected] = useState<string[]>(() => initialDestination && destinations.some((destination) => destination.slug === initialDestination) ? [initialDestination] : ["lalibela", "gondar", "simien-mountains"]);

  useEffect(() => {
    if (!initialDestination || !destinations.some((destination) => destination.slug === initialDestination)) return;
    setSelected((current) => current.includes(initialDestination) ? current : [initialDestination, ...current]);
  }, [initialDestination]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["heritage", "culture"]);
  const [style, setStyle] = useState(travelStyles[0]);
  const [budget, setBudget] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planTitle, setPlanTitle] = useState("My Ethiopia journey");

  const chosenPlaces = useMemo(() => selected.map((slug) => destinations.find((destination) => destination.slug === slug)).filter((place) => place !== undefined), [selected]);
  const routePath = chosenPlaces.map((place) => { const point = getPoint(place.coordinates.lat, place.coordinates.lng); return `${point.x},${point.y}`; }).join(" ");

  function toggleDestination(slug: string) {
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
    setStatus("");
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  }

  function handlePinKey(event: KeyboardEvent<SVGGElement>, slug: string) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleDestination(slug); }
  }

  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);
    if (!chosenPlaces.length) { setStatus("Choose at least one destination to shape your route."); setIsError(true); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: planTitle, days, destinations: selected, interests: selectedInterests, travelStyle: style, budgetUsd: budget ? Number(budget) : null, email: email || null, consent }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't save this itinerary just now.");
      setStatus(result.message || "Your itinerary has been saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again shortly.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  function exportPlan() {
    if (!chosenPlaces.length) { setStatus("Choose at least one destination before exporting."); setIsError(true); return; }
    const text = [
      "ETHIOPIA UNFOLDED — PERSONAL ITINERARY NOTES",
      planTitle,
      `${days} days · ${style}`,
      `Destinations: ${chosenPlaces.map((place) => place.name).join(" → ")}`,
      `Interests: ${selectedInterests.join(", ") || "Not specified"}`,
      `Approximate budget you entered (USD): ${budget ? `$${Number(budget).toLocaleString()}` : "Not specified"}`,
      "",
      "Planning note: This is a personal planning draft, not a booking, live fare, verified route, travel-time estimate, or safety clearance.",
      "Confirm current government travel advice, regional access, transport, permissions, fees, and accommodation directly before traveling.",
      "",
      `Destination guides: ${chosenPlaces.map((place) => `${siteUrl}/destinations/${place.slug}`).join("\n")}`,
      `Official travel sources: ${siteUrl}/travel-intelligence`,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ethiopia-unfolded-itinerary-notes.txt";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Your planning notes have been exported. Verify every route and current advisory before travel.");
    setIsError(false);
  }

  const mapUrl = chosenPlaces[0] ? `https://www.openstreetmap.org/?mlat=${chosenPlaces[0].coordinates.lat}&mlon=${chosenPlaces[0].coordinates.lng}#map=6/${chosenPlaces[0].coordinates.lat}/${chosenPlaces[0].coordinates.lng}` : "https://www.openstreetmap.org/#map=5/9.145/39.24";

  return (
    <div>
      <div className="notice" style={{ marginBottom: 25 }}><span aria-hidden="true">ⓘ</span><span><strong>Planning draft, not a route recommendation.</strong> Current travel advisories, regional access, transport schedules, prices, and booking availability are not connected to this tool. Check official advice before selecting or traveling to any region.</span></div>
      <div className="route-layout">
        <form className="planner-panel" onSubmit={savePlan}>
          <p className="eyebrow eyebrow--dark">Your journey, your pace</p>
          <h2>Shape a first draft.</h2>
          <div className="field" style={{ marginBottom: 19 }}><label htmlFor="plan-name">Give your journey a name</label><input id="plan-name" value={planTitle} maxLength={180} required onChange={(event) => setPlanTitle(event.target.value)} /></div>
          <div className="field" style={{ marginBottom: 21 }}>
            <label htmlFor="trip-days">How long might you travel? <strong>{days} days</strong></label>
            <input className="field-range" id="trip-days" type="range" min={3} max={21} step={1} value={days} onChange={(event) => setDays(Number(event.target.value))} />
            <p className="field-hint">Your duration is a planning preference, not a claim about how long this route takes.</p>
          </div>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: "0 0 20px" }}>
            <legend className="field" style={{ display: "block", marginBottom: 9 }}><span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em" }}>Choose places to explore</span></legend>
            <div className="choice-chips" aria-label="Select destinations">
              {destinations.map((place) => <label className="choice-chip" key={place.slug}><input type="checkbox" checked={selected.includes(place.slug)} onChange={() => toggleDestination(place.slug)} /><span>{place.name}</span></label>)}
            </div>
            <p className="field-hint" style={{ marginTop: 8 }}>Map locations are approximate. Selecting a place does not confirm current access.</p>
          </fieldset>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: "0 0 20px" }}>
            <legend className="field" style={{ display: "block", marginBottom: 9 }}><span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em" }}>What draws you in?</span></legend>
            <div className="choice-chips" aria-label="Select trip interests">
              {interests.map((interest) => <label className="choice-chip" key={interest}><input type="checkbox" checked={selectedInterests.includes(interest)} onChange={() => toggleInterest(interest)} /><span>{interest.charAt(0).toUpperCase() + interest.slice(1)}</span></label>)}
            </div>
          </fieldset>
          <div className="field" style={{ marginBottom: 20 }}><label htmlFor="travel-style">Your travel style</label><select id="travel-style" value={style} onChange={(event) => setStyle(event.target.value)}>{travelStyles.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field" style={{ marginBottom: 20 }}><label htmlFor="trip-budget">Your approximate total budget in USD (optional)</label><input id="trip-budget" type="number" min={0} max={1000000} step={50} inputMode="numeric" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Set your own planning limit"/><p className="field-hint">We store your number only as a preference; no prices or estimates are generated.</p></div>
          <div className="field" style={{ marginBottom: 20 }}><label htmlFor="trip-email">Email for this saved draft (optional)</label><input id="trip-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com"/><p className="field-hint">No email will be sent. Avoid entering sensitive information.</p></div>
          <label className="consent-line" style={{ marginBottom: 18 }}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required/><span>I agree that this itinerary and the preferences above may be stored so I can keep a planning draft. I understand this is not a booking and no email will be sent.</span></label>
          <div className="route-result__actions"><button className="button button--gold" type="submit" disabled={saving || !consent}>{saving ? "Saving…" : "Save my draft ↗"}</button><button className="button button--ink-outline" type="button" onClick={exportPlan}>Export notes ↓</button></div>
          {status && <p className={`form-message ${isError ? "form-message--error" : ""}`} role="status">{status}</p>}
        </form>
        <div>
          <div className="route-map" role="region" aria-label="Interactive, schematic map of selected Ethiopian travel-planning destinations">
            <div className="route-map__top"><div><strong>A first sketch of Ethiopia</strong><small>Selected places · illustrative map</small></div><span style={{ color: "var(--gold-light)", fontSize: 10 }}>{selected.length} {selected.length === 1 ? "place" : "places"}</span></div>
            <svg className="route-map__svg" viewBox="0 0 450 450" role="img" aria-label="A stylized, not-to-scale map. Focusable place markers show approximate destination locations.">
              <path className="route-map__country" d={outline} />
              <path className="route-map__river" d="M89 123c34 10 50 3 65-13 11-12 26-10 40-2m45 2c-9 20-18 38-12 58 5 15 18 16 23 37m59-8c-14 20-17 40-8 59 5 11 14 19 13 32m-173 1c23-14 36-11 53-17 16-5 25-16 37-22" />
              {chosenPlaces.length > 1 && <polyline className="route-map__route" points={routePath} />}
              {destinations.map((place) => {
                const point = getPoint(place.coordinates.lat, place.coordinates.lng);
                const isSelected = selected.includes(place.slug);
                const labelOnLeft = point.x > 300;
                return (
                  <g className="route-map__pin" key={place.slug} role="button" tabIndex={0} aria-label={`${isSelected ? "Remove" : "Add"} ${place.name} from the draft route`} onClick={() => toggleDestination(place.slug)} onKeyDown={(event) => handlePinKey(event, place.slug)}>
                    <circle cx={point.x} cy={point.y} r={isSelected ? 7 : 4} className={`route-map__pin-dot ${isSelected && place.slug === chosenPlaces[0]?.slug ? "route-map__pin-dot--start" : ""}`} opacity={isSelected ? 1 : .48} />
                    <text x={point.x + (labelOnLeft ? -9 : 9)} y={point.y - 8} textAnchor={labelOnLeft ? "end" : "start"} className="route-map__label" opacity={isSelected ? .98 : .5}>{place.name}</text>
                  </g>
                );
              })}
            </svg>
            <div className="route-map__legend"><span>◦ Approximate planning markers</span><span>Sketch, not to scale · No access data</span></div>
          </div>
          <div className="route-result">
            <p className="eyebrow eyebrow--dark">Your current draft · {days} days</p>
            <div className="route-result__stops">
              {chosenPlaces.length ? chosenPlaces.map((place, index) => <span className="route-stop" key={place.slug}>{String(index + 1).padStart(2, "0")} · {place.name}</span>) : <span className="field-hint">Choose places on the left or tap the map.</span>}
            </div>
            <div className="route-result__actions">
              <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Open a location in OpenStreetMap</a>
              {chosenPlaces[0] && <Link className="text-link" href={`/destinations/${chosenPlaces[0].slug}`}>Read the destination guide</Link>}
            </div>
          </div>
          <div className="notice" style={{ marginTop: 22 }}><span aria-hidden="true">ⓘ</span><span>The route line is a visual sequence, not verified driving directions. There are <strong>no transportation fares or travel times</strong> in this planner; check every route, permit, price, and regional advisory directly before booking.</span></div>
        </div>
      </div>
      <div style={{ marginTop: 45 }}><p className="eyebrow eyebrow--dark">Need more inspiration?</p><div className="content-cards" style={{ marginTop: 18 }}>{experienceCategories.slice(0, 3).map((item) => <Link className="content-card" key={item.slug} href={`/experiences#${item.slug}`}><span className="content-card__label">Explore by experience</span><h3>{item.title}</h3><p>{item.description}</p><span className="content-card__foot">Browse places <span aria-hidden="true">↗</span></span></Link>)}</div></div>
    </div>
  );
}
