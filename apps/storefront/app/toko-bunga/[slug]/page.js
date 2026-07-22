import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronRight } from "lucide-react";
import { BUILDER_URL, SITE_URL as BASE_URL } from "@kalamekar/shared/tokens";
import FloristSection from "@/components/FloristSection";
import { KOTA_DATA, KOTA_SLUGS, OCCASION_LINKS } from "@/lib/data/kota";

export function generateStaticParams() {
  return KOTA_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = KOTA_DATA[slug];
  if (!data) return {};
  return {
    title: { absolute: data.metaTitle },
    description: data.metaDescription,
    alternates: { canonical: `/toko-bunga/${slug}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `${BASE_URL}/toko-bunga/${slug}`,
      type: "website",
    },
  };
}

function breadcrumbTrail(data) {
  const trail = [
    { name: "Beranda", href: "/" },
    { name: "Toko Bunga", href: "/toko-bunga" },
  ];
  if (data.tipe === "sub-area") {
    const induk = KOTA_DATA[data.kotaIndukSlug];
    trail.push({ name: induk.nama, href: `/toko-bunga/${induk.slug}` });
  }
  trail.push({ name: data.nama, href: `/toko-bunga/${data.slug}` });
  return trail;
}

export default async function KotaPage({ params }) {
  const { slug } = await params;
  const data = KOTA_DATA[slug];
  if (!data) notFound();

  const isSubArea = data.tipe === "sub-area";
  const induk = isSubArea ? KOTA_DATA[data.kotaIndukSlug] : null;
  const trail = breadcrumbTrail(data);

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.h1,
    url: `${BASE_URL}/toko-bunga/${data.slug}`,
    description: data.metaDescription,
    about: {
      "@type": "City",
      name: data.nama,
      containedInPlace: { "@type": "Country", name: "Indonesia" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${BASE_URL}${t.href}`,
    })),
  };

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map((f) => ({
      "@type": "Question",
      name: f.pertanyaan,
      acceptedAnswer: { "@type": "Answer", text: f.jawaban },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "40px 20px 56px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
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

          <span className="rk-eyebrow"><MapPin size={13} /> {data.provinsi}</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            {data.h1}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            {data.intro}
          </p>
          <a className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 24, textDecoration: "none" }} href={BUILDER_URL}>
            Mulai Merangkai Bunga
          </a>
        </div>
      </section>

      {/* Area cakupan */}
      <section style={{ padding: "8px 20px 56px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
            {data.subAreaSlugs ? "Pilih wilayah Jakarta" : "Area cakupan"}
          </h2>

          {data.subAreaSlugs ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {data.subAreaSlugs.map((s) => {
                const sub = KOTA_DATA[s];
                return (
                  <Link key={s} href={`/toko-bunga/${s}`} className="rk-card" style={{ display: "block", padding: 20, textDecoration: "none" }}>
                    <div className="rk-serif" style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--rk-ink)" }}>
                      <MapPin size={14} color="var(--rk-maroon)" /> {sub.nama}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "var(--rk-maroon)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Lihat florist <ChevronRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : data.areaCakupan.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {data.areaCakupan.map((a) => (
                <span key={a} className="rk-link-chip"><MapPin size={13} /> {a}</span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", maxWidth: 600, lineHeight: 1.6 }}>
              Daftar kecamatan/wilayah cakupan di {data.nama} sedang kami verifikasi bersama tim lapangan supaya
              informasinya akurat. Sementara itu, tanyakan langsung ke florist pilihanmu untuk memastikan area
              layanan mereka.
            </p>
          )}

          {isSubArea && (
            <p style={{ marginTop: 20, fontSize: 14, color: "var(--rk-ink-soft)" }}>
              Cari di wilayah Jakarta lain?{" "}
              <Link href={`/toko-bunga/${induk.slug}`} className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, padding: 0 }}>
                Lihat semua wilayah {induk.nama}
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Florist */}
      <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
            Florist di {data.nama}
          </h2>
          <FloristSection cityName={data.nama} florists={[]} />
        </div>
      </section>

      {/* Cross-link momen — hanya untuk halaman kota, sub-area cukup arahkan balik ke Jakarta */}
      {!isSubArea && (
        <section style={{ padding: "56px 20px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
              Bunga untuk momen di {data.nama}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {OCCASION_LINKS.map((o) => (
                <Link key={o.href} href={o.href} className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }}>
                  {o.nama} di {data.nama} <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon)", margin: "8px 0 20px" }}>
            Pertanyaan seputar toko bunga {data.nama}
          </h2>
          <div>
            {data.faq.map((f) => (
              <details key={f.pertanyaan} className="rk-faq-item">
                <summary>
                  {f.pertanyaan}
                  <svg className="rk-faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="rk-faq-answer">{f.jawaban}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
