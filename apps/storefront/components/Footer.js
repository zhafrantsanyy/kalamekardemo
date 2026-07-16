import Link from "next/link";
import { BUILDER_URL } from "@kalamekar/shared/tokens";

const LIVE_CITIES = [
  { nama: "Jakarta", slug: "jakarta" },
  { nama: "Bandung", slug: "bandung" },
  { nama: "Surabaya", slug: "surabaya" },
  { nama: "Yogyakarta", slug: "yogyakarta" },
  { nama: "Medan", slug: "medan" },
  { nama: "Bekasi", slug: "bekasi" },
];

const POPULAR_MOMEN = [
  { nama: "Bunga Wisuda", href: "/bunga-wisuda" },
  { nama: "Papan Bunga Grand Opening", href: "/papan-bunga-grand-opening" },
  { nama: "Bunga Duka Cita", href: "/bunga-duka-cita" },
];

function FooterCol({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>{title}</div>
      <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#122B1C", color: "#B9C9BB", padding: "44px 20px 24px", marginTop: 10 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ maxWidth: 280 }}>
            <span className="rk-serif" style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Kalamekar</span>
            <p style={{ opacity: 0.85, fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
              Marketplace &amp; direktori florist lokal Indonesia. Cari florist terverifikasi di kotamu, atau
              rangkai buketmu sendiri lewat Bouquet Builder.
            </p>
          </div>

          <FooterCol title="Jelajahi">
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/toko-bunga">Toko Bunga</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/momen">Moments</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/kategori">Kategori</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/blog">Blog</Link>
            <a className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href={BUILDER_URL}>Desain Buket Sendiri</a>
          </FooterCol>

          <FooterCol title="Perusahaan">
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/tentang-kami">Tentang Kami</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/untuk-florist">Untuk Florist</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/kontak">Kontak</Link>
          </FooterCol>

          <FooterCol title="Bantuan">
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/cara-pesan">Cara Pesan</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href="/faq">FAQ</Link>
          </FooterCol>

          <FooterCol title="Kota Populer">
            {LIVE_CITIES.map((c) => (
              <Link key={c.slug} className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href={`/toko-bunga/${c.slug}`}>
                Toko Bunga {c.nama}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Momen Populer">
            {POPULAR_MOMEN.map((m) => (
              <Link key={m.href} className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} href={m.href}>
                {m.nama}
              </Link>
            ))}
          </FooterCol>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, paddingTop: 18, fontSize: 12.5, opacity: 0.65 }}>
          <span>© {new Date().getFullYear()} Kalamekar. Seluruh hak cipta dilindungi.</span>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0 }} href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link className="rk-navlink rk-navlink-ondark" style={{ padding: 0 }} href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
