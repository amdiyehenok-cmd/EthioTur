export const siteName = "ETHIOPIA UNFOLDED";
export const siteTagline = "Discover Ethiopia Beyond the Ordinary.";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ethiopiaunfolded.com").replace(/\/$/, "");
export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).toString();

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const primaryNavigation = [
  { label: "Discover", href: "/#discover" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Travel guides", href: "/travel-guides" },
  { label: "Stories", href: "/travel-stories" },
  { label: "Culture", href: "/culture" },
  { label: "Travel info", href: "/travel-intelligence" },
];

export const advisoryNotice =
  "Travel advice and access can change. This platform is not a live safety feed. Read your own government's current Ethiopia advisory before planning any route.";
