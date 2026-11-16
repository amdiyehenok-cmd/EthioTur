"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We could not save your request just now.");
      setStatus(result.message || "Your interest has been saved.");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again shortly.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form className="newsletter-form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" type="email" autoComplete="email" required maxLength={254} placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" disabled={isLoading || !consent}>{isLoading ? "Saving…" : "Stay curious ↗"}</button>
      </form>
      <label className="consent-line" style={{ color: "rgba(244,241,233,.68)", marginTop: 14 }}>
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>Store my email as interest in the future editorial newsletter. Email delivery is not enabled yet.</span>
      </label>
      <p className={`form-message ${isError ? "form-message--error" : ""}`} aria-live="polite">{status}</p>
      <p className="form-privacy">No email will be sent until a mailing provider is connected and explicitly configured. Review our <Link href="/privacy" style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>privacy note</Link>.</p>
    </div>
  );
}
