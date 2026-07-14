import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goSection = (id) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  };

  return (
    <footer style={{ background: "#122B1C", color: "#B9C9BB", padding: "44px 20px 24px", marginTop: 10 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ maxWidth: 320 }}>
            <span className="rk-serif" style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Kalamekar</span>
            <p style={{ opacity: 0.85, fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
              Marketplace florist lokal Indonesia dengan kanvas rangkai custom — susun sendiri, floris partner
              yang merakit dan mengirimkan.
            </p>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Jelajahi</div>
              <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} to="/kategori">Kategori</Link>
                <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} to="/produk">Produk</Link>
                <button type="button" className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("cara-kerja")}>Cara kerja</button>
                <button type="button" className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("faq")}>FAQ</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Perusahaan</div>
              <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} to="/tentang">Tentang Kami</Link>
                <button type="button" className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("untuk-floris")}>Gabung sebagai partner</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Sosial</div>
              <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                <a className="rk-navlink rk-navlink-ondark" href="https://www.instagram.com/kalamekar.id" target="_blank" rel="noreferrer">Instagram</a>
                <a className="rk-navlink rk-navlink-ondark" href="https://www.tiktok.com/@kalamekar.id" target="_blank" rel="noreferrer">TikTok</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, paddingTop: 18, fontSize: 12.5, opacity: 0.65 }}>
          <span>© {new Date().getFullYear()} Kalamekar. Seluruh hak cipta dilindungi.</span>
          <span>Pilot Fase 1 — order dikoordinasikan manual bersama floris partner via WhatsApp.</span>
        </div>
      </div>
    </footer>
  );
}
