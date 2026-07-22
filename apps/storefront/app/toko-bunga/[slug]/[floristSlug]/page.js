import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronRight, Star, BadgeCheck, MessageCircle, ImageOff } from "lucide-react";
import { SITE_URL as BASE_URL } from "@kalamekar/shared/tokens";
import { KOTA_DATA } from "@/lib/data/kota";
import { createClient } from "@/lib/supabase/public";
import FloristPhotoPlaceholder from "@/components/FloristPhotoPlaceholder";
import TambahKeKeranjangButton from "@/components/toko-bunga/TambahKeKeranjangButton";

export const revalidate = 3600;

async function getFlorist(floristSlug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("florists")
    .select("id, nama, area, deskripsi, wa, rating, kota_slug, slug, foto_url")
    .eq("slug", floristSlug)
    .eq("aktif", true)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function getProdukByFlorist(floristId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("florist_products")
    .select("id, nama, deskripsi, harga, image_url, kategori:florist_product_categories(nama, slug)")
    .eq("florist_id", floristId)
    .eq("aktif", true)
    .order("harga", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function generateMetadata({ params }) {
  const { floristSlug } = await params;
  const florist = await getFlorist(floristSlug);
  if (!florist) return {};

  const kota = KOTA_DATA[florist.kota_slug];
  const title = `${florist.nama} — Toko Bunga ${kota?.nama || florist.area} | Kalamekar`;
  const description =
    florist.deskripsi || `Pesan bunga dari ${florist.nama} di ${kota?.nama || florist.area}, langsung lewat WhatsApp.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/toko-bunga/${florist.kota_slug}/${florist.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function FloristProfilePage({ params }) {
  const { slug, floristSlug } = await params;
  const florist = await getFlorist(floristSlug);
  if (!florist || florist.kota_slug !== slug) notFound();

  const kota = KOTA_DATA[florist.kota_slug];
  const produk = await getProdukByFlorist(florist.id);

  const produkPerKategori = produk.reduce((acc, p) => {
    const nama = p.kategori?.nama || "Lainnya";
    (acc[nama] ||= []).push(p);
    return acc;
  }, {});

  const waHref = florist.wa
    ? `https://wa.me/${florist.wa}?text=${encodeURIComponent(`Halo ${florist.nama}, saya mau pesan bunga lewat Kalamekar.`)}`
    : null;

  const trail = [
    { name: "Beranda", href: "/" },
    { name: "Toko Bunga", href: "/toko-bunga" },
    { name: kota?.nama || florist.area, href: `/toko-bunga/${florist.kota_slug}` },
    { name: florist.nama, href: `/toko-bunga/${florist.kota_slug}/${florist.slug}` },
  ];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "FloristShop",
    name: florist.nama,
    ...(florist.deskripsi ? { description: florist.deskripsi } : {}),
    address: { "@type": "PostalAddress", addressLocality: florist.area, addressCountry: "ID" },
    ...(florist.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: florist.rating, bestRating: 5 } } : {}),
    url: `${BASE_URL}/toko-bunga/${florist.kota_slug}/${florist.slug}`,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "40px 20px 48px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ height: 200, borderRadius: 20, overflow: "hidden", position: "relative", marginBottom: 24 }}>
            {florist.foto_url ? (
              <img src={florist.foto_url} alt={florist.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <FloristPhotoPlaceholder />
            )}
          </div>

          <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", fontSize: 13, color: "var(--rk-ink-soft)", marginBottom: 20 }}>
            {trail.map((t, i) => (
              <span key={t.href} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <ChevronRight size={12} />}
                {i === trail.length - 1 ? (
                  <span style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>{t.name}</span>
                ) : (
                  <Link href={t.href} className="rk-navlink rk-navlink-onlight" style={{ padding: 0 }}>{t.name}</Link>
                )}
              </span>
            ))}
          </nav>

          <span className="rk-eyebrow"><BadgeCheck size={13} /> Florist Terverifikasi</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "var(--rk-maroon-deep)", margin: "14px 0 10px" }}>
            {florist.nama}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 14, color: "var(--rk-ink-soft)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={14} /> {florist.area}</span>
            {florist.rating && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "var(--rk-ink)" }}>
                <Star size={14} fill="var(--rk-gold)" color="var(--rk-gold)" /> {florist.rating}
              </span>
            )}
          </div>
          {florist.deskripsi && (
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640, marginTop: 16 }}>
              {florist.deskripsi}
            </p>
          )}
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 22, textDecoration: "none", display: "inline-flex" }}>
              <MessageCircle size={16} /> Chat via WhatsApp
            </a>
          )}
        </div>
      </section>

      <section style={{ padding: "8px 20px 72px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 22 }}>
            Produk {florist.nama}
          </h2>

          {produk.length === 0 ? (
            <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--rk-ink-soft)" }}>Katalog produk floris ini sedang dilengkapi.</p>
            </div>
          ) : (
            Object.entries(produkPerKategori).map(([kategoriNama, items]) => (
              <div key={kategoriNama} style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 14 }}>{kategoriNama}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {items.map((p) => (
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
                        <TambahKeKeranjangButton productId={p.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
