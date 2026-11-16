import type { MetadataRoute } from "next";
import { guides, stories } from "@/lib/content";
import { getArticleRecords } from "@/lib/article-service";
import { getPublishedDestinations } from "@/lib/content-service";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const fixedRoutes = [
  "/", "/destinations", "/experiences", "/travel-guides", "/travel-stories", "/culture", "/plan", "/concierge", "/travel-intelligence", "/marketplace", "/contact", "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedDestinations, articleRecords] = await Promise.all([getPublishedDestinations(), getArticleRecords()]);
  const articleBySlug = new Map(articleRecords.map((record) => [record.slug, record]));
  const visibleStoryPaths = stories.flatMap((story) => {
    const record = articleBySlug.get(story.slug);
    return !record || record.status === "published" ? [`/travel-stories/${story.slug}`] : [];
  });
  const newPublishedStoryPaths = articleRecords.filter((record) => record.status === "published" && !stories.some((story) => story.slug === record.slug)).map((record) => `/travel-stories/${record.slug}`);
  const paths = new Set([
    ...fixedRoutes,
    ...publishedDestinations.map((item) => `/destinations/${item.slug}`),
    ...guides.map((item) => `/travel-guides/${item.slug}`),
    ...visibleStoryPaths,
    ...newPublishedStoryPaths,
  ]);
  return [...paths].map((path) => ({ url: absoluteUrl(path) }));
}
