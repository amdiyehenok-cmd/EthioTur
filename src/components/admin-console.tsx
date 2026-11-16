"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type DestinationRecord = { id: string; slug: string; name: string; region: string; tagline: string; summary: string; content: Record<string, unknown>; status: string; seoTitle: string | null; seoDescription: string | null; scheduledAt: string | null };
type ArticleRecord = { id: string; slug: string; title: string; excerpt: string; body: string; category: string; author: string; sourceLinks: Array<{ label: string; url: string }>; status: string; seoTitle: string | null; seoDescription: string | null; scheduledAt: string | null };
type QueueItem = { id: string; name?: string; title?: string; email?: string; contactEmail?: string; type?: string; location?: string; category?: string; sourceName?: string; region?: string; status: string; createdAt?: string | null; consentedAt?: string | null; sourcePublishedAt?: string | null; verifiedAt?: string | null; message?: string; body?: string; description?: string; url?: string; sourceUrl?: string; altText?: string };
type AdminData = { destinations: DestinationRecord[]; articles: ArticleRecord[]; providers: QueueItem[]; inquiries: QueueItem[]; reviews: QueueItem[]; travelUpdates: QueueItem[]; mediaAssets: QueueItem[]; newsletterSubscribers: QueueItem[] };
type Editor = { type: "destination" | "article"; slug: string; title: string; region: string; tagline: string; summary: string; body: string; category: string; author: string; seoTitle: string; seoDescription: string; contentJson: string; sourcesJson: string; status: string; scheduledAt: string };
type QueueKind = "inquiry" | "provider" | "review" | "travel_update" | "media_asset" | "newsletter";

const emptyData: AdminData = { destinations: [], articles: [], providers: [], inquiries: [], reviews: [], travelUpdates: [], mediaAssets: [], newsletterSubscribers: [] };
const initialEditor: Editor = { type: "destination", slug: "", title: "", region: "", tagline: "", summary: "", body: "", category: "Travel story", author: "Ethiopia Unfolded Editorial Desk", seoTitle: "", seoDescription: "", contentJson: "{}", sourcesJson: "[]", status: "draft", scheduledAt: "" };

function displayDate(date: string | null | undefined) {
  if (!date) return "Date not recorded";
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "Date not recorded" : value.toLocaleString();
}

function AdminQueue({ title, kind, items, statuses, updateStatus }: { title: string; kind: QueueKind; items: QueueItem[]; statuses: string[]; updateStatus: (kind: QueueKind, id: string, status: string) => Promise<void> }) {
  return (
    <section className="admin-panel">
      <h2>{title} <span className="field-hint">({items.length})</span></h2>
      <div className="admin-list">
        {items.length ? items.map((item) => {
          const headline = item.name || item.title || item.email || "Record";
          const detail = item.message || item.body || item.description || item.sourceName || item.location || item.category || "";
          const linkUrl = item.url || item.sourceUrl;
          const sourceDates = kind === "travel_update" ? `Source publication: ${displayDate(item.sourcePublishedAt)} · Editorial verification: ${displayDate(item.verifiedAt)}` : "";
          return <div className="admin-row" key={item.id}><div style={{ minWidth: 0 }}><span className="admin-row__title">{headline}</span><span className="admin-row__meta">{item.email || item.contactEmail || item.type || item.region || ""} · {displayDate(item.createdAt)}</span>{detail && <span className="admin-row__meta" style={{ whiteSpace: "pre-wrap" }}>{detail.slice(0, 280)}</span>}{sourceDates && <span className="admin-row__meta">{sourceDates}</span>}{linkUrl && <a className="admin-row__meta" href={linkUrl} target="_blank" rel="noreferrer">Open source or asset ↗</a>}</div><label className="visually-hidden" htmlFor={`${kind}-${item.id}`}>Change status for {headline}</label><select id={`${kind}-${item.id}`} value={item.status} onChange={(event) => void updateStatus(kind, item.id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div>;
        }) : <p className="admin-hint">No records yet. New submissions will appear here.</p>}
      </div>
    </section>
  );
}

export default function AdminConsole() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData>(emptyData);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState<Editor>(initialEditor);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      if (response.status === 401) { setAuthenticated(false); setData(emptyData); return; }
      const result = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(result.error || "The dashboard could not load.");
      setData(result);
      setAuthenticated(true);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Dashboard unavailable.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Sign-in failed.");
      setToken("");
      setNotice(result.message || "Signed in.");
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed.");
    } finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setData(emptyData);
    setNotice("You have signed out.");
  }

  async function updateStatus(kind: QueueKind, id: string, status: string) {
    setError("");
    try {
      const response = await fetch("/api/admin/moderation", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id, status }) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Status update failed.");
      setNotice(result.message || "Record updated.");
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Status update failed."); }
  }

  async function seedEditorialContent() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Editorial seed failed.");
      setNotice(result.message || "Editorial content seeded.");
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Editorial seed failed."); }
    finally { setSaving(false); }
  }

  function editDestination(item: DestinationRecord) {
    setEditor({ type: "destination", slug: item.slug, title: item.name, region: item.region, tagline: item.tagline, summary: item.summary, body: "", category: "Travel guide", author: "Ethiopia Unfolded Editorial Desk", seoTitle: item.seoTitle || "", seoDescription: item.seoDescription || "", contentJson: JSON.stringify(item.content || {}, null, 2), sourcesJson: "[]", status: item.status, scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toISOString().slice(0, 16) : "" });
    setNotice(`Editing ${item.name}.`);
    document.getElementById("admin-content-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function editArticle(item: ArticleRecord) {
    setEditor({ type: "article", slug: item.slug, title: item.title, region: "", tagline: "", summary: item.excerpt, body: item.body, category: item.category, author: item.author, seoTitle: item.seoTitle || "", seoDescription: item.seoDescription || "", contentJson: "{}", sourcesJson: JSON.stringify(item.sourceLinks || [], null, 2), status: item.status, scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toISOString().slice(0, 16) : "" });
    setNotice(`Editing ${item.title}.`);
    document.getElementById("admin-content-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const common = { type: editor.type, slug: editor.slug, status: editor.status, seoTitle: editor.seoTitle, seoDescription: editor.seoDescription, scheduledAt: editor.scheduledAt || undefined };
    let payload: Record<string, unknown>;
    try {
      if (editor.type === "destination") payload = { ...common, name: editor.title, region: editor.region, tagline: editor.tagline, summary: editor.summary, content: JSON.parse(editor.contentJson) as unknown };
      else payload = { ...common, title: editor.title, excerpt: editor.summary, body: editor.body, category: editor.category, author: editor.author, sourceLinks: JSON.parse(editor.sourcesJson) as unknown };
    } catch { setError("The structured JSON or source-link JSON is not valid. Correct it before saving."); return; }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Content could not be saved.");
      setNotice(result.message || "Content saved.");
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Content could not be saved."); }
    finally { setSaving(false); }
  }

  async function createProvider(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/providers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Provider record could not be saved.");
      setNotice(result.message || "Provider saved for review.");
      form.reset();
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Provider record could not be saved."); }
    finally { setSaving(false); }
  }

  async function createAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Media metadata could not be saved.");
      setNotice(result.message || "Media metadata saved.");
      form.reset();
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Media metadata could not be saved."); }
    finally { setSaving(false); }
  }

  async function createTravelUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/travel-updates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Source record could not be saved.");
      setNotice(result.message || "Source record saved for review.");
      form.reset();
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Source record could not be saved."); }
    finally { setSaving(false); }
  }

  function setEditorField<K extends keyof Editor>(field: K, value: Editor[K]) { setEditor((previous) => ({ ...previous, [field]: value })); }

  if (!authenticated) {
    return <div className="admin-lock">
      <p className="eyebrow eyebrow--dark">Protected editorial area</p><h1>Administrator sign-in</h1>
      <p className="admin-hint">The server validates a private token and sets a signed, HTTP-only session cookie. Credentials are never stored in local storage or shown in the page URL.</p>
      <form onSubmit={login} style={{ display: "grid", gap: 14, marginTop: 22 }}><div className="field"><label htmlFor="admin-token">Administrator token</label><input id="admin-token" type="password" autoComplete="current-password" minLength={32} required value={token} onChange={(event) => setToken(event.target.value)} /></div><button className="button button--gold" type="submit" disabled={saving || loading}>{loading || saving ? "Checking…" : "Sign in securely ↗"}</button></form>
      <p className="admin-hint" style={{ marginTop: 18 }}>Before launch, configure the server-only <code>ADMIN_API_TOKEN</code> with at least 32 unpredictable characters and an <code>ADMIN_SESSION_SECRET</code>. Never add either to a public or NEXT_PUBLIC environment variable.</p>
      {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="form-message" role="status">{notice}</p>}
    </div>;
  }

  const updateContent = async (type: "destination" | "article", item: DestinationRecord | ArticleRecord, status: string) => {
    const isDestination = type === "destination";
    const common = { type, slug: item.slug, status, seoTitle: item.seoTitle || "", seoDescription: item.seoDescription || "", scheduledAt: status === "scheduled" ? item.scheduledAt : undefined };
    const payload = isDestination ? { ...common, name: (item as DestinationRecord).name, region: (item as DestinationRecord).region, tagline: (item as DestinationRecord).tagline, summary: (item as DestinationRecord).summary, content: (item as DestinationRecord).content } : { ...common, title: (item as ArticleRecord).title, excerpt: (item as ArticleRecord).excerpt, body: (item as ArticleRecord).body, category: (item as ArticleRecord).category, author: (item as ArticleRecord).author, sourceLinks: (item as ArticleRecord).sourceLinks };
    try {
      const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Content status could not be updated.");
      setNotice(result.message || "Content status updated.");
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Content status could not be updated."); }
  };

  return (
    <div className="admin-dashboard">
      <div className="notice"><span aria-hidden="true">ⓘ</span><span><strong>Publisher responsibility.</strong> Draft, review and scheduled status do not automatically publish. No cron scheduler, analytics, email sender, file storage or payment provider is configured. Only publish reviewed copy with real source links and licensed images.</span></div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}><p className="admin-hint">Authenticated session · expires after 12 hours · records capped at latest 100 per queue</p><button className="button button--ink-outline" onClick={() => void logout()} type="button">Sign out</button></div>
      {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="form-message" role="status">{notice}</p>}

      <div className="admin-panel"><p className="eyebrow eyebrow--dark">Start the content workspace</p><h2>Seed the editorial starter guides.</h2><p className="admin-hint">One-time idempotent seed: copies the ten existing destination guides and three editorial stories into PostgreSQL as published CMS records. Existing slugs are never overwritten. Only run after reviewing the content.</p><button className="button button--gold" onClick={() => void seedEditorialContent()} disabled={saving} type="button">Seed starter destinations & stories ↗</button></div>

      <div className="admin-grid">
        <section className="admin-panel" id="admin-content-editor"><p className="eyebrow eyebrow--dark">Editorial CMS</p><h2>Create or edit content.</h2><form onSubmit={saveContent}>
          <div className="form-grid">
            <div className="field"><label htmlFor="editor-type">Content type</label><select id="editor-type" value={editor.type} onChange={(event) => setEditorField("type", event.target.value as Editor["type"])}><option value="destination">Destination</option><option value="article">Article or travel story</option></select></div>
            <div className="field"><label htmlFor="editor-status">Publication status</label><select id="editor-status" value={editor.status} onChange={(event) => setEditorField("status", event.target.value)}><option value="draft">Draft</option><option value="review">Review</option><option value="scheduled">Scheduled (manual publishing required)</option><option value="published">Published</option></select></div>
            <div className="field"><label htmlFor="editor-slug">Clean URL slug</label><input id="editor-slug" required minLength={2} maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={editor.slug} onChange={(event) => setEditorField("slug", event.target.value)}/></div>
            <div className="field"><label htmlFor="editor-title">{editor.type === "destination" ? "Destination name" : "Article title"}</label><input id="editor-title" required maxLength={220} value={editor.title} onChange={(event) => setEditorField("title", event.target.value)}/></div>
            {editor.type === "destination" ? <>
              <div className="field"><label htmlFor="editor-region">Region</label><input id="editor-region" required maxLength={160} value={editor.region} onChange={(event) => setEditorField("region", event.target.value)}/></div>
              <div className="field"><label htmlFor="editor-tagline">Tagline</label><input id="editor-tagline" required maxLength={240} value={editor.tagline} onChange={(event) => setEditorField("tagline", event.target.value)}/></div>
              <div className="field field--full"><label htmlFor="editor-summary">Destination summary</label><textarea id="editor-summary" required minLength={25} maxLength={5000} value={editor.summary} onChange={(event) => setEditorField("summary", event.target.value)}/></div>
              <div className="field field--full"><label htmlFor="editor-json">Destination detail JSON</label><textarea id="editor-json" rows={12} spellCheck={false} value={editor.contentJson} onChange={(event) => setEditorField("contentJson", event.target.value)}/><p className="field-hint">For a new destination, include story, experience, coordinates, highlights, significance, bestTime, gettingThere, costs, accommodation, nearby, considerations, sourceLinks and faqs. Images require a credited Pexels URL.</p></div>
            </> : <>
              <div className="field"><label htmlFor="editor-category">Category</label><input id="editor-category" required maxLength={80} value={editor.category} onChange={(event) => setEditorField("category", event.target.value)}/></div>
              <div className="field"><label htmlFor="editor-author">Byline / editorial desk</label><input id="editor-author" required maxLength={160} value={editor.author} onChange={(event) => setEditorField("author", event.target.value)}/></div>
              <div className="field field--full"><label htmlFor="editor-summary">Excerpt / description</label><textarea id="editor-summary" required minLength={20} maxLength={5000} value={editor.summary} onChange={(event) => setEditorField("summary", event.target.value)}/></div>
              <div className="field field--full"><label htmlFor="editor-body">Article body</label><textarea id="editor-body" required minLength={30} maxLength={15000} rows={11} value={editor.body} onChange={(event) => setEditorField("body", event.target.value)}/></div>
              <div className="field field--full"><label htmlFor="editor-sources">Source links JSON</label><textarea id="editor-sources" rows={5} spellCheck={false} value={editor.sourcesJson} onChange={(event) => setEditorField("sourcesJson", event.target.value)}/><p className="field-hint">Use a JSON array of labeled HTTPS links. Do not invent authorship, publication dates, citations or claims.</p></div>
            </>}
            <div className="field"><label htmlFor="editor-seo-title">SEO title</label><input id="editor-seo-title" maxLength={180} value={editor.seoTitle} onChange={(event) => setEditorField("seoTitle", event.target.value)}/></div>
            <div className="field"><label htmlFor="editor-seo-description">SEO description</label><textarea id="editor-seo-description" maxLength={320} value={editor.seoDescription} onChange={(event) => setEditorField("seoDescription", event.target.value)}/></div>
            {editor.status === "scheduled" && <div className="field field--full"><label htmlFor="editor-scheduled">Scheduled publication time (local)</label><input id="editor-scheduled" type="datetime-local" value={editor.scheduledAt} onChange={(event) => setEditorField("scheduledAt", event.target.value)}/></div>}
            <div className="field field--full"><button className="button button--gold" type="submit" disabled={saving}>{saving ? "Saving…" : "Save content ↗"}</button></div>
          </div>
        </form></section>
        <section className="admin-panel"><p className="eyebrow eyebrow--dark">CMS records</p><h2>Destinations & stories.</h2><div className="admin-list">
          {data.destinations.map((item) => <div className="admin-row" key={`destination-${item.id}`}><div><span className="admin-row__title">{item.name}</span><span className="admin-row__meta">/destinations/{item.slug} · {item.region} · {item.status}</span></div><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "end", gap: 6 }}><label className="visually-hidden" htmlFor={`destination-status-${item.id}`}>Change status for {item.name}</label><select id={`destination-status-${item.id}`} value={item.status} onChange={(event) => void updateContent("destination", item, event.target.value)}><option value="draft">Draft</option><option value="review">Review</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select><button className="button button--ink-outline" type="button" onClick={() => editDestination(item)}>Edit</button></div></div>)}
          {data.articles.map((item) => <div className="admin-row" key={`article-${item.id}`}><div><span className="admin-row__title">{item.title}</span><span className="admin-row__meta">/travel-stories/{item.slug} · {item.category} · {item.status}</span></div><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "end", gap: 6 }}><label className="visually-hidden" htmlFor={`article-status-${item.id}`}>Change status for {item.title}</label><select id={`article-status-${item.id}`} value={item.status} onChange={(event) => void updateContent("article", item, event.target.value)}><option value="draft">Draft</option><option value="review">Review</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select><button className="button button--ink-outline" type="button" onClick={() => editArticle(item)}>Edit</button></div></div>)}
          {!data.destinations.length && !data.articles.length && <p className="admin-hint">No saved content yet. Use the explicit seed action above to copy editorial starters.</p>}
        </div></section>
      </div>

      <div className="admin-grid">
        <AdminQueue title="Local provider approval" kind="provider" items={data.providers} statuses={["pending_review", "approved", "rejected"]} updateStatus={updateStatus}/>
        <AdminQueue title="Booking and contact inquiries" kind="inquiry" items={data.inquiries} statuses={["new", "in_progress", "responded", "closed"]} updateStatus={updateStatus}/>
        <AdminQueue title="Reviews · moderation required" kind="review" items={data.reviews} statuses={["pending_review", "approved", "rejected"]} updateStatus={updateStatus}/>
        <AdminQueue title="Travel-source records · not a live feed" kind="travel_update" items={data.travelUpdates} statuses={["draft", "review", "verified", "published", "archived"]} updateStatus={updateStatus}/>
        <AdminQueue title="Credited image-source metadata" kind="media_asset" items={data.mediaAssets} statuses={["draft", "review", "approved", "archived"]} updateStatus={updateStatus}/>
        <AdminQueue title="Newsletter interest · no emails sent" kind="newsletter" items={data.newsletterSubscribers.map((item) => ({ ...item, name: item.email, title: item.email, status: item.status, id: item.id, createdAt: item.consentedAt }))} statuses={["active", "unsubscribed"]} updateStatus={updateStatus}/>
      </div>
      <div className="admin-grid">
        <section className="admin-panel"><p className="eyebrow eyebrow--dark">Provider management</p><h2>Create a provider record.</h2><p className="admin-hint">Provider applications are not listings. Save the details only after independent business and consent review; a new record remains pending until explicitly approved.</p><form onSubmit={createProvider}><div className="form-grid"><div className="field"><label htmlFor="provider-name">Provider name</label><input id="provider-name" name="name" required minLength={2} maxLength={180}/></div><div className="field"><label htmlFor="provider-slug">Profile slug</label><input id="provider-slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={140}/></div><div className="field"><label htmlFor="provider-type">Category</label><select id="provider-type" name="type"><option>Local guide</option><option>Tour operator</option><option>Accommodation</option><option>Driver</option><option>Cultural host</option><option>Activity</option><option>Restaurant</option></select></div><div className="field"><label htmlFor="provider-location">Location</label><input id="provider-location" name="location" required maxLength={180}/></div><div className="field"><label htmlFor="provider-email">Provider email</label><input id="provider-email" name="contactEmail" type="email" required maxLength={254}/></div><div className="field"><label htmlFor="provider-website">Website (optional)</label><input id="provider-website" name="website" type="url" placeholder="https://" maxLength={1000}/></div><div className="field field--full"><label htmlFor="provider-description">Provider-submitted description</label><textarea id="provider-description" name="description" required minLength={30} maxLength={3000}/></div><div className="field field--full"><button className="button button--gold" type="submit" disabled={saving}>Save provider for review ↗</button></div></div></form></section>
        <section className="admin-panel"><p className="eyebrow eyebrow--dark">Media metadata · no file upload</p><h2>Register a licensed image source.</h2><p className="admin-hint">Object-storage and image upload are not configured. This form stores Pexels image URLs, descriptive alt text, creator credit and a rights note; it does not copy files or grant usage rights.</p><form onSubmit={createAsset}><div className="form-grid"><div className="field field--full"><label htmlFor="asset-url">Pexels image URL</label><input id="asset-url" name="url" type="url" required placeholder="https://images.pexels.com/photos/..."/></div><div className="field field--full"><label htmlFor="asset-alt">Descriptive alt text</label><input id="asset-alt" name="altText" required minLength={8} maxLength={350}/></div><div className="field"><label htmlFor="asset-creator">Creator name</label><input id="asset-creator" name="creator" required maxLength={180}/></div><div className="field"><label htmlFor="asset-credit">Contributor page</label><input id="asset-credit" name="creditUrl" type="url" required placeholder="https://www.pexels.com/@..."/></div><div className="field field--full"><label htmlFor="asset-rights">Rights / source note</label><textarea id="asset-rights" name="rightsNote" required minLength={4} maxLength={500} placeholder="Confirm license and any attribution requirements before publishing."/></div><div className="field field--full"><button className="button button--gold" type="submit" disabled={saving}>Save image metadata as draft</button></div></div></form></section>
      </div>

      <section className="admin-panel"><p className="eyebrow eyebrow--dark">Source records · never an automatic advisory</p><h2>Add a dated source for review.</h2><p className="admin-hint">This creates an editorial review record only. The public travel center shows the official source directly and never publishes these notes as live safety advice.</p><form onSubmit={createTravelUpdate}><div className="form-grid"><div className="field"><label htmlFor="source-title">Record title</label><input id="source-title" name="title" required maxLength={220}/></div><div className="field"><label htmlFor="source-category">Source category</label><input id="source-category" name="category" required maxLength={80} placeholder="Travel advice, entry, health…"/></div><div className="field"><label htmlFor="source-region">Region or scope</label><input id="source-region" name="region" defaultValue="Ethiopia" maxLength={160}/></div><div className="field"><label htmlFor="source-name">Issuing source</label><input id="source-name" name="sourceName" required maxLength={180}/></div><div className="field"><label htmlFor="source-url">Official HTTPS source link</label><input id="source-url" name="sourceUrl" type="url" required placeholder="https://…"/></div><div className="field"><label htmlFor="source-date">Source publication / update date</label><input id="source-date" name="sourcePublishedAt" type="date"/></div><div className="field"><label htmlFor="source-verified">Editorial verification date (if reviewed)</label><input id="source-verified" name="verifiedAt" type="date"/></div><div className="field field--full"><label htmlFor="source-notes">Review notes and uncertainty</label><textarea id="source-notes" name="notes" required minLength={15} maxLength={3000}/></div><div className="field field--full"><button className="button button--gold" type="submit" disabled={saving}>Save as editorial review record ↗</button></div></div></form></section>
    </div>
  );
}
