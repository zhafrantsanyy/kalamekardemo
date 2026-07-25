import Link from "next/link";
import {
  Flower2, Sparkles, Star, Check, ChevronRight,
  Leaf, Heart, Store, ShoppingBag, Wand2, Route, CreditCard, ShieldCheck,
  Camera, Truck, MapPin, BadgeCheck, MessageCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FLOWERS, FMAP, rupiah } from "@/lib/catalog";
import { BUILDER_URL, SITE_URL, WA_NUMBER } from "@kalamekar/shared/tokens";
import Thumb from "@/components/Thumb";
import HeroSearch from "@/components/HeroSearch";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Kalamekar — Toko Bunga Online & Direktori Florist Terpercaya",
  description:
    "Temukan florist terverifikasi di kotamu atau desain buket sendiri. Pesan mudah lewat WhatsApp, kirim bunga hari ini juga.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kalamekar — Toko Bunga Online & Direktori Florist Terpercaya",
    description:
      "Temukan florist terverifikasi di kotamu atau desain buket sendiri. Pesan mudah lewat WhatsApp, kirim bunga hari ini juga.",
    url: SITE_URL,
    type: "website",
  },
};

const STEPS = [
  { icon: Wand2, t: "1 · Rangkai", d: "Pilih bunga, geser & susun di kanvas. Harga terhitung real-time." },
  { icon: ShoppingBag, t: "2 · Checkout", d: "Isi alamat, waktu kirim, dan pesan kartu ucapan." },
  { icon: Route, t: "3 · Matching", d: "Order diteruskan ke floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "4 · Konfirmasi", d: "Floris menerima order. Jika penuh, otomatis dialihkan ke floris lain." },
  { icon: Camera, t: "5 · Rakit + Foto", d: "Floris merakit lalu mengirim foto hasil untuk kamu setujui." },
  { icon: Truck, t: "6 · Antar", d: "Kurir mengantar. Dana escrow diteruskan ke floris setelah diterima." },
];

const CATEGORIES = [
  { id: "hand-bouquet", nama: "Hand Bouquet", desc: "Buket tangan segar untuk anniversary, wisuda, dan hadiah spesial.", icon: Flower2 },
  { id: "papan-bunga", nama: "Papan Bunga", desc: "Ucapan selamat, duka cita, dan grand opening — kirim di hari yang sama.", icon: Heart },
  { id: "standing-flower", nama: "Standing Flower", desc: "Rangkaian berdiri yang elegan untuk acara resmi dan seremonial.", icon: Sparkles },
  { id: "bunga-meja", nama: "Bunga Meja", desc: "Vas dan rangkaian meja untuk kantor, resepsionis, dan rumah.", icon: Leaf },
  { id: "parcel-hampers", nama: "Parcel & Hampers", desc: "Bingkisan bunga, buah, dan hampers untuk hari raya dan perayaan.", icon: ShoppingBag },
  { id: "dekorasi-acara", nama: "Dekorasi Acara", desc: "Dekorasi pernikahan, lamaran, dan acara korporat oleh floris profesional.", icon: Store },
];

const OCCASIONS = [
  { nama: "Bunga Wisuda", desc: "Rayakan wisuda dengan rangkaian bunga istimewa.", href: "/bunga-wisuda" },
  { nama: "Bunga Ulang Tahun", desc: "Buket ulang tahun yang bikin harinya makin berkesan.", href: "/bunga-ulang-tahun" },
  { nama: "Papan Bunga Grand Opening", desc: "Ucapan sukses pembukaan usaha, kirim di hari yang sama.", href: "/papan-bunga-grand-opening" },
  { nama: "Papan Bunga Duka Cita", desc: "Sampaikan belasungkawa lewat rangkaian yang layak dan sopan.", href: "/papan-bunga-duka-cita" },
  { nama: "Bunga Anniversary", desc: "Rayakan hari jadi bersama pasangan atau orang terkasih.", href: "/bunga-anniversary" },
  { nama: "Bunga Valentine", desc: "Ungkapkan cinta lewat buket valentine yang dirangkai segar.", href: "/bunga-valentine" },
];

const CITIES = [
  { nama: "Jakarta", slug: "jakarta", desc: "Florist terverifikasi di Jakarta, siap kirim same-day." },
  { nama: "Surabaya", slug: "surabaya", desc: "Florist terverifikasi di Surabaya." },
  { nama: "Bandung", slug: "bandung", desc: "Florist terverifikasi di Bandung." },
  { nama: "Medan", slug: "medan", desc: "Florist terverifikasi di Medan." },
  { nama: "Bekasi", slug: "bekasi", desc: "Florist terverifikasi di Bekasi." },
  { nama: "Yogyakarta", slug: "yogyakarta", desc: "Florist terverifikasi di Yogyakarta." },
];

const RIBBON_TAGS = ["Bunga Wisuda", "Papan Bunga Pernikahan", "Bunga Duka Cita", "Grand Opening", "Anniversary", "Hand Bouquet Valentine"];

const FEATURED_FLORISTS = [
  { nama: "Melati Kirana Florist", meta: "Jakarta Selatan · Same-day", rating: 4.9, ulasan: 212, colors: ["#B93365", "#E6A93B", "#8F2450"] },
  { nama: "Sekar Ayu Flora", meta: "Bandung · Same-day", rating: 4.8, ulasan: 167, colors: ["#275C3B", "#B93365", "#E6A93B"] },
  { nama: "Bunga Nusantara", meta: "Surabaya · Papan bunga", rating: 4.9, ulasan: 324, colors: ["#E6A93B", "#B93365", "#275C3B"] },
  { nama: "Dahlia Bali Florist", meta: "Denpasar · Dekorasi", rating: 5.0, ulasan: 98, colors: ["#B93365", "#8F2450", "#E6A93B"] },
];

const KENAPA_FEATURES = [
  [ShieldCheck, "Florist terverifikasi", "Setiap toko dikurasi tim kami — alamat nyata, galeri asli, tanpa foto curian."],
  [Route, "Pengiriman same-day", "Pesan sebelum jam 3 sore, bunga tiba di hari yang sama di kota-kota besar."],
  [CreditCard, "Harga transparan", "Harga langsung dari florist, tanpa markup tersembunyi atau biaya kejutan."],
  [MessageCircle, "Chat langsung", "Diskusikan rangkaian, warna, dan kartu ucapan langsung dengan floristnya."],
];

const FAQS = [
  { q: "Apa itu Kalamekar?", a: "Kalamekar adalah marketplace yang menghubungkan Anda dengan toko bunga dan florist lokal terverifikasi di seluruh Indonesia. Anda bisa membandingkan galeri, harga, dan ulasan, lalu memesan langsung ke florist pilihan Anda — termasuk lewat kanvas rangkai custom kami." },
  { q: "Bagaimana cara memesan bunga di Kalamekar?", a: "Cari florist di kota Anda, pilih produk dari galeri florist, lalu klik tombol Pesan via WhatsApp — atau klik \"Mulai Merangkai\" untuk menyusun buket/krans Anda sendiri di kanvas drag-and-drop kami." },
  { q: "Apakah bisa kirim bunga di hari yang sama?", a: "Bisa. Sebagian besar florist di Kalamekar melayani pengiriman same-day untuk pemesanan sebelum pukul 15.00 waktu setempat. Cari badge Same-Day pada profil florist." },
  { q: "Kota mana saja yang sudah terjangkau Kalamekar?", a: "Kalamekar tersedia di 25+ kota termasuk Jakarta, Bandung, Surabaya, Medan, Semarang, Yogyakarta, Denpasar, dan Makassar — dan terus bertambah setiap bulan." },
  { q: "Bagaimana cara bergabung sebagai florist di Kalamekar?", a: "Daftarkan toko bunga Anda secara gratis melalui tombol WhatsApp pada bagian \"Punya toko bunga?\" di halaman ini. Tim kami akan memverifikasi toko Anda dalam 2–3 hari kerja sebelum etalase Anda tayang." },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kalamekar",
  url: SITE_URL,
  description:
    "Marketplace dan direktori florist lokal Indonesia — hand bouquet, papan bunga, hingga dekorasi acara, dengan kanvas rangkai custom drag-and-drop.",
  inLanguage: "id-ID",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kalamekar",
  url: SITE_URL,
  description:
    "Marketplace yang menghubungkan pembeli dengan florist lokal terverifikasi di seluruh Indonesia.",
  sameAs: [
    "https://www.instagram.com/kalamekar.id",
    "https://www.tiktok.com/@kalamekar.id",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+" + WA_NUMBER,
    contactType: "customer service",
    areaServed: "ID",
    availableLanguage: "Indonesian",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function HeroWreath() {
  const picks = ["mawar_merah", "daisy", "eucalyptus", "mawar_pink", "krisan", "babys", "anyelir", "eucalyptus", "mawar_putih", "lavender", "daisy", "mawar_merah"];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1 / 1" }} aria-hidden="true">
      <div className="rk-wreath-hero" style={{ position: "absolute", inset: 0 }}>
        <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx="120" cy="120" r="78" fill="none" stroke="var(--rk-maroon-soft)" strokeWidth="10" opacity="0.5" />
        </svg>
        {picks.map((pid, i) => {
          const a = (Math.PI * 2 * i) / picks.length;
          const x = 50 + Math.cos(a) * 32.5;
          const y = 50 + Math.sin(a) * 32.5;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={FMAP[pid].img}
              alt=""
              style={{
                position: "absolute", left: x + "%", top: y + "%", width: "15%", aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)", borderRadius: "50%", objectFit: "cover",
                border: "2px solid var(--rk-card)", boxShadow: "0 3px 10px rgba(28,42,32,.18)",
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--rk-maroon)", lineHeight: 1.3 }}>kala</span>
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--rk-maroon-deep)", lineHeight: 1.3 }}>mekar</span>
      </div>
    </div>
  );
}

async function FeaturedProducts() {
  const { data: products } = await supabase.from("products").select("*").limit(4);
  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: "8px 20px 64px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Produk Unggulan</span>
        <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0 24px" }}>Rangkaian siap pesan</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {products.map((p) => (
            <a key={p.id} href={BUILDER_URL} className="rk-card" style={{ display: "block", overflow: "hidden", textDecoration: "none", color: "inherit" }}>
              <div style={{ aspectRatio: "1/1", background: "var(--rk-cream)", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image_url && <img src={p.image_url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.nama}</div>
                <div style={{ color: "var(--rk-maroon)", fontWeight: 700, marginTop: 4, fontSize: 13.5 }}>{rupiah(p.harga || 0)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 70%)", padding: "0 20px" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=1600)",
            backgroundSize: "cover", backgroundPosition: "center 30%",
            opacity: 0.16, filter: "saturate(1.15)",
          }}
        />
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #FDF7FA 30%, rgba(253,247,250,.55) 55%, rgba(255,255,255,.25) 75%)" }}
        />
        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, padding: "60px 0 68px" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <span className="rk-eyebrow"><Leaf size={13} /> Marketplace florist lokal Indonesia</span>
            <h1 className="rk-serif rk-hero-title" style={{ fontSize: 44, lineHeight: 1.14, fontWeight: 700, margin: "16px 0", color: "var(--rk-maroon-deep)" }}>
              Temukan toko bunga & florist terpercaya{" "}
              <em style={{ fontStyle: "normal", color: "var(--rk-maroon)", position: "relative", whiteSpace: "nowrap" }}>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 10, background: "var(--rk-rose-soft)", zIndex: -1, borderRadius: 6 }} />
                di kotamu
              </em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 500, marginBottom: 8 }}>
              Kalamekar menghubungkan Anda dengan ratusan florist lokal terverifikasi di 25+ kota — hand bouquet,
              papan bunga, hingga dekorasi pernikahan. Susun sendiri lewat kanvas drag-and-drop kami, pesan langsung,
              dikirim di hari yang sama.
            </p>

            <HeroSearch />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
              <Link className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, textDecoration: "none" }} href="/toko-bunga">
                Cari Florist
              </Link>
              <a className="rk-btn rk-btn-ghost" style={{ padding: "13px 24px", fontSize: 14.5, textDecoration: "none" }} href={BUILDER_URL}>
                Desain Buket Sendiri
              </a>
            </div>

            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
              Populer:
              {OCCASIONS.slice(0, 4).map((o) => (
                <Link key={o.nama} href={o.href} className="rk-quick-pill">{o.nama}</Link>
              ))}
            </div>

            <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap" }}>
              {[["500+", "Florist terverifikasi"], ["25+", "Kota Indonesia"], ["4.9/5", "Rating pembeli"]].map(([n, l]) => (
                <div key={l}>
                  <div className="rk-serif" style={{ fontSize: 24, fontWeight: 700, color: "var(--rk-maroon-deep)" }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)" }}>{l}</div>
                </div>
              ))}
            </div>

            <a className="rk-btn rk-btn-ghost" style={{ padding: "12px 20px", fontSize: 14, marginTop: 22, textDecoration: "none" }} href="#cara-kerja">
              Lihat cara kerja
            </a>
          </div>
          <div className="rk-float" style={{ flex: "0 1 320px", minWidth: 240, display: "flex", justifyContent: "center" }}>
            <HeroWreath />
          </div>
        </div>
      </section>

      {/* Ribbon marquee */}
      <div className="rk-ribbon" aria-hidden="true">
        <div className="rk-ribbon-track">
          {[...RIBBON_TAGS, ...RIBBON_TAGS].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              {t} <Sparkles size={12} color="var(--rk-gold)" />
            </span>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <section id="kategori" style={{ padding: "72px 20px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Kategori</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0" }}>Rangkaian bunga untuk setiap momen</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Dari buket wisuda hingga papan bunga grand opening — semua dibuat segar oleh florist lokal di kotamu.
          </p>
          <ScrollReveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((c) => (
              <a key={c.id} href={BUILDER_URL} className="rk-cat-card" style={{ textDecoration: "none" }}>
                <span className="rk-cat-icon"><c.icon size={20} color="var(--rk-maroon)" /></span>
                <div className="rk-serif" style={{ fontSize: 17.5, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 5 }}>{c.nama}</div>
                <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--rk-maroon)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Mulai rangkai <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Produk unggulan (Supabase, server-rendered) */}
      <FeaturedProducts />

      {/* Cara kerja */}
      <section id="cara-kerja" style={{ background: "var(--rk-cream)", padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Cara Pesan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0" }}>Dari rangkai sampai bunga sampai</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 28, fontSize: 15 }}>
            Enam langkah, dengan pengalihan otomatis bila floris sedang penuh.
          </p>
          <div className="rk-steps-grid">
            {STEPS.map((s) => (
              <ScrollReveal key={s.t} as="div" className="rk-card" style={{ padding: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--rk-teal)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <s.icon size={20} color="#fff" />
                </div>
                <div className="rk-serif" style={{ fontSize: 18.5, fontWeight: 700, color: "var(--rk-maroon)", marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>{s.d}</div>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/cara-pesan" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
              Lihat panduan lengkap cara pesan →
            </Link>
          </div>
        </div>
      </section>

      {/* Florist Pilihan */}
      <section id="florist" style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Florist Pilihan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0" }}>Florist terverifikasi minggu ini</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 28, fontSize: 15, maxWidth: 640 }}>
            Setiap florist di Kalamekar melewati proses kurasi — galeri asli, alamat jelas, dan ulasan pembeli nyata.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {FEATURED_FLORISTS.map((f) => (
              <a key={f.nama} href={BUILDER_URL} className="rk-florist-card" style={{ textDecoration: "none" }}>
                <div className="rk-florist-photo" style={{ background: `linear-gradient(135deg, ${f.colors[0]}22, ${f.colors[1]}44, ${f.colors[2]}33)` }}>
                  <span className="rk-badge"><BadgeCheck size={12} /> Terverifikasi</span>
                </div>
                <div style={{ padding: 16, textAlign: "left" }}>
                  <div className="rk-serif" style={{ fontSize: 16, fontWeight: 700, color: "var(--rk-ink)" }}>{f.nama}</div>
                  <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 3 }}>{f.meta}</div>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={13} fill="var(--rk-gold)" color="var(--rk-gold)" /> {f.rating} <span style={{ fontWeight: 400, color: "var(--rk-ink-soft)" }}>({f.ulasan} ulasan)</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog preview */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", marginBottom: 8 }}>Katalog bunga</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 24, fontSize: 15 }}>
            SKU universal — nama & grade yang sama di semua floris partner, jadi rangkaianmu pasti bisa dipenuhi.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {FLOWERS.map((f) => (
              <div key={f.id} className="rk-card" style={{ padding: "14px 8px", textAlign: "center" }}>
                <Thumb f={f} size={54} />
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 6 }}>{f.nama}</div>
                <div style={{ fontSize: 12.5, color: "var(--rk-teal-deep)", fontWeight: 600 }}>{rupiah(f.harga)}<span style={{ color: "var(--rk-ink-soft)", fontWeight: 400 }}>/tangkai</span></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <a className="rk-btn rk-btn-primary" style={{ padding: "14px 28px", fontSize: 15.5, textDecoration: "none" }} href={BUILDER_URL}>
              <Sparkles size={18} /> Rangkai sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Kenapa Kalamekar */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Kenapa Kalamekar</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0 32px" }}>Cara paling tenang mengirim bunga</h2>
          <div className="rk-arch-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {KENAPA_FEATURES.map(([Ic, t, d]) => (
              <div key={t}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic size={20} color="var(--rk-maroon)" />
                </span>
                <div className="rk-serif" style={{ fontSize: 17, fontWeight: 700, color: "var(--rk-ink)", margin: "10px 0 4px" }}>{t}</div>
                <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jangkauan kota */}
      <section id="kota" style={{ background: "var(--rk-cream)", padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Jangkauan Kami</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0" }}>Toko bunga di kota-kota Indonesia</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Pilih kotamu untuk melihat daftar florist lokal, harga, dan estimasi pengiriman.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {CITIES.map((c) => (
              <Link key={c.nama} href={`/toko-bunga/${c.slug}`} className="rk-card" style={{ display: "block", padding: 18, textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--rk-ink)" }}>
                  <MapPin size={14} color="var(--rk-maroon)" /> {c.nama}
                </div>
                <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{c.desc}</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/toko-bunga" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
              Lihat semua kota →
            </Link>
          </div>
        </div>
      </section>

      {/* Berdasarkan momen */}
      <section style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Berdasarkan Momen</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0" }}>Bunga untuk setiap kesempatan</h2>
          <p style={{ color: "var(--rk-ink-soft)", marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Rangkaian yang tepat untuk setiap momen — dipandu florist berpengalaman.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            {OCCASIONS.map((o) => (
              <Link key={o.nama} href={o.href} className="rk-card" style={{ display: "block", padding: 18, textDecoration: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, color: "var(--rk-ink)" }}>
                  {o.nama} <ChevronRight size={14} color="var(--rk-maroon)" />
                </div>
                <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{o.desc}</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/momen" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
              Lihat semua momen →
            </Link>
          </div>
        </div>
      </section>

      {/* Untuk floris */}
      <section id="untuk-floris" style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="rk-join-card">
            <h2 className="rk-serif" style={{ fontSize: 28, color: "#fff", marginBottom: 10 }}>
              Punya toko bunga? Saatnya <em style={{ fontStyle: "normal", color: "var(--rk-gold-soft)" }}>mekar</em> bersama kami.
            </h2>
            <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 560, marginBottom: 20, lineHeight: 1.6 }}>
              Buka etalase online gratis, jangkau pembeli baru di kotamu, dan terima pesanan langsung ke WhatsApp —
              tanpa perlu bikin website sendiri.
            </p>
            <div style={{ display: "grid", gap: 10, marginBottom: 26, maxWidth: 520 }}>
              {[
                "Pendaftaran gratis, verifikasi 2–3 hari kerja",
                "Etalase dengan galeri, harga, dan ulasan pembeli",
                "Pesanan masuk langsung ke WhatsApp tokomu",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5 }}>
                  <Check size={17} style={{ color: "var(--rk-gold-soft)", flexShrink: 0, marginTop: 3 }} />
                  {t}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <a
                className="rk-btn"
                style={{ background: "var(--rk-gold)", color: "var(--rk-maroon-deep)", padding: "13px 24px", fontSize: 14.5, textDecoration: "none", display: "inline-flex" }}
                href={"https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent("Halo Kalamekar, saya ingin mendaftarkan toko bunga saya sebagai floris partner.")}
                target="_blank" rel="noreferrer"
              >
                <MessageCircle size={17} /> Daftar via WhatsApp
              </a>
              <Link href="/untuk-florist" style={{ color: "var(--rk-gold-soft)", fontWeight: 700, fontSize: 14 }}>
                Pelajari selengkapnya →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "8px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: "var(--rk-maroon)", margin: "8px 0 24px" }}>Pertanyaan yang sering diajukan</h2>
          <div>
            {FAQS.map((f) => (
              <details key={f.q} className="rk-faq-item">
                <summary>
                  {f.q}
                  <svg className="rk-faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="rk-faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/faq" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
              Lihat FAQ lengkap →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
