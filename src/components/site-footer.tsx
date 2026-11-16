import Link from "next/link";
import { advisoryNotice } from "@/lib/site";

const footerGroups = [
  { title: "Discover", links: [{ label: "Destinations", href: "/destinations" }, { label: "Experiences", href: "/experiences" }, { label: "Ethiopian culture", href: "/culture" }, { label: "Travel stories", href: "/travel-stories" }] },
  { title: "Plan thoughtfully", links: [{ label: "Build an itinerary", href: "/plan" }, { label: "Travel guides", href: "/travel-guides" }, { label: "Travel information", href: "/travel-intelligence" }, { label: "Ask the concierge", href: "/concierge" }] },
  { title: "Connect", links: [{ label: "Local experiences", href: "/marketplace" }, { label: "Contact us", href: "/contact" }, { label: "Newsletter", href: "/#newsletter" }] },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href="/" className="wordmark" aria-label="Ethiopia Unfolded home">
            <span className="wordmark__symbol" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M20 2.6 23.6 14l11.7-4.7L29 20l9.2 5.6-12.1-.3-.8 12.1L20 27.1l-5.4 10.3-.8-12.1-12.1.3L11 20l-6.3-10.7L16.4 14 20 2.6Z" stroke="currentColor" strokeWidth=".9"/><circle cx="20" cy="20" r="3.1" fill="currentColor"/></svg></span>
            <span className="wordmark__text"><strong>ETHIOPIA UNFOLDED</strong><small>Discover beyond the ordinary</small></span>
          </Link>
          <p className="footer-brand__description">A thoughtful guide to the landscapes, heritage, and living cultures of Ethiopia. Always travel with current advice and local knowledge.</p>
          <span className="footer-mark">ኢትዮጵያ · ETHIOPIA</span>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-column" key={group.title}>
            <h3>{group.title}</h3>
            <nav aria-label={`${group.title} footer links`}>
              {group.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            </nav>
          </div>
        ))}
      </div>
      <div className="container footer-disclaimer">
        <span>{advisoryNotice}</span>
        <div className="footer-disclaimer__right">
          <Link href="/travel-intelligence">Official travel sources</Link>
          <span>© {new Date().getFullYear()} Ethiopia Unfolded</span>
        </div>
      </div>
    </footer>
  );
}
