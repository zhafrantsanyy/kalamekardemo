import Link from "next/link";
import { Flower2, ChevronRight } from "lucide-react";
import { SITE_URL } from "@kalamekar/shared/tokens";
import { KATEGORI_LIST } from "@/lib/data/kategori";

export const metadata = {
  title: { absolute: "Kategori Produk Bunga — Buket, Papan Bunga, Standing Flower | Kalamekar" },
  description:
    "Jelajahi berbagai jenis rangkaian bunga: buket, papan bunga, standing flower, dan lainnya. Temukan yang cocok untuk momenmu.",
  alternates: { canonical: "/kategori" },
  openGraph: {
    title: "Kategori Produk Bunga — Buket, Papan Bunga, Standing Flower | Kalamekar",
    description:
      "Jelajahi berbagai jenis rangkaian bunga: buket, papan bunga, standing flower, dan lainnya. Temukan yang cocok untuk momenmu.",
    url: `${SITE_URL}/kategori`,
    type: "website",
  },
};

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Kategori Produk Bunga",
  url: `${SITE_URL}/kategori`,
  description: "Jenis-jenis rangkaian bunga yang tersedia di Kalamekar.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Kategori", item: `${SITE_URL}/kategori` },
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
          {KATEGORI_LIST.map((c) => (
            <div key={c.id} id={c.id} className="rk-card" style={{ padding: 24, scrollMarginTop: 90 }}>
              <span className="rk-cat-icon"><c.icon size={20} color="var(--rk-maroon)" /></span>
              <h2 className="rk-serif" style={{ fontSize: 19, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 8 }}>{c.nama}</h2>
              <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.6 }}>{c.desc}</p>
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Link href={`/kategori/${c.id}`} className="rk-link-chip rk-link-chip-active" style={{ fontSize: 12.5, padding: "6px 12px" }}>
                  Lihat Produk <ChevronRight size={12} />
                </Link>
                {c.links.map((l) => (
                  <Link key={l.href} href={l.href} className="rk-link-chip rk-link-chip-active" style={{ fontSize: 12.5, padding: "6px 12px" }}>
                    {l.nama} <ChevronRight size={12} />
                  </Link>
                ))}
              </div>
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
