import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { jsonLd, siteName, siteTagline, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description:
    "Discover Ethiopia beyond the ordinary: carefully sourced destination guides, practical trip planning, Ethiopian culture, and meaningful ways to travel.",
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: "A considered travel guide to Ethiopia's places, living culture, landscapes, and heritage.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: "Discover Ethiopia beyond the ordinary.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

const globalStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: "Independent Ethiopia travel discovery, editorial, and planning platform.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteTagline,
    inLanguage: "en",
  },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(globalStructuredData) }} />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
