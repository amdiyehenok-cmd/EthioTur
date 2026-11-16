import Link from "next/link";
import { jsonLd, siteName, siteUrl } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, `${siteUrl}/`).toString() } : {}),
    })),
  };
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {allItems.map((item, index) => (
          <span key={`${item.label}-${index}`} style={{ display: "contents" }}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index < allItems.length - 1 && item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ ...data, "@context": "https://schema.org", name: `${siteName} breadcrumbs` }) }} />
    </>
  );
}
