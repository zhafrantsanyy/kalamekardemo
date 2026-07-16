"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, MessageCircle, Wand2, Menu, X, ChevronDown } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";

const JELAJAHI_ITEMS = [
  { label: "Toko Bunga", href: "/toko-bunga" },
  { label: "Moments", href: "/momen" },
  { label: "Kategori", href: "/kategori" },
  { label: "Blog", href: "/blog" },
];

const MENU = [
  { label: "Untuk Florist", href: "/untuk-florist" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jelajahiOpen, setJelajahiOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");
  const activeStyle = (href) => (isActive(href) ? { color: "var(--rk-maroon)" } : undefined);
  const jelajahiActive = JELAJAHI_ITEMS.some((item) => isActive(item.href));

  useEffect(() => {
    setJelajahiOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setJelajahiOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setJelajahiOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--rk-line)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={17} color="var(--rk-maroon)" />
          </span>
          <span className="rk-serif" style={{ color: "var(--rk-maroon-deep)", fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
        </Link>

        <nav style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          <div ref={dropdownRef} className="rk-nav-dropdown rk-hide-sm">
            <button
              type="button"
              className="rk-navlink rk-navlink-onlight rk-nav-dropdown-trigger"
              style={jelajahiActive ? { color: "var(--rk-maroon)" } : undefined}
              onClick={() => setJelajahiOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={jelajahiOpen}
            >
              Jelajahi
              <ChevronDown size={14} style={{ transform: jelajahiOpen ? "rotate(180deg)" : undefined, transition: "transform .15s" }} />
            </button>
            {jelajahiOpen && (
              <div className="rk-nav-dropdown-panel" role="menu">
                {JELAJAHI_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="rk-navlink rk-navlink-onlight"
                    style={activeStyle(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {MENU.map((m) => (
            <Link
              key={m.href}
              className="rk-navlink rk-navlink-onlight rk-hide-sm"
              style={activeStyle(m.href)}
              href={m.href}
              aria-current={isActive(m.href) ? "page" : undefined}
            >
              {m.label}
            </Link>
          ))}
          <a className="rk-btn rk-btn-ghost rk-hide-sm" style={{ padding: "9px 16px", fontSize: 14, textDecoration: "none" }} href={BUILDER_URL}>
            <Wand2 size={16} /> Desain Buket
          </a>
          <Link
            className="rk-btn rk-hide-sm"
            style={{ background: "var(--rk-gold)", color: "var(--rk-maroon-deep)", padding: "9px 18px", fontSize: 14, textDecoration: "none" }}
            href="/kontak"
          >
            <MessageCircle size={16} /> Kontak
          </Link>

          <button
            type="button"
            className="rk-nav-toggle"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} color="var(--rk-maroon-deep)" /> : <Menu size={22} color="var(--rk-maroon-deep)" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="rk-nav-mobile">
            <div className="rk-nav-mobile-label">Jelajahi</div>
            {JELAJAHI_ITEMS.map((item) => (
              <Link
                key={item.href}
                className="rk-navlink rk-navlink-onlight"
                style={activeStyle(item.href)}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="rk-nav-mobile-divider" />
            {MENU.map((m) => (
              <Link
                key={m.href}
                className="rk-navlink rk-navlink-onlight"
                style={activeStyle(m.href)}
                href={m.href}
                aria-current={isActive(m.href) ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {m.label}
              </Link>
            ))}
            <a
              className="rk-btn rk-btn-ghost"
              style={{ padding: "10px 18px", fontSize: 14, textDecoration: "none", marginTop: 6, justifyContent: "center" }}
              href={BUILDER_URL}
              onClick={() => setMobileOpen(false)}
            >
              <Wand2 size={16} /> Desain Buket
            </a>
            <Link
              className="rk-btn"
              style={{ background: "var(--rk-gold)", color: "var(--rk-maroon-deep)", padding: "10px 18px", fontSize: 14, textDecoration: "none", justifyContent: "center" }}
              href="/kontak"
              onClick={() => setMobileOpen(false)}
            >
              <MessageCircle size={16} /> Kontak
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
