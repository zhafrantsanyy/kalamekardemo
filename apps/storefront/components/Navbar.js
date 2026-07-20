"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Wand2, Menu, X, ChevronDown, LogIn } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";
import { KATEGORI_LIST } from "@/lib/data/kategori";
import { MOMEN_DISPLAY_GROUPS, MOMEN_DATA } from "@/lib/data/momen";
import { LIVE_KOTA_SLUGS, JAKARTA_SUBAREA_SLUGS, KOTA_DATA } from "@/lib/data/kota";

function momenGroupColumns(labels) {
  return MOMEN_DISPLAY_GROUPS.filter((g) => labels.includes(g.label)).map((g) => ({
    label: labels.length > 1 ? g.label : undefined,
    items: g.slugs.map((slug) => ({ label: MOMEN_DATA[slug].nama, href: `/${slug}` })),
  }));
}

const PRODUK_COLUMNS = [{ items: KATEGORI_LIST.map((k) => ({ label: k.nama, href: `/kategori#${k.id}` })) }];
const MOMEN_COLUMNS = momenGroupColumns(["Momen Personal", "Acara & Formal", "Korporat", "Duka Cita & Religi"]);
const TOKO_BUNGA_COLUMNS = [
  { label: "Kota Utama", items: LIVE_KOTA_SLUGS.map((slug) => ({ label: KOTA_DATA[slug].nama, href: `/toko-bunga/${slug}` })) },
  { label: "Wilayah Jakarta", items: JAKARTA_SUBAREA_SLUGS.map((slug) => ({ label: KOTA_DATA[slug].nama, href: `/toko-bunga/${slug}` })) },
];

const NAV_ITEMS = [
  { type: "dropdown", key: "produk", label: "Produk", wide: false, columns: PRODUK_COLUMNS, footerLink: { label: "Lihat Semua Kategori", href: "/kategori" } },
  { type: "dropdown", key: "momen", label: "Momen", wide: true, columns: MOMEN_COLUMNS, footerLink: { label: "Lihat Semua Momen", href: "/momen" } },
  { type: "dropdown", key: "toko-bunga", label: "Toko Bunga", wide: true, columns: TOKO_BUNGA_COLUMNS, footerLink: { label: "Lihat Semua Kota", href: "/toko-bunga" }, align: "right" },
  { type: "link", label: "Untuk Florist", href: "/untuk-florist" },
  { type: "link", label: "Tentang Kami", href: "/tentang-kami" },
];

function itemHrefs(item) {
  const hrefs = item.columns.flatMap((c) => c.items.map((i) => i.href));
  if (item.footerLink) hrefs.push(item.footerLink.href);
  return hrefs;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileSection, setMobileSection] = useState(null);
  const [lastPathname, setLastPathname] = useState(pathname);
  const navRef = useRef(null);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");
  const activeStyle = (href) => (isActive(href) ? { color: "var(--rk-maroon)" } : undefined);

  // Reset open menus when the route changes. Adjusting state during render
  // (rather than in a useEffect) avoids an extra render pass on navigation.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpenMenu(null);
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
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
        <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={15} color="var(--rk-maroon)" />
          </span>
          <span className="rk-serif" style={{ color: "var(--rk-maroon-deep)", fontSize: 19, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
        </Link>

        <nav style={{ display: "flex", gap: 12, marginLeft: "auto", alignItems: "center" }}>
          <div ref={navRef} className="rk-hide-sm" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.href}
                  className="rk-navlink rk-navlink-onlight"
                  style={activeStyle(item.href)}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.key} className="rk-nav-dropdown">
                  <button
                    type="button"
                    className="rk-navlink rk-navlink-onlight rk-nav-dropdown-trigger"
                    style={itemHrefs(item).some(isActive) ? { color: "var(--rk-maroon)" } : undefined}
                    onClick={() => setOpenMenu((v) => (v === item.key ? null : item.key))}
                    aria-haspopup="true"
                    aria-expanded={openMenu === item.key}
                  >
                    {item.label}
                    <ChevronDown size={14} style={{ transform: openMenu === item.key ? "rotate(180deg)" : undefined, transition: "transform .15s" }} />
                  </button>
                  {openMenu === item.key && (
                    <div
                      className={item.wide ? "rk-nav-dropdown-panel-wide" : "rk-nav-dropdown-panel"}
                      style={item.align === "right" ? { left: "auto", right: 0 } : undefined}
                      role="menu"
                    >
                      {item.columns.map((col, i) => (
                        <div key={col.label || i} className="rk-nav-dropdown-col">
                          {col.label && <span className="rk-nav-dropdown-col-label">{col.label}</span>}
                          {col.items.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              className="rk-navlink rk-navlink-onlight"
                              style={activeStyle(link.href)}
                              aria-current={isActive(link.href) ? "page" : undefined}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                      {item.footerLink && (
                        <div className={item.wide ? "rk-nav-dropdown-footer" : undefined}>
                          <Link href={item.footerLink.href} role="menuitem" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
                            {item.footerLink.label} →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <Link className="rk-btn rk-btn-ghost rk-hide-sm" style={{ padding: "9px 16px", fontSize: 14, textDecoration: "none" }} href="/masuk">
            <LogIn size={16} /> Masuk
          </Link>

          <a className="rk-btn rk-btn-primary rk-hide-sm" style={{ padding: "9px 18px", fontSize: 14, textDecoration: "none" }} href={BUILDER_URL}>
            <Wand2 size={16} /> Desain Buket
          </a>

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
            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
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
              ) : (
                <div key={item.key}>
                  <button
                    type="button"
                    className="rk-nav-mobile-section-trigger"
                    onClick={() => setMobileSection((v) => (v === item.key ? null : item.key))}
                    aria-expanded={mobileSection === item.key}
                  >
                    {item.label}
                    <ChevronDown size={16} style={{ transform: mobileSection === item.key ? "rotate(180deg)" : undefined, transition: "transform .15s" }} />
                  </button>
                  {mobileSection === item.key && (
                    <div className="rk-nav-mobile-section-panel">
                      {item.columns.map((col, i) => (
                        <div key={col.label || i} style={{ display: "flex", flexDirection: "column" }}>
                          {col.label && <div className="rk-nav-mobile-label">{col.label}</div>}
                          {col.items.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="rk-navlink rk-navlink-onlight"
                              style={activeStyle(link.href)}
                              onClick={() => setMobileOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                      {item.footerLink && (
                        <Link
                          href={item.footerLink.href}
                          className="rk-navlink rk-navlink-onlight"
                          style={{ fontWeight: 700, color: "var(--rk-maroon)" }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.footerLink.label} →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
            <div className="rk-nav-mobile-divider" />
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                className="rk-btn rk-btn-ghost"
                style={{ padding: "10px 16px", fontSize: 14, textDecoration: "none", justifyContent: "center", flex: 1 }}
                href="/masuk"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} /> Masuk
              </Link>
              <a
                className="rk-btn rk-btn-primary"
                style={{ padding: "10px 18px", fontSize: 14, textDecoration: "none", justifyContent: "center", flex: 1 }}
                href={BUILDER_URL}
                onClick={() => setMobileOpen(false)}
              >
                <Wand2 size={16} /> Desain Buket
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
