import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flower2, Sparkles, Star, Check, ChevronRight, MessageCircle, Search,
  Leaf, Heart, Store, ShoppingBag, Wand2, Route, CreditCard, ShieldCheck,
  Camera, Truck, MapPin, BadgeCheck,
} from "lucide-react";
import { C, serif, rupiah } from "../lib/theme";
import { FLOWERS, FMAP, SIZES } from "../lib/catalog";
import { supabase, ADMIN_WA } from "../lib/supabase";
import Thumb from "../components/Thumb";

/* ---------------- Hero wreath decoration ---------------- */

const HeroWreath = () => {
  const picks = ["mawar_merah", "daisy", "eucalyptus", "mawar_pink", "krisan", "babys", "anyelir", "eucalyptus", "mawar_putih", "lavender", "daisy", "mawar_merah"];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1 / 1" }} aria-hidden="true">
      <div className="rk-wreath-hero" style={{ position: "absolute", inset: 0 }}>
        <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx="120" cy="120" r="78" fill="none" stroke={C.maroonSoft} strokeWidth="10" opacity="0.5" />
        </svg>
        {picks.map((pid, i) => {
          const a = (Math.PI * 2 * i) / picks.length;
          const x = 50 + Math.cos(a) * 32.5;
          const y = 50 + Math.sin(a) * 32.5;
          return (
            <img
              key={i}
              src={FMAP[pid].img}
              alt=""
              style={{
                position: "absolute", left: x + "%", top: y + "%", width: "15%", aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)", borderRadius: "50%", objectFit: "cover",
                border: `2px solid ${C.card}`, boxShadow: "0 3px 10px rgba(28,42,32,.18)",
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, color: C.maroon, lineHeight: 1.3 }}>kala</span>
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, color: C.maroonDeep, lineHeight: 1.3 }}>mekar</span>
      </div>
    </div>
  );
};

/* ---------------- Static content ---------------- */

const STEPS = [
  { icon: Wand2, t: "1 · Rangkai", d: "Pilih bunga, geser & susun di kanvas. Harga terhitung real-time." },
  { icon: ShoppingBag, t: "2 · Checkout", d: "Isi alamat, waktu kirim, dan pesan kartu ucapan." },
  { icon: Route, t: "3 · Matching", d: "Order diteruskan ke floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "4 · Konfirmasi", d: "Floris menerima order. Jika penuh, otomatis dialihkan ke floris lain." },
  { icon: Camera, t: "5 · Rakit + Foto", d: "Floris merakit lalu mengirim foto hasil untuk kamu setujui." },
  { icon: Truck, t: "6 · Antar", d: "Kurir mengantar. Dana escrow diteruskan ke floris setelah diterima." },
];

const CATEGORIES = [
  { id: "hand-bouquet", nama: "Hand Bouquet", desc: "Buket tangan segar untuk anniversary, wisuda, dan hadiah spesial.", mode: "bouquet", icon: Flower2 },
  { id: "papan-bunga", nama: "Papan Bunga", desc: "Ucapan selamat, duka cita, dan grand opening — kirim di hari yang sama.", mode: "wreath", icon: Heart },
  { id: "standing-flower", nama: "Standing Flower", desc: "Rangkaian berdiri yang elegan untuk acara resmi dan seremonial.", mode: "wreath", icon: Sparkles },
  { id: "bunga-meja", nama: "Bunga Meja", desc: "Vas dan rangkaian meja untuk kantor, resepsionis, dan rumah.", mode: "bouquet", icon: Leaf },
  { id: "parcel-hampers", nama: "Parcel & Hampers", desc: "Bingkisan bunga, buah, dan hampers untuk hari raya dan perayaan.", mode: "bouquet", icon: ShoppingBag },
  { id: "dekorasi-acara", nama: "Dekorasi Acara", desc: "Dekorasi pernikahan, lamaran, dan acara korporat oleh floris profesional.", mode: "wreath", icon: Store },
];

const OCCASIONS = [
  { nama: "Bunga Wisuda", mode: "bouquet" },
  { nama: "Bunga Duka Cita", mode: "wreath" },
  { nama: "Papan Bunga Pernikahan", mode: "wreath" },
  { nama: "Bunga Anniversary", mode: "bouquet" },
  { nama: "Papan Bunga Grand Opening", mode: "wreath" },
  { nama: "Bunga Ulang Tahun", mode: "bouquet" },
  { nama: "Bunga Valentine", mode: "bouquet" },
  { nama: "Bunga untuk Ibu", mode: "bouquet" },
];

const CITIES = [
  { nama: "Jakarta Selatan", live: true },
  { nama: "Jakarta", live: false },
  { nama: "Bandung", live: false },
  { nama: "Surabaya", live: false },
  { nama: "Medan", live: false },
  { nama: "Semarang", live: false },
  { nama: "Yogyakarta", live: false },
  { nama: "Denpasar", live: false },
  { nama: "Makassar", live: false },
  { nama: "Tangerang", live: false },
  { nama: "Bekasi", live: false },
  { nama: "Bogor", live: false },
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

/* ---------------- Featured products (Supabase) ---------------- */

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase.from("products").select("*").limit(4);
      if (!active) return;
      setProducts(data || []);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  if (!supabase || loading || products.length === 0) return null;

  return (
    <section style={{ padding: "8px 20px 64px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <span className="rk-eyebrow" style={{ color: C.maroon }}>Produk Unggulan</span>
        <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0 24px" }}>Rangkaian siap pesan</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {products.map((p) => (
            <Link key={p.id} to={`/produk/${p.slug}`} className="rk-card" style={{ display: "block", overflow: "hidden", textDecoration: "none", color: "inherit" }}>
              <div style={{ aspectRatio: "1/1", background: C.cream, overflow: "hidden" }}>
                {p.image_url && <img src={p.image_url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.nama}</div>
                <div style={{ color: C.maroon, fontWeight: 700, marginTop: 4, fontSize: 13.5 }}>{rupiah(p.harga || 0)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Home page ---------------- */

export default function Home() {
  const navigate = useNavigate();
  const [kategori, setKategori] = useState(CATEGORIES[0].id);
  const [ukuran, setUkuran] = useState("M");

  const openBuilder = (mode, size) => {
    navigate("/builder", { state: { mode, sizeId: size } });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.id === kategori) || CATEGORIES[0];
    openBuilder(cat.mode, ukuran);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 70%)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, padding: "60px 0 68px" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <span className="rk-eyebrow"><Leaf size={13} /> Marketplace florist lokal Indonesia</span>
            <h1 className="rk-serif rk-hero-title" style={{ fontSize: 44, lineHeight: 1.14, fontWeight: 700, margin: "16px 0", color: C.maroonDeep }}>
              Temukan toko bunga & florist terpercaya{" "}
              <em style={{ fontStyle: "normal", color: C.maroon, position: "relative", whiteSpace: "nowrap" }}>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 10, background: C.roseSoft, zIndex: -1, borderRadius: 6 }} />
                di kotamu
              </em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: C.inkSoft, maxWidth: 500, marginBottom: 8 }}>
              Kalamekar menghubungkan Anda dengan ratusan florist lokal terverifikasi di 25+ kota — hand bouquet,
              papan bunga, hingga dekorasi pernikahan. Susun sendiri lewat kanvas drag-and-drop kami, pesan langsung,
              dikirim di hari yang sama.
            </p>

            <form className="rk-search-panel" onSubmit={handleSearchSubmit} aria-label="Mulai merangkai bunga">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <div className="rk-search-field" style={{ flex: "1 1 160px" }}>
                  <label htmlFor="kategori-select">Kategori</label>
                  <select id="kategori-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>
                </div>
                <div className="rk-search-field" style={{ flex: "1 1 120px" }}>
                  <label htmlFor="ukuran-select">Ukuran</label>
                  <select id="ukuran-select" value={ukuran} onChange={(e) => setUkuran(e.target.value)}>
                    {SIZES.map((s) => <option key={s.id} value={s.id}>{s.nama} · {s.saran}</option>)}
                  </select>
                </div>
                <button className="rk-btn" type="submit" style={{ background: C.maroon, color: "#fff", padding: "13px 20px", fontSize: 14.5, flex: "0 0 auto" }}>
                  <Search size={16} /> Mulai Merangkai
                </button>
              </div>
            </form>

            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 13.5, color: C.inkSoft }}>
              Populer:
              {OCCASIONS.slice(0, 4).map((o) => (
                <button key={o.nama} type="button" className="rk-quick-pill" onClick={() => openBuilder(o.mode)}>{o.nama}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap" }}>
              {[["500+", "Florist terverifikasi"], ["25+", "Kota Indonesia"], ["4.9/5", "Rating pembeli"]].map(([n, l]) => (
                <div key={l}>
                  <div className="rk-serif" style={{ fontSize: 24, fontWeight: 700, color: C.maroonDeep }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft }}>{l}</div>
                </div>
              ))}
            </div>

            <button className="rk-btn rk-btn-ghost" style={{ padding: "12px 20px", fontSize: 14, marginTop: 22 }}
              onClick={() => document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" })}>
              Lihat cara kerja
            </button>
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
              {t} <Sparkles size={12} color={C.gold} />
            </span>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <section id="kategori" style={{ padding: "72px 20px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Kategori</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Rangkaian bunga untuk setiap momen</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Dari buket wisuda hingga papan bunga grand opening — semua dibuat segar oleh florist lokal di kotamu.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="rk-cat-card" onClick={() => openBuilder(c.mode)}>
                <span className="rk-cat-icon"><c.icon size={20} color={C.maroon} /></span>
                <div className="rk-serif" style={{ fontSize: 17.5, fontWeight: 700, color: C.ink, marginBottom: 5 }}>{c.nama}</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: C.maroon, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Mulai rangkai <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produk unggulan (Supabase) */}
      <FeaturedProducts />

      {/* Cara kerja */}
      <section id="cara-kerja" style={{ background: C.cream, padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Cara Pesan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Dari rangkai sampai bunga sampai</h2>
          <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15 }}>
            Enam langkah, dengan pengalihan otomatis bila floris sedang penuh.
          </p>
          <div className="rk-steps-grid">
            {STEPS.map((s) => (
              <div key={s.t} className="rk-card" style={{ padding: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <s.icon size={20} color="#fff" />
                </div>
                <div className="rk-serif" style={{ fontSize: 18.5, fontWeight: 700, color: C.maroon, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Florist Pilihan */}
      <section id="florist" style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Florist Pilihan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Florist terverifikasi minggu ini</h2>
          <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15, maxWidth: 640 }}>
            Setiap florist di Kalamekar melewati proses kurasi — galeri asli, alamat jelas, dan ulasan pembeli nyata.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {FEATURED_FLORISTS.map((f) => (
              <button key={f.nama} type="button" className="rk-florist-card" onClick={() => openBuilder()}>
                <div className="rk-florist-photo" style={{ background: `linear-gradient(135deg, ${f.colors[0]}22, ${f.colors[1]}44, ${f.colors[2]}33)` }}>
                  <span className="rk-badge"><BadgeCheck size={12} /> Terverifikasi</span>
                </div>
                <div style={{ padding: 16, textAlign: "left" }}>
                  <div className="rk-serif" style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{f.nama}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3 }}>{f.meta}</div>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={13} fill={C.gold} color={C.gold} /> {f.rating} <span style={{ fontWeight: 400, color: C.inkSoft }}>({f.ulasan} ulasan)</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog preview */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, marginBottom: 8 }}>Katalog bunga</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15 }}>
            SKU universal — nama & grade yang sama di semua floris partner, jadi rangkaianmu pasti bisa dipenuhi.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {FLOWERS.map((f) => (
              <div key={f.id} className="rk-card" style={{ padding: "14px 8px", textAlign: "center" }}>
                <Thumb f={f} size={54} />
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 6 }}>{f.nama}</div>
                <div style={{ fontSize: 12.5, color: C.tealDeep, fontWeight: 600 }}>{rupiah(f.harga)}<span style={{ color: C.inkSoft, fontWeight: 400 }}>/tangkai</span></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button className="rk-btn rk-btn-primary" style={{ padding: "14px 28px", fontSize: 15.5 }} onClick={() => openBuilder()}>
              <Sparkles size={18} /> Rangkai sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Kenapa Kalamekar */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Kenapa Kalamekar</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0 32px" }}>Cara paling tenang mengirim bunga</h2>
          <div className="rk-arch-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {KENAPA_FEATURES.map(([Ic, t, d]) => (
              <div key={t}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic size={20} color={C.maroon} />
                </span>
                <div className="rk-serif" style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: "10px 0 4px" }}>{t}</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jangkauan kota */}
      <section id="kota" style={{ background: C.cream, padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Jangkauan Kami</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Toko bunga di kota-kota Indonesia</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Pilih kotamu untuk melihat daftar florist lokal, harga, dan estimasi pengiriman.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CITIES.map((c) => c.live ? (
              <button key={c.nama} type="button" className="rk-link-chip rk-link-chip-active" onClick={() => openBuilder()}>
                <MapPin size={13} /> {c.nama} <span style={{ fontSize: 11, color: C.tealDeep, fontWeight: 700 }}>· aktif</span>
              </button>
            ) : (
              <span key={c.nama} className="rk-link-chip" style={{ opacity: 0.7 }}>
                <MapPin size={13} /> {c.nama} <span style={{ fontSize: 11 }}>· segera</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Berdasarkan momen */}
      <section style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Berdasarkan Momen</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Bunga untuk setiap kesempatan</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Rangkaian yang tepat untuk setiap momen — dipandu florist berpengalaman.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {OCCASIONS.map((o) => (
              <button key={o.nama} type="button" className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }} onClick={() => openBuilder(o.mode)}>
                {o.nama} <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Untuk floris */}
      <section id="untuk-floris" style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="rk-join-card">
            <h2 className="rk-serif" style={{ fontSize: 28, color: "#fff", marginBottom: 10 }}>
              Punya toko bunga? Saatnya <em style={{ fontStyle: "normal", color: C.goldSoft }}>mekar</em> bersama kami.
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
                  <Check size={17} style={{ color: C.goldSoft, flexShrink: 0, marginTop: 3 }} />
                  {t}
                </div>
              ))}
            </div>
            {ADMIN_WA ? (
              <a
                className="rk-btn"
                style={{ background: C.gold, color: C.maroonDeep, padding: "13px 24px", fontSize: 14.5, textDecoration: "none", display: "inline-flex" }}
                href={"https://wa.me/" + ADMIN_WA + "?text=" + encodeURIComponent("Halo Kalamekar, saya ingin mendaftarkan toko bunga saya sebagai floris partner.")}
                target="_blank" rel="noreferrer"
              >
                <MessageCircle size={17} /> Daftar via WhatsApp
              </a>
            ) : (
              <a
                className="rk-btn"
                style={{ background: C.gold, color: C.maroonDeep, padding: "13px 24px", fontSize: 14.5, textDecoration: "none", display: "inline-flex" }}
                href="mailto:halo@kalamekar.id"
              >
                <MessageCircle size={17} /> Daftar Sebagai Floris
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "8px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0 24px" }}>Pertanyaan yang sering diajukan</h2>
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
        </div>
      </section>
    </div>
  );
}
