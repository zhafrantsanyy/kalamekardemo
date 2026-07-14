"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Flower2, Menu, X } from "lucide-react";
import { BUILDER_URL } from "@/lib/builderUrl";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => pathname === path;
  const activeStyle = (path) => (isActive(path) ? { color: "var(--rk-maroon)" } : undefined);

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
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" style={activeStyle("/")} href="/">Beranda</Link>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" href="/#kategori">Kategori</Link>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" href="/#cara-kerja">Cara kerja</Link>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" style={activeStyle("/tentang")} href="/tentang" aria-current={isActive("/tentang") ? "page" : undefined}>Tentang</Link>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" href="/#faq">FAQ</Link>
          <a className="rk-btn rk-hide-sm" style={{ background: "var(--rk-gold)", color: "var(--rk-maroon-deep)", padding: "9px 18px", fontSize: 14, textDecoration: "none" }} href={BUILDER_URL}>
            <Flower2 size={16} /> Rangkai
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
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/")} href="/" onClick={() => setMobileOpen(false)}>Beranda</Link>
            <Link className="rk-navlink rk-navlink-onlight" href="/#kategori" onClick={() => setMobileOpen(false)}>Kategori</Link>
            <Link className="rk-navlink rk-navlink-onlight" href="/#cara-kerja" onClick={() => setMobileOpen(false)}>Cara kerja</Link>
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/tentang")} href="/tentang" aria-current={isActive("/tentang") ? "page" : undefined} onClick={() => setMobileOpen(false)}>Tentang</Link>
            <Link className="rk-navlink rk-navlink-onlight" href="/#faq" onClick={() => setMobileOpen(false)}>FAQ</Link>
            <a
              className="rk-btn"
              style={{ background: "var(--rk-gold)", color: "var(--rk-maroon-deep)", padding: "10px 18px", fontSize: 14, textDecoration: "none", marginTop: 6, justifyContent: "center" }}
              href={BUILDER_URL}
              onClick={() => setMobileOpen(false)}
            >
              <Flower2 size={16} /> Rangkai
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
