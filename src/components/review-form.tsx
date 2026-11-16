"use client";

import { useState, type FormEvent } from "react";

export default function ReviewForm({ providerId }: { providerId: string }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("");
    setError(false);
    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, reviewerName: data.get("reviewerName"), rating: Number(data.get("rating")), body: data.get("body"), consent: data.get("consent") === "on", website: data.get("website") }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We could not accept this review just now.");
      setStatus(result.message || "Your review has been submitted for moderation.");
      form.reset();
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "Please try again shortly.");
      setError(true);
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="reviewer-name">Your name or display name</label><input id="reviewer-name" name="reviewerName" required minLength={2} maxLength={120}/></div>
        <div className="field"><label htmlFor="review-rating">Your rating</label><select id="review-rating" name="rating" defaultValue="5" required><option value="5">5 — Excellent</option><option value="4">4 — Very good</option><option value="3">3 — Good</option><option value="2">2 — Disappointing</option><option value="1">1 — Poor</option></select></div>
        <div className="field field--full"><label htmlFor="review-body">Your experience</label><textarea id="review-body" name="body" required minLength={20} maxLength={3000} placeholder="Share a specific, respectful account. Do not include private or sensitive information."/></div>
        <div className="visually-hidden" aria-hidden="true"><label htmlFor="review-website">Leave this field empty</label><input id="review-website" name="website" tabIndex={-1} autoComplete="off"/></div>
        <div className="field field--full"><label className="consent-line"><input type="checkbox" name="consent" required/><span>I confirm this review is my own account and agree it may be reviewed and moderated before publication.</span></label></div>
        <div className="field field--full"><button className="button button--gold" type="submit" disabled={loading}>{loading ? "Submitting…" : "Submit for review ↗"}</button><p className={`form-message ${error ? "form-message--error" : ""}`} role="status">{status}</p><p className="field-hint">Reviews are not published automatically. This site cannot verify that a reviewer made a booking; no “verified stay” badge is used.</p></div>
      </div>
    </form>
  );
}
