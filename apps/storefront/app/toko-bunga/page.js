import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { SITE_URL } from "@kalamekar/shared/tokens";
import { LIVE_KOTA_SLUGS } from "@/lib/data/kota";

export const metadata = {
  title: { absolute: "Direktori Toko Bunga di Seluruh Indonesia | Kalamekar" },
  description:
    "Cari toko bunga terverifikasi di kotamu. Dari Jakarta sampai Makassar, pesan mudah lewat WhatsApp dan bunga sampai hari ini juga.",
  alternates: { canonical: "/toko-bunga" },
  openGraph: {
    title: "Direktori Toko Bunga di Seluruh Indonesia | Kalamekar",
    description:
      "Cari toko bunga terverifikasi di kotamu. Dari Jakarta sampai Makassar, pesan mudah lewat WhatsApp dan bunga sampai hari ini juga.",
    url: `${SITE_URL}/toko-bunga`,
    type: "website",
  },
};

const TIER1 = [
  { nama: "Jakarta", slug: "jakarta", desc: "Ibu kota dengan jaringan florist terpadat di Kalamekar — same-day ke hampir seluruh penjuru kota." },
  { nama: "Surabaya", slug: "surabaya", desc: "Pusat florist Jawa Timur, andalan untuk pengiriman ke kawasan industri hingga perumahan." },
  { nama: "Bandung", slug: "bandung", desc: "Florist dengan sentuhan gaya kekinian, favorit untuk buket wisuda dan hampers hadiah." },
  { nama: "Medan", slug: "medan", desc: "Florist Sumatera Utara yang kuat di papan bunga duka cita dan rangkaian acara adat." },
  { nama: "Bekasi", slug: "bekasi", desc: "Florist yang paham rute padat komuter, tetap tepat waktu untuk acara kantor maupun rumah." },
  { nama: "Yogyakarta", slug: "yogyakarta", desc: "Florist dengan sentuhan tradisi Jawa, kuat untuk pernikahan dan acara adat." },
  { nama: "Semarang", slug: "semarang", desc: "Jaringan florist yang terus berkembang, melayani dari kota lama hingga area pesisir." },
  { nama: "Tangerang", slug: "tangerang", desc: "Dekat Jakarta tapi punya florist lokalnya sendiri — cocok untuk pengiriman ke BSD hingga Alam Sutera." },
  { nama: "Depok", slug: "depok", desc: "Florist kawasan kampus dan perumahan, favorit untuk bunga wisuda dan acara kampus." },
  { nama: "Makassar", slug: "makassar", desc: "Pusat florist Indonesia Timur, melayani kota hingga kawasan pelabuhan sekitarnya." },
].map((c) => ({ ...c, live: LIVE_KOTA_SLUGS.includes(c.slug) }));

const TIER2 = [
  "Denpasar", "Palembang", "Malang", "Surakarta (Solo)", "Batam", "Pekanbaru", "Balikpapan",
  "Samarinda", "Manado", "Padang", "Banjarmasin", "Cimahi", "Sidoarjo", "Cirebon", "Serang",
];

const FAQS = [
  {
    q: "Bagaimana cara memilih toko bunga yang tepat?",
    a: "Perhatikan lokasi florist relatif terhadap alamat tujuan pengiriman, galeri hasil rangkaian sebelumnya, dan ulasan pembeli. Kalamekar menampilkan florist terverifikasi per kota supaya kamu bisa membandingkan sebelum memutuskan chat dan pesan.",
  },
  {
    q: "Apakah semua florist di Kalamekar sudah terverifikasi?",
    a: "Ya. Setiap florist yang tayang di direktori Kalamekar melewati proses kurasi — alamat toko yang jelas dan galeri produk asli — sebelum etalasenya bisa dilihat pembeli.",
  },
  {
    q: "Berapa lama waktu pengiriman bunga?",
    a: "Sebagian besar florist partner melayani pengiriman di hari yang sama untuk pemesanan sebelum jam 3 sore, tergantung jarak dan ketersediaan bunga. Estimasi lebih pasti akan disampaikan florist langsung saat kamu chat via WhatsApp.",
  },
  {
    q: "Kotaku belum ada di daftar, bagaimana caranya?",
    a: "Kalamekar terus menambah kota baru setiap bulan. Kamu bisa hubungi tim kami lewat halaman Kontak untuk menanyakan rencana perluasan ke kotamu, atau ajak florist di kotamu untuk mendaftar sebagai partner.",
  },
];

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Direktori Toko Bunga di Seluruh Indonesia",
  url: `${SITE_URL}/toko-bunga`,
  description: "Direktori toko bunga dan florist lokal terverifikasi di kota-kota Indonesia.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Toko Bunga", item: `${SITE_URL}/toko-bunga` },
  ],
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function TokoBungaPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><MapPin size={13} /> Direktori Florist</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Toko Bunga Terpercaya di Kotamu
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Kalamekar menghimpun toko bunga online dan florist lokal yang sudah melewati proses verifikasi tim kami
            — alamat jelas, galeri asli, tanpa foto curian. Setiap kota punya halamannya sendiri, lengkap dengan
            daftar florist terdekat, kategori populer, dan estimasi pengiriman di area tersebut. Setelah menemukan
            florist yang cocok, kamu bisa langsung chat untuk detail rangkaian dan konfirmasi pesanan — tanpa perlu
            bikin akun atau checkout yang ribet. Butuh kirim bunga hari ini juga? Sebagian besar florist partner
            kami melayani pengiriman same-day selama pesanan masuk sebelum jam 3 sore.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 18 }}>Kota-kota utama</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {TIER1.map((c) => c.live ? (
              <Link key={c.slug} href={`/toko-bunga/${c.slug}`} className="rk-card" style={{ display: "block", padding: 22, textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 17, color: "var(--rk-ink)" }} className="rk-serif">
                  <MapPin size={15} color="var(--rk-maroon)" /> {c.nama}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", marginTop: 8, lineHeight: 1.55 }}>{c.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--rk-maroon)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Lihat florist <ChevronRight size={14} />
                </div>
              </Link>
            ) : (
              <div key={c.slug} className="rk-card" style={{ padding: 22, opacity: 0.65 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 17, color: "var(--rk-ink)" }} className="rk-serif">
                    <MapPin size={15} color="var(--rk-ink-soft)" /> {c.nama}
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--rk-ink-soft)", border: "1px solid var(--rk-line)", borderRadius: 999, padding: "3px 9px" }}>
                    Segera hadir
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", marginTop: 8, lineHeight: 1.55 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 8 }}>Kota lainnya</h2>
          <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", marginBottom: 20 }}>
            Kalamekar terus memperluas jangkauan florist ke kota-kota berikut.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {TIER2.map((nama) => (
              <span key={nama} className="rk-link-chip" style={{ justifyContent: "space-between" }}>
                {nama} <span style={{ fontSize: 11 }}>· segera</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "72px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 30, color: "var(--rk-maroon)", margin: "8px 0 24px" }}>Pertanyaan seputar direktori</h2>
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
