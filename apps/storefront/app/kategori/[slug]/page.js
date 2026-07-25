import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ImageOff } from "lucide-react";
import { SITE_URL } from "@kalamekar/shared/tokens";
import { KATEGORI_LIST } from "@/lib/data/kategori";
import { KOTA_DATA } from "@/lib/data/kota";
import { createClient } from "@/lib/supabase/public";
import TambahKeKeranjangButton from "@/components/toko-bunga/TambahKeKeranjangButton";

export const revalidate = 3600;

function getKategori(slug) {
  return KATEGORI_LIST.find((k) => k.id === slug) || null;
}

async function getProdukByKategori(kategori) {
  if (!kategori.dbSlugs.length) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("florist_products")
    .select(
      "id, nama, deskripsi, harga, image_url, kategori:florist_product_categories!inner(slug), florist:florists(nama, slug, kota_slug)",
    )
    .in("kategori.slug", kategori.dbSlugs)
    .eq("aktif", true)
    .order("harga", { ascending: true });

  if (error || !data) return [];
  return data.filter((p) => p.florist);
}

export async function generateStaticParams() {
  return KATEGORI_LIST.map((k) => ({ slug: k.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const kategori = getKategori(slug);
  if (!kategori) return {};

  const title = `${kategori.nama} — Pesan Online Lewat Florist Terverifikasi | Kalamekar`;
  return {
    title: { absolute: title },
    description: kategori.desc,
    alternates: { canonical: `/kategori/${kategori.id}` },
    openGraph: { title, description: kategori.desc, url: `${SITE_URL}/kategori/${kategori.id}`, type: "website" },
  };
}

export default async function KategoriDetailPage({ params }) {
  const { slug } = await params;
  const kategori = getKategori(slug);
  if (!kategori) notFound();

  const produk = await getProdukByKategori(kategori);
  const Icon = kategori.icon;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Kategori", item: `${SITE_URL}/kategori` },
      { "@type": "ListItem", position: 3, name: kategori.nama, item: `${SITE_URL}/kategori/${kategori.id}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "56px 20px 48px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", fontSize: 13, color: "var(--rk-ink-soft)", marginBottom: 20 }}>
            <Link href="/kategori" className="rk-navlink rk-navlink-onlight" style={{ padding: 0 }}>Kategori</Link>
            <ChevronRight size={12} />
            <span style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>{kategori.nama}</span>
          </nav>

          <span className="rk-eyebrow"><Icon size={13} /> Jenis Rangkaian</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "var(--rk-maroon-deep)", margin: "14px 0 14px" }}>
            {kategori.nama}
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>{kategori.desc}</p>

          {kategori.links.length > 0 && (
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {kategori.links.map((l) => (
                <Link key={l.href} href={l.href} className="rk-link-chip rk-link-chip-active" style={{ fontSize: 12.5, padding: "6px 12px" }}>
                  {l.nama} <ChevronRight size={12} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "8px 20px 72px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 22, color: "var(--rk-maroon)", marginBottom: 22 }}>
            Produk {kategori.nama} dari Florist Kalamekar
          </h2>

          {produk.length === 0 ? (
            <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--rk-ink-soft)" }}>
                Produk kategori ini sedang dilengkapi. Sementara itu, cek etalase florist kami untuk lihat pilihan lainnya.
              </p>
              <Link href="/toko-bunga" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)", marginTop: 10, display: "inline-flex" }}>
                Lihat Semua Toko Bunga →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {produk.map((p) => {
                const kota = KOTA_DATA[p.florist.kota_slug];
                const floristHref = `/toko-bunga/${p.florist.kota_slug}/${p.florist.slug}`;
                return (
                  <div key={p.id} className="rk-card" style={{ overflow: "hidden" }}>
                    <div style={{ height: 140, background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <ImageOff size={26} color="var(--rk-maroon)" />
                      )}
                    </div>
                    <div style={{ padding: 18 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--rk-ink)" }}>{p.nama}</div>
                      {p.deskripsi && (
                        <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{p.deskripsi}</div>
                      )}
                      <div style={{ marginTop: 10, fontWeight: 800, fontSize: 15, color: "var(--rk-maroon)" }}>
                        Rp {p.harga.toLocaleString("id-ID")}
                      </div>
                      <Link href={floristHref} className="rk-navlink rk-navlink-onlight" style={{ padding: 0, fontSize: 12, marginTop: 8, display: "inline-block" }}>
                        oleh {p.florist.nama}{kota ? ` · ${kota.nama}` : ""}
                      </Link>
                      <TambahKeKeranjangButton productId={p.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
