import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const destinations = pgTable(
  "destinations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    region: varchar("region", { length: 160 }).notNull(),
    tagline: varchar("tagline", { length: 240 }).notNull(),
    summary: text("summary").notNull(),
    content: jsonb("content").$type<Record<string, unknown>>().notNull().default({}),
    coverImage: text("cover_image"),
    coverImageAlt: text("cover_image_alt"),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    seoTitle: varchar("seo_title", { length: 180 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ statusIndex: index("destinations_status_idx").on(table.status) }),
);

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    title: varchar("title", { length: 220 }).notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull().default(""),
    category: varchar("category", { length: 80 }).notNull().default("Travel guide"),
    coverImage: text("cover_image"),
    coverImageAlt: text("cover_image_alt"),
    author: varchar("author", { length: 160 }).notNull().default("Ethiopia Unfolded Editorial Desk"),
    sourceLinks: jsonb("source_links").$type<Array<{ label: string; url: string }>>().notNull().default([]),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    seoTitle: varchar("seo_title", { length: 180 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ statusIndex: index("articles_status_idx").on(table.status) }),
);

export const providers = pgTable(
  "providers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    name: varchar("name", { length: 180 }).notNull(),
    type: varchar("type", { length: 60 }).notNull(),
    location: varchar("location", { length: 180 }).notNull(),
    description: text("description").notNull(),
    contactEmail: varchar("contact_email", { length: 254 }).notNull(),
    website: text("website"),
    gallery: jsonb("gallery").$type<Array<{ url: string; alt: string; credit?: string }>>().notNull().default([]),
    status: varchar("status", { length: 24 }).notNull().default("pending_review"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ statusIndex: index("providers_status_idx").on(table.status) }),
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 180 }).notNull(),
    kind: varchar("kind", { length: 60 }).notNull().default("general"),
    destinationSlug: varchar("destination_slug", { length: 100 }),
    providerId: uuid("provider_id").references(() => providers.id, { onDelete: "set null" }),
    message: text("message").notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
    status: varchar("status", { length: 24 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ statusIndex: index("inquiries_status_idx").on(table.status) }),
);

export const itineraries = pgTable(
  "itineraries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 180 }).notNull(),
    contactEmail: varchar("contact_email", { length: 254 }),
    days: integer("days").notNull(),
    destinations: jsonb("destinations").$type<string[]>().notNull().default([]),
    interests: jsonb("interests").$type<string[]>().notNull().default([]),
    travelStyle: varchar("travel_style", { length: 60 }).notNull(),
    budgetUsd: integer("budget_usd"),
    routeNotes: text("route_notes").notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ createdIndex: index("itineraries_created_at_idx").on(table.createdAt) }),
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 254 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("active"),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ emailIndex: uniqueIndex("newsletter_email_unique").on(table.email) }),
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
    reviewerName: varchar("reviewer_name", { length: 120 }).notNull(),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
    status: varchar("status", { length: 24 }).notNull().default("pending_review"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ providerIndex: index("reviews_provider_idx").on(table.providerId) }),
);

export const travelUpdates = pgTable(
  "travel_updates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    region: varchar("region", { length: 160 }).notNull().default("Ethiopia"),
    category: varchar("category", { length: 80 }).notNull(),
    sourceName: varchar("source_name", { length: 180 }).notNull(),
    sourceUrl: text("source_url").notNull(),
    sourcePublishedAt: timestamp("source_published_at", { withTimezone: true }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    notes: text("notes").notNull().default(""),
    status: varchar("status", { length: 24 }).notNull().default("review"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({ statusIndex: index("travel_updates_status_idx").on(table.status) }),
);

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  creator: varchar("creator", { length: 180 }),
  creditUrl: text("credit_url"),
  rightsNote: text("rights_note"),
  status: varchar("status", { length: 24 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
