"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type Source = { label: string; url: string };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

const starters = [
  "I have a week and love history. Where should I start?",
  "How can I plan a respectful cultural visit?",
  "What should I verify before booking a route?",
];

export default function ConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome. I can help you explore destinations, compare the kind of experiences you're looking for, and turn your preferences into a starting itinerary. Share your trip length, interests, pace, and approximate budget if you'd like a more personal plan.\n\nI am not a source of live safety advice, bookings, hotel availability, prices, or current transport information. I will point you to official sources and say when something needs checking." },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(event?: FormEvent<HTMLFormElement>, prompt?: string) {
    event?.preventDefault();
    const text = (prompt ?? question).trim();
    if (!text || loading) return;
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    setMessages((previous) => [...previous, { role: "user", content: text }]);
    setQuestion("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const result = await response.json() as { answer?: string; sources?: Source[]; error?: string };
      if (!response.ok || !result.answer) throw new Error(result.error || "I couldn't prepare a reply. Please try again.");
      setMessages((previous) => [...previous, { role: "assistant", content: result.answer!, sources: result.sources }]);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="concierge-window" aria-label="Ethiopia travel concierge chat">
      <header className="concierge-window__top">
        <div className="concierge-window__brand"><span className="concierge-window__orb" aria-hidden="true">EU</span><span><strong>Your Ethiopia concierge</strong><small>Editorial planning support · sources included</small></span></div>
        <span className="source-status">Not live safety advice</span>
      </header>
      <div className="concierge-transcript" aria-live="polite" aria-relevant="additions text">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role === "user" ? "chat-message--user" : "chat-message--assistant"}`} key={`${message.role}-${index}`}>
            {message.content}
            {!!message.sources?.length && <div className="source-box" style={{ marginTop: 12 }}>{message.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>}
          </div>
        ))}
        {loading && <div className="chat-message chat-message--assistant">Thinking through the sources…</div>}
        {error && <p className="form-message form-message--error" role="alert">{error}</p>}
        <div ref={bottomRef} />
      </div>
      {messages.length <= 1 && <div className="concierge-suggestions">{starters.map((starter) => <button key={starter} type="button" onClick={() => void send(undefined, starter)}>{starter}</button>)}</div>}
      <p className="chat-disclaimer">No prices, bookings, current access, or hotel availability are inferred. Travel advisories change: <Link href="/travel-intelligence" style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>check official sources before planning</Link>. Do not enter sensitive personal information.</p>
      <form className="concierge-composer" onSubmit={(event) => void send(event)}>
        <label className="visually-hidden" htmlFor="concierge-message">Ask your travel question</label>
        <textarea id="concierge-message" value={question} maxLength={1200} required placeholder="Tell me how you like to travel…" onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} />
        <button className="button button--gold" type="submit" disabled={loading || !question.trim()}>{loading ? "Wait…" : "Ask ↗"}</button>
      </form>
    </section>
  );
}
