# ETHIOPIA UNFOLDED

An editorial Ethiopia travel-discovery and planning platform built on the existing Next.js App Router, React, TypeScript, PostgreSQL, and Drizzle ORM stack.

## What is implemented

- Responsive editorial homepage with real, credited Pexels photography.
- Ten source-linked, server-rendered destination guides and reusable destination templates.
- Travel guides, editorial stories, culture companion, experiences, OpenStreetMap embeds, and travel-source directory.
- Interactive itinerary draft builder with selectable destinations, interests, duration, style, a clearly labeled schematic map, consented PostgreSQL saving, and a text export.
- Source-grounded concierge with a deterministic, privacy-conscious fallback; optional server-side OpenAI Chat Completions integration.
- Consent-aware inquiries and newsletter interest, pending-review provider listings and moderated reviews.
- Signed admin sessions, content editor, publication states, moderation queues, source-review records, media-credit metadata, and an explicit idempotent editorial seed action.
- Page metadata, canonicals, Open Graph tags, structured data, `robots.txt`, and a database-aware XML sitemap.

## Local setup

1. Provide `DATABASE_URL` for a PostgreSQL database (the starter reads it in `src/db/index.ts`).
2. Install the existing project's dependencies with `npm install`.
3. Apply the Drizzle schema with `npx drizzle-kit push`.
4. Start local development with `npm run dev`.
5. Visit `/admin` only after configuring the admin credentials below. Sign in and use **Seed starter destinations & stories** to copy the editorial starter content to PostgreSQL. Seeding does not overwrite existing slugs.

## Server-only environment variables

- `DATABASE_URL` — PostgreSQL connection string. Never expose it to browser code.
- `NEXT_PUBLIC_SITE_URL` — the canonical public origin for metadata, sitemap, and structured data. Set it to the real HTTPS production domain; the code's brand-domain fallback is only a placeholder until the domain is confirmed.
- `ADMIN_API_TOKEN` — required for admin sign-in; configure at least 32 random characters. Keep it in the deployment's server-side secret store. Never prefix it with `NEXT_PUBLIC_` or commit it to source control.
- `ADMIN_SESSION_SECRET` — recommended independent random secret of at least 32 characters for signing admin cookies. If absent, the server uses `ADMIN_API_TOKEN` for signing.
- `OPENAI_API_KEY` — optional. When present, the concierge sends the visitor's question and up to eight recent chat messages to the OpenAI Chat Completions API from the backend. No key is sent to the browser.
- `OPENAI_MODEL` — optional model identifier. Defaults to `gpt-4o-mini` when the key is configured.

Without `OPENAI_API_KEY`, the concierge uses a deterministic reply system linked to curated editorial and official sources. It has no live web search or external travel-data access.

## Editorial and travel-information limits

- Government advice, access, health, visa/entry rules, prices, accommodation, and transport can change. The site does not monitor live advisory, weather, route, inventory, or booking feeds. Readers are directed to the source publisher and must follow their own government's current guidance.
- Source publication dates are shown by source owners. Ethiopia Unfolded has not recorded an independent source-review date for the initial content.
- Destination pages make no unverified fare, room-availability, rating, review, or booking claims. Planner budgets are entered by the traveler; the tool does not calculate live prices.
- Marketplace listings remain absent until an administrator creates and approves an actual provider. The platform accepts inquiry requests, not payments or confirmed reservations.
- Scheduled content stores its intended date, but a cron job or publishing worker is **not** connected; a site operator must publish scheduled content manually.
- Image records store credited Pexels source metadata. No object-storage, photograph upload, or rights-management service is configured. Verify image licensing and permissions before publication.
- Newsletter email addresses are stored with consent for future interest; no email-sending integration is connected. Contact inquiries, itinerary drafts, newsletter entries, and review submissions require explicit consent and are persisted in PostgreSQL.
- `/privacy` describes current collection and explains that retention, operator identity, and jurisdiction-specific legal disclosures must be completed by the site owner before commercial launch.
- Add rate limiting at the hosting edge, a formal content-retention policy, operational monitoring, analytics only with appropriate consent, and external security review before launch.

## Image provenance

Destination-specific images use identified Pexels contributor pages and descriptive alternative text. Images are used only for locations or Ethiopian contexts named in their source descriptions. Images load from `images.pexels.com`; map frames load from OpenStreetMap. These external services' own terms and privacy notices apply.

## Validation

The application uses Next.js App Router and Drizzle ORM. Run the project's configured Next.js/TypeScript validation plus a production build. `/api/health` checks the PostgreSQL connection. Schema changes must be applied with Drizzle before validating routes that depend on the new tables.
