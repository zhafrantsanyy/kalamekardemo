import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Flower2, ShoppingBag } from "lucide-react";
import { C } from "../lib/theme";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();

  const goSection = (id) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  };

  return (
    <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 18 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={17} color={C.maroon} />
          </span>
          <span className="rk-serif" style={{ color: C.maroonDeep, fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
        </Link>
        <nav style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" to="/">Beranda</Link>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("kategori")}>Kategori</button>
          <Link className="rk-navlink rk-navlink-onlight rk-hide-sm" to="/produk">Produk</Link>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("cara-kerja")}>Cara kerja</button>
          <button type="button" className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("faq")}>FAQ</button>
          <Link className="rk-btn rk-btn-ghost rk-hide-sm" style={{ padding: "8px 16px", fontSize: 13.5, textDecoration: "none" }} to="/keranjang">
            <ShoppingBag size={15} /> Keranjang{count > 0 ? ` (${count})` : ""}
          </Link>
          <Link className="rk-btn" style={{ background: C.gold, color: C.maroonDeep, padding: "9px 18px", fontSize: 14, textDecoration: "none" }} to="/builder">
            <Flower2 size={16} /> Rangkai
          </Link>
        </nav>
      </div>
    </header>
  );
}
