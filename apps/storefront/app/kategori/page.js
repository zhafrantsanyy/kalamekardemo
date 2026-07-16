import Link from "next/link";
import { Flower2, Heart, Sparkles, Leaf, ShoppingBag, Gem, ChevronRight } from "lucide-react";

export const metadata = {
  title: { absolute: "Kategori Produk Bunga — Buket, Papan Bunga, Standing Flower | Kalamekar" },
  description:
    "Jelajahi berbagai jenis rangkaian bunga: buket, papan bunga, standing flower, dan lainnya. Temukan yang cocok untuk momenmu.",
  alternates: { canonical: "/kategori" },
  openGraph: {
    title: "Kategori Produk Bunga — Buket, Papan Bunga, Standing Flower | Kalamekar",
    description:
      "Jelajahi berbagai jenis rangkaian bunga: buket, papan bunga, standing flower, dan lainnya. Temukan yang cocok untuk momenmu.",
    url: "https://kalamekar.id/kategori",
    type: "website",
  },
};

const CATEGORIES = [
  {
    id: "buket-bunga",
    nama: "Buket Bunga",
    icon: Flower2,
    desc: "Rangkaian genggam untuk hadiah personal — ulang tahun, anniversary, hingga permintaan maaf. Tersedia dari buket mini satu genggam sampai buket besar dengan bunga premium seperti mawar dan lily, jadi bisa disesuaikan dengan budget dan momennya.",
    links: [],
  },
  {
    id: "papan-bunga",
    nama: "Papan Bunga",
    icon: Heart,
    desc: "Standing besar untuk acara formal — grand opening, pernikahan, hingga duka cita. Ukurannya mencolok dan biasanya dipajang di lokasi acara, dengan papan ucapan yang bisa ditulis sesuai kebutuhan pengirim.",
    links: [
      { nama: "Grand Opening", href: "/papan-bunga-grand-opening" },
      { nama: "Pernikahan", href: "/papan-bunga-pernikahan" },
      { nama: "Duka Cita", href: "/bunga-duka-cita" },
    ],
  },
  {
    id: "standing-flower",
    nama: "Standing Flower",
    icon: Sparkles,
    desc: "Mirip papan bunga, tapi framingnya lebih ke dekorasi acara atau booth — cocok untuk mempercantik area resepsi, panggung, atau titik foto di acara kamu. Bentuknya lebih fleksibel dan sering dipadukan dengan elemen dekorasi lain.",
    links: [],
  },
  {
    id: "bunga-meja",
    nama: "Bunga Meja",
    icon: Leaf,
    desc: "Rangkaian dalam vas untuk kantor, meja resepsi, atau acara indoor. Ukurannya ringkas, dirancang supaya tetap terlihat rapi di ruangan tanpa memakan banyak tempat, dan cocok untuk penggunaan jangka pendek maupun dekorasi rutin.",
    links: [],
  },
  {
    id: "parcel-bunga",
    nama: "Parcel Bunga",
    icon: ShoppingBag,
    desc: "Kombinasi bunga dengan hampers atau hadiah lain seperti cokelat, kue, atau perawatan diri. Pilihan pas untuk hari raya, ucapan terima kasih, atau kado yang terasa lebih lengkap dibanding buket biasa.",
    links: [],
  },
  {
    id: "bunga-artificial",
    nama: "Bunga Artificial",
    icon: Gem,
    desc: "Opsi bunga tahan lama untuk dekorasi permanen — cocok untuk interior rumah, kantor, atau etalase toko yang ingin tampil segar tanpa perlu perawatan dan penggantian rutin seperti bunga segar.",
    links: [],
  },
];

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Kategori Produk Bunga",
  url: "https://kalamekar.id/kategori",
  description: "Jenis-jenis rangkaian bunga yang tersedia di Kalamekar.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: "https://kalamekar.id/" },
    { "@type": "ListItem", position: 2, name: "Kategori", item: "https://kalamekar.id/kategori" },
  ],
};

export default function KategoriPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><Flower2 size={13} /> Jenis Rangkaian</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Kategori Produk Bunga
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Cari berdasarkan jenis rangkaian yang kamu inginkan — dari buket genggam sampai standing flower
            berukuran besar. Setiap kategori punya karakter dan kegunaan sendiri, jadi kamu bisa langsung
            menyaring pilihan sesuai kebutuhan. Kalau kamu justru sudah tahu acaranya tapi belum tahu bentuk
            rangkaiannya, lihat berdasarkan momen di halaman inspirasi kami.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {CATEGORIES.map((c) => (
            <div key={c.id} id={c.id} className="rk-card" style={{ padding: 24, scrollMarginTop: 90 }}>
              <span className="rk-cat-icon"><c.icon size={20} color="var(--rk-maroon)" /></span>
              <h2 className="rk-serif" style={{ fontSize: 19, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 8 }}>{c.nama}</h2>
              <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.6 }}>{c.desc}</p>
              {c.links.length > 0 && (
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {c.links.map((l) => (
                    <Link key={l.href} href={l.href} className="rk-link-chip rk-link-chip-active" style={{ fontSize: 12.5, padding: "6px 12px" }}>
                      {l.nama} <ChevronRight size={12} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--rk-cream)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--rk-ink-soft)", marginBottom: 4 }}>
            Cari berdasarkan acara atau momen tertentu?
          </p>
          <Link href="/momen" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
            Jelajahi Moments →
          </Link>
        </div>
      </section>
    </div>
  );
}
