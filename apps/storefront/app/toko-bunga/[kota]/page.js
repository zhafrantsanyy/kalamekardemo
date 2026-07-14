import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Route, MessageCircle, ChevronRight } from "lucide-react";
import { BUILDER_URL } from "@/lib/builderUrl";

const CITIES = {
  jakarta: { nama: "Jakarta", provinsi: "DKI Jakarta" },
  bandung: { nama: "Bandung", provinsi: "Jawa Barat" },
  surabaya: { nama: "Surabaya", provinsi: "Jawa Timur" },
  yogyakarta: { nama: "Yogyakarta", provinsi: "DI Yogyakarta" },
  medan: { nama: "Medan", provinsi: "Sumatera Utara" },
};

const KATEGORI = [
  "Hand Bouquet", "Papan Bunga", "Standing Flower", "Bunga Meja", "Parcel & Hampers", "Dekorasi Acara",
];

export function generateStaticParams() {
  return Object.keys(CITIES).map((kota) => ({ kota }));
}

export async function generateMetadata({ params }) {
  const { kota } = await params;
  const city = CITIES[kota];
  if (!city) return {};
  return {
    title: `Toko Bunga di ${city.nama}`,
    description: `Temukan toko bunga & florist lokal terverifikasi di ${city.nama}. Hand bouquet, papan bunga, hingga dekorasi acara — pesan langsung, kirim same-day.`,
    alternates: { canonical: `/toko-bunga/${kota}` },
    openGraph: {
      title: `Toko Bunga di ${city.nama} | Kalamekar`,
      description: `Florist lokal terverifikasi di ${city.nama}, ${city.provinsi} — pesan bunga same-day lewat Kalamekar.`,
      url: `https://kalamekar.id/toko-bunga/${kota}`,
      type: "website",
    },
  };
}

export default async function KotaPage({ params }) {
  const { kota } = await params;
  const city = CITIES[kota];
  if (!city) notFound();

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Toko Bunga di ${city.nama}`,
    url: `https://kalamekar.id/toko-bunga/${kota}`,
    description: `Direktori toko bunga dan florist lokal terverifikasi di ${city.nama}, ${city.provinsi}.`,
    about: {
      "@type": "City",
      name: city.nama,
      containedInPlace: { "@type": "Country", name: "Indonesia" },
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow"><MapPin size={13} /> {city.provinsi}</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Toko Bunga & Florist Terpercaya di {city.nama}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640 }}>
            Kalamekar menghubungkan Anda dengan florist lokal terverifikasi di {city.nama} — dari hand bouquet
            wisuda, papan bunga duka cita, hingga dekorasi pernikahan. Susun sendiri rangkaiannya lewat kanvas
            drag-and-drop kami, atau langsung chat florist pilihan Anda lewat WhatsApp.
          </p>
          <a className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 24, textDecoration: "none" }} href={BUILDER_URL}>
            Mulai Merangkai Bunga
          </a>
        </div>
      </section>

      <section style={{ padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
            Kategori bunga populer di {city.nama}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {KATEGORI.map((k) => (
              <a key={k} href={BUILDER_URL} className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }}>
                {k} <ChevronRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          <div>
            <ShieldCheck size={22} color="var(--rk-maroon)" />
            <h3 className="rk-serif" style={{ fontSize: 17, margin: "10px 0 4px", color: "var(--rk-ink)" }}>Florist terverifikasi</h3>
            <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>
              Setiap florist di {city.nama} dikurasi tim kami — alamat nyata, galeri asli, tanpa foto curian.
            </p>
          </div>
          <div>
            <Route size={22} color="var(--rk-maroon)" />
            <h3 className="rk-serif" style={{ fontSize: 17, margin: "10px 0 4px", color: "var(--rk-ink)" }}>Pengiriman same-day</h3>
            <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>
              Pesan sebelum jam 3 sore, bunga tiba di hari yang sama di area {city.nama}.
            </p>
          </div>
          <div>
            <MessageCircle size={22} color="var(--rk-maroon)" />
            <h3 className="rk-serif" style={{ fontSize: 17, margin: "10px 0 4px", color: "var(--rk-ink)" }}>Chat langsung floris</h3>
            <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>
              Diskusikan rangkaian, warna, dan kartu ucapan langsung dengan florist di {city.nama} via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", marginBottom: 16 }}>
            Cari kota lain yang sudah terjangkau Kalamekar?
          </p>
          <Link href="/" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700 }}>
            Lihat semua kota di beranda →
          </Link>
        </div>
      </section>
    </div>
  );
}
