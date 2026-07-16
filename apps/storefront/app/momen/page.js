import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export const metadata = {
  title: { absolute: "Moments — Bunga untuk Setiap Momen | Kalamekar" },
  description:
    "Dari wisuda sampai grand opening, temukan rangkaian bunga yang pas untuk momenmu. Jelajahi inspirasi berdasarkan acara.",
  alternates: { canonical: "/momen" },
  openGraph: {
    title: "Moments — Bunga untuk Setiap Momen | Kalamekar",
    description:
      "Dari wisuda sampai grand opening, temukan rangkaian bunga yang pas untuk momenmu. Jelajahi inspirasi berdasarkan acara.",
    url: "https://kalamekar.id/momen",
    type: "website",
  },
};

// Pengelompokan di bawah ini murni untuk tampilan hub (supaya pasangan momen yang
// mirip terlihat berdekatan) — beda dengan field `kelompok` di lib/data/momen.js
// yang jadi kategori data resminya (dipakai untuk sitemap priority, dst).
const GROUPS = [
  {
    h2: "Momen personal",
    intro: "Rangkaian yang membuat perayaan pribadi terasa lebih berkesan.",
    items: [
      { nama: "Bunga Wisuda", desc: "Rayakan pencapaian dengan rangkaian yang berkesan.", href: "/bunga-wisuda" },
      { nama: "Bunga Ulang Tahun", desc: "Buket yang bikin hari spesialnya makin meriah.", href: "/bunga-ulang-tahun" },
      { nama: "Papan Bunga Ulang Tahun", desc: "Versi lebih besar dan meriah, cocok kejutan di kantor.", href: "/papan-bunga-ulang-tahun" },
      { nama: "Bunga Anniversary", desc: "Kenang hari jadi bersama orang tersayang.", href: "/bunga-anniversary" },
      { nama: "Bunga Valentine", desc: "Ungkapkan cinta lewat rangkaian yang romantis.", href: "/bunga-valentine" },
      { nama: "Bunga Hari Ibu", desc: "Ucapan terima kasih untuk ibu tercinta.", href: "/bunga-hari-ibu" },
      { nama: "Bunga Ucapan Selamat", desc: "Rayakan pencapaian teman atau kolega.", href: "/bunga-ucapan-selamat" },
      { nama: "Bunga Cepat Sembuh", desc: "Kirim semangat untuk yang sedang sakit.", href: "/bunga-cepat-sembuh" },
      { nama: "Bunga Permintaan Maaf", desc: "Sampaikan maaf lewat bahasa bunga.", href: "/bunga-permintaan-maaf" },
    ],
  },
  {
    h2: "Acara & formal",
    intro: "Papan bunga dan standing flower untuk acara resmi yang butuh kesan megah.",
    items: [
      { nama: "Papan Bunga Grand Opening", desc: "Sambut pembukaan usaha dengan ucapan sukses.", href: "/papan-bunga-grand-opening" },
      { nama: "Papan Bunga Pernikahan", desc: "Lengkapi dekorasi hari bahagia mempelai.", href: "/papan-bunga-pernikahan" },
      { nama: "Papan Bunga Selamat & Sukses", desc: "Ucapan atas pencapaian atau jabatan baru.", href: "/papan-bunga-selamat-sukses" },
      { nama: "Papan Bunga Anniversary Perusahaan", desc: "Rayakan hari jadi perusahaan secara formal.", href: "/papan-bunga-anniversary-perusahaan" },
    ],
  },
  {
    h2: "Duka cita & religi",
    intro: "Rangkaian yang disusun sopan untuk menyampaikan belasungkawa.",
    items: [
      { nama: "Bunga Duka Cita", desc: "Sampaikan belasungkawa dengan layak.", href: "/bunga-duka-cita" },
      { nama: "Karangan Bunga Duka Cita", desc: "Rangkaian duka cita untuk berbagai kebutuhan acara.", href: "/karangan-bunga-duka-cita" },
      { nama: "Papan Bunga Duka Cita", desc: "Ukuran besar, dikirim cepat ke lokasi acara.", href: "/papan-bunga-duka-cita" },
      { nama: "Bunga Salib Duka", desc: "Karangan berbentuk salib untuk penghormatan terakhir.", href: "/bunga-salib-duka" },
    ],
  },
  {
    h2: "Korporat",
    intro: "Kebutuhan bunga rutin untuk kantor dan perusahaan.",
    items: [
      { nama: "Bunga Kantor", desc: "Percantik ruang kerja dengan rangkaian segar.", href: "/bunga-kantor" },
      { nama: "Bunga Perusahaan", desc: "Kebutuhan bunga untuk kebutuhan resmi perusahaan.", href: "/bunga-perusahaan" },
    ],
  },
];

const FAQS = [
  {
    q: "Bagaimana memilih bunga yang tepat untuk acara tertentu?",
    a: "Sesuaikan dengan sifat acaranya — buket personal untuk momen pribadi seperti ulang tahun, papan bunga untuk acara formal seperti grand opening, atau rangkaian religi untuk upacara duka. Kalau masih bingung, florist di Kalamekar bisa memberi rekomendasi begitu kamu chat lewat WhatsApp.",
  },
  {
    q: "Apakah bisa custom desain sesuai tema acara?",
    a: "Bisa. Sebagian besar florist partner menerima permintaan khusus soal warna, ukuran, dan teks ucapan. Kamu juga bisa mendesain buketmu sendiri lewat Bouquet Builder kalau ingin kontrol penuh atas hasil akhirnya.",
  },
  {
    q: "Momen yang saya cari belum ada di daftar, bagaimana?",
    a: "Daftar momen di halaman ini akan terus bertambah. Sambil menunggu, kamu tetap bisa chat langsung dengan florist pilihanmu dan jelaskan acara yang kamu maksud — florist berpengalaman biasanya sudah terbiasa menangani berbagai jenis permintaan.",
  },
];

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Moments — Bunga untuk Setiap Momen",
  url: "https://kalamekar.id/momen",
  description: "Direktori rangkaian bunga berdasarkan momen dan acara.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: "https://kalamekar.id/" },
    { "@type": "ListItem", position: 2, name: "Moments", item: "https://kalamekar.id/momen" },
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

export default function MomenPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><Sparkles size={13} /> Moments</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Moments — Bunga untuk Setiap Momen
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Alih-alih mencari berdasarkan jenis produk, jelajahi rangkaian bunga berdasarkan acara atau kebutuhanmu.
            Mulai dari bunga wisuda untuk merayakan kelulusan, papan bunga untuk acara formal, sampai rangkaian
            bunga acara duka cita — semua dikelompokkan supaya kamu lebih cepat menemukan yang paling pas untuk
            momenmu.
          </p>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section key={g.h2} style={{ padding: "48px 20px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", marginBottom: 6 }}>{g.h2}</h2>
            <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", marginBottom: 20 }}>{g.intro}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {g.items.map((o) => (
                <Link key={o.href} href={o.href} className="rk-card" style={{ display: "block", padding: 18, textDecoration: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, color: "var(--rk-ink)" }}>
                    {o.nama} <ChevronRight size={14} color="var(--rk-maroon)" />
                  </div>
                  <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{o.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section style={{ background: "var(--rk-cream)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--rk-ink-soft)", marginBottom: 4 }}>
            Cari berdasarkan jenis rangkaian?
          </p>
          <Link href="/kategori" className="rk-navlink rk-navlink-onlight" style={{ fontWeight: 700, color: "var(--rk-maroon)" }}>
            Lihat semua kategori produk →
          </Link>
        </div>
      </section>

      <section style={{ padding: "72px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 30, color: "var(--rk-maroon)", margin: "8px 0 24px" }}>Pertanyaan seputar Moments</h2>
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
