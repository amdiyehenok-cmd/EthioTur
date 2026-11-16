"use client";

import { useState, type FormEvent } from "react";

export default function InquiryForm({ destinationSlug, providerId, defaultKind = "general" }: { destinationSlug?: string; providerId?: string; defaultKind?: string }) {
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);
    setIsLoading(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          kind: data.get("kind"),
          destinationSlug: data.get("destinationSlug"),
          providerId: data.get("providerId"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We could not save this inquiry just now.");
      setStatus(result.message || "Your inquiry has been received for review.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again shortly.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="inquiry-name">Your name</label><input id="inquiry-name" name="name" autoComplete="name" required minLength={2} maxLength={160} /></div>
        <div className="field"><label htmlFor="inquiry-email">Email address</label><input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
        <div className="field"><label htmlFor="inquiry-phone">Phone (optional)</label><input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={50} /></div>
        <div className="field"><label htmlFor="inquiry-kind">What would you like to ask about?</label><select id="inquiry-kind" name="kind" defaultValue={defaultKind}><option value="general">General question</option><option value="provider">A local experience or provider</option><option value="trip-planning">Trip planning</option><option value="editorial">Editorial or partnership</option><option value="privacy">Privacy request</option></select></div>
        <input type="hidden" name="destinationSlug" value={destinationSlug || ""} />
        <input type="hidden" name="providerId" value={providerId || ""} />
        <div className="field field--full"><label htmlFor="inquiry-subject">Subject</label><input id="inquiry-subject" name="subject" required minLength={3} maxLength={180} placeholder="How can we help?" /></div>
        <div className="field field--full"><label htmlFor="inquiry-message">Your message</label><textarea id="inquiry-message" name="message" required minLength={10} maxLength={5000} placeholder="Tell us a little about your question or trip idea." /></div>
        <div className="visually-hidden" aria-hidden="true"><label htmlFor="inquiry-website">Leave this field empty</label><input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="field field--full"><label className="consent-line"><input type="checkbox" name="consent" required /><span>I agree that my details may be stored so the team can respond to this inquiry. This form is not a booking or emergency service.</span></label></div>
        <div className="field field--full"><button className="button button--gold" type="submit" disabled={isLoading}>{isLoading ? "Sending…" : "Send your inquiry ↗"}</button><p className={`form-message ${isError ? "form-message--error" : ""}`} role="status">{status}</p></div>
      </div>
    </form>
  );
}
