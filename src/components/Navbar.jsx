import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Flower2, ShoppingBag, Menu, X } from "lucide-react";
import { C } from "../lib/theme";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const goSection = (id) => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  };

  const isActive = (path) => location.pathname === path;
  const activeStyle = (path) => (isActive(path) ? { color: C.maroon } : undefined);

  return (
    <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={17} color={C.maroon} />
          </span>
          <span className="rk-serif" style={{ color: C.maroonDeep, fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
        </Link>
        <nav style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" style={activeStyle("/")} to="/">Beranda</Link>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("kategori")}>Kategori</button>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" style={activeStyle("/produk")} to="/produk">Produk</Link>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("cara-kerja")}>Cara kerja</button>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" style={activeStyle("/tentang")} to="/tentang" aria-current={isActive("/tentang") ? "page" : undefined}>Tentang</Link>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("faq")}>FAQ</button>
          <Link className="rk-btn rk-btn-ghost rk-hide-sm" style={{ padding: "8px 16px", fontSize: 13.5, textDecoration: "none" }} to="/keranjang">
            <ShoppingBag size={15} /> Keranjang{count > 0 ? ` (${count})` : ""}
          </Link>
          <Link className="rk-btn" style={{ background: C.gold, color: C.maroonDeep, padding: "9px 18px", fontSize: 14, textDecoration: "none" }} to="/builder">
            <Flower2 size={16} /> Rangkai
          </Link>
          <button
            type="button"
            className="rk-nav-toggle"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} color={C.maroonDeep} /> : <Menu size={22} color={C.maroonDeep} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="rk-nav-mobile">
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/")} to="/" onClick={() => setMobileOpen(false)}>Beranda</Link>
            <button type="button" className="rk-navlink rk-navlink-onlight" style={{ textAlign: "left" }} onClick={() => goSection("kategori")}>Kategori</button>
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/produk")} to="/produk" onClick={() => setMobileOpen(false)}>Produk</Link>
            <button type="button" className="rk-navlink rk-navlink-onlight" style={{ textAlign: "left" }} onClick={() => goSection("cara-kerja")}>Cara kerja</button>
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/tentang")} to="/tentang" aria-current={isActive("/tentang") ? "page" : undefined} onClick={() => setMobileOpen(false)}>Tentang</Link>
            <button type="button" className="rk-navlink rk-navlink-onlight" style={{ textAlign: "left" }} onClick={() => goSection("faq")}>FAQ</button>
            <Link className="rk-navlink rk-navlink-onlight" style={activeStyle("/keranjang")} to="/keranjang" onClick={() => setMobileOpen(false)}>
              Keranjang{count > 0 ? ` (${count})` : ""}
            </Link>
            <Link
              className="rk-btn"
              style={{ background: C.gold, color: C.maroonDeep, padding: "10px 18px", fontSize: 14, textDecoration: "none", marginTop: 6, justifyContent: "center" }}
              to="/builder"
              onClick={() => setMobileOpen(false)}
            >
              <Flower2 size={16} /> Rangkai
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
