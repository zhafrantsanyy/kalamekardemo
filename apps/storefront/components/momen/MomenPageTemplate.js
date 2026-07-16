import Link from "next/link";
import { ChevronRight, Check, MapPin } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";
import { LIVE_KOTA_SLUGS, KOTA_DATA } from "@/lib/data/kota";

const BASE_URL = "https://kalamekar.id";

const KELOMPOK_LABEL = {
  personal: "Momen Personal",
  formal: "Papan Bunga & Acara Formal",
  "duka-cita": "Duka Cita & Religi",
  korporat: "Kebutuhan Korporat",
};

export default function MomenPageTemplate({ data }) {
  const trail = [
    { name: "Beranda", href: "/" },
    { name: "Moments", href: "/momen" },
    { name: data.nama, href: `/${data.slug}` },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: data.h1,
    name: data.h1,
    description: data.metaDescription,
    provider: { "@type": "Organization", name: "Kalamekar", url: BASE_URL },
    areaServed: { "@type": "Country", name: "Indonesia" },
    url: `${BASE_URL}/${data.slug}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "40px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
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

          <span className="rk-eyebrow">{KELOMPOK_LABEL[data.kelompok]}</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            {data.h1}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            {data.intro}
          </p>
          <a className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 24, textDecoration: "none" }} href={BUILDER_URL}>
            Mulai Rangkai {data.nama}
          </a>
        </div>
      </section>

      {/* Kenapa pilih */}
      <section style={{ padding: "8px 20px 56px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
            Kenapa pilih Kalamekar
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {data.kenapaPilihIni.map((k) => (
              <div key={k} className="rk-card" style={{ padding: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Check size={18} style={{ color: "var(--rk-maroon)", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 14, color: "var(--rk-ink)", lineHeight: 1.55, margin: 0 }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jenis rangkaian, atau mini-hub kalau tidak ada produk spesifik */}
      {data.jenisRangkaian.length > 0 ? (
        <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
              Pilihan rangkaian
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
              {data.jenisRangkaian.map((j) => (
                <Link key={j.nama} href={j.linkKategori} className="rk-card" style={{ display: "block", padding: 18, textDecoration: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, color: "var(--rk-ink)" }} className="rk-serif">
                    {j.nama} <ChevronRight size={14} color="var(--rk-maroon)" />
                  </div>
                  <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{j.deskripsi}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : data.miniHubLinks && data.miniHubLinks.length > 0 ? (
        <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
              Kebutuhan spesifik perusahaanmu
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
              {data.miniHubLinks.map((l) => (
                <Link key={l.href} href={l.href} className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }}>
                  {l.nama} <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Tersedia di kotamu */}
      <section style={{ padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>
            Tersedia di kotamu
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {LIVE_KOTA_SLUGS.map((slug) => (
              <Link key={slug} href={`/toko-bunga/${slug}`} className="rk-link-chip rk-link-chip-active">
                <MapPin size={13} /> {KOTA_DATA[slug].nama}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "8px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon)", margin: "8px 0 20px" }}>
            Pertanyaan seputar {data.nama.toLowerCase()}
          </h2>
          <div>
            {data.faq.map((f) => (
              <details key={f.pertanyaan} className="rk-faq-item">
                <summary>
                  {f.pertanyaan}
                  <svg className="rk-faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="rk-faq-answer">{f.jawaban}</p>
                {f.link && (
                  <p className="rk-faq-answer" style={{ paddingTop: 0, marginTop: -14 }}>
                    <Link href={f.link.href} style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>{f.link.label} →</Link>
                  </p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
