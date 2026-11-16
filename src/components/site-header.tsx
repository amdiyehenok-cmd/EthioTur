"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNavigation } from "@/lib/site";
import Icon from "./icons";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const links = [...primaryNavigation, { label: "Contact", href: "/contact" }];

  return (
    <header className={`site-header ${isHome ? "site-header--home" : "site-header--interior"}`}>
      <div className="container site-header__inner">
        <Link className="wordmark" href="/" aria-label="Ethiopia Unfolded home">
          <span className="wordmark__symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none"><path d="M20 2.6 23.6 14l11.7-4.7L29 20l9.2 5.6-12.1-.3-.8 12.1L20 27.1l-5.4 10.3-.8-12.1-12.1.3L11 20l-6.3-10.7L16.4 14 20 2.6Z" stroke="currentColor" strokeWidth=".9"/><circle cx="20" cy="20" r="3.1" fill="currentColor"/></svg>
          </span>
          <span className="wordmark__text"><strong>ETHIOPIA UNFOLDED</strong><small>Discover beyond the ordinary</small></span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {links.map((item) => (
            <Link key={item.href} className="header-nav__link" href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="header-search" href="/search" aria-label="Search Ethiopia Unfolded">
            <Icon name="search" />
          </Link>
          <Link className="button button--gold header-plan" href="/plan">Plan your journey <span aria-hidden="true">↗</span></Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu" id="mobile-navigation" aria-label="Mobile navigation">
          {links.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <Link href="/plan">Plan your journey ↗</Link>
        </nav>
      )}
    </header>
  );
}
