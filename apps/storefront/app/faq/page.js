import { HelpCircle } from "lucide-react";

export const metadata = {
  title: { absolute: "FAQ — Pertanyaan Umum Seputar Kalamekar" },
  description:
    "Jawaban atas pertanyaan umum seputar pemesanan, pengiriman, pembayaran, dan menjadi florist partner di Kalamekar.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Pertanyaan Umum Seputar Kalamekar",
    description:
      "Jawaban atas pertanyaan umum seputar pemesanan, pengiriman, pembayaran, dan menjadi florist partner di Kalamekar.",
    url: "https://kalamekar.id/faq",
    type: "website",
  },
};

const GROUPS = [
  {
    h2: "Pemesanan",
    items: [
      {
        q: "Bagaimana cara memesan bunga di Kalamekar?",
        a: "Cari florist di kotamu lewat direktori Toko Bunga, atau desain buketmu sendiri lewat Bouquet Builder. Setelah itu, hubungi florist atau tim Kalamekar via WhatsApp untuk konfirmasi detail, harga, dan pembayaran.",
      },
      {
        q: "Apakah saya perlu membuat akun untuk memesan?",
        a: "Tidak. Kalamekar sengaja tidak mewajibkan akun atau checkout otomatis — semua pemesanan dikonfirmasi langsung lewat chat WhatsApp dengan florist, supaya prosesnya lebih personal dan fleksibel.",
      },
    ],
  },
  {
    h2: "Pengiriman",
    items: [
      {
        q: "Kota mana saja yang sudah dijangkau Kalamekar?",
        a: "Kalamekar sudah menjangkau 25+ kota di Indonesia, termasuk Jakarta, Surabaya, Bandung, Medan, Semarang, Yogyakarta, dan Makassar — dan terus bertambah setiap bulan. Cek daftar lengkapnya di halaman Toko Bunga.",
      },
      {
        q: "Berapa lama waktu pengiriman?",
        a: "Sebagian besar florist partner melayani pengiriman same-day untuk pemesanan sebelum jam 3 sore. Untuk kota atau rangkaian tertentu yang butuh persiapan lebih lama, florist akan menginformasikan estimasi waktunya saat konfirmasi.",
      },
    ],
  },
  {
    h2: "Pembayaran",
    items: [
      {
        q: "Metode pembayaran apa saja yang didukung?",
        a: "Metode pembayaran mengikuti kebijakan masing-masing florist, umumnya transfer bank, e-wallet, atau QRIS. Florist akan menyampaikan opsi yang tersedia saat kamu konfirmasi pesanan via WhatsApp.",
      },
      {
        q: "Apakah harga yang tertera sudah termasuk ongkir?",
        a: "Tidak selalu — tergantung florist dan jarak pengirimannya. Florist akan menyampaikan rincian harga produk dan ongkos kirim secara terpisah dan transparan sebelum kamu mengonfirmasi pesanan.",
      },
    ],
  },
  {
    h2: "Untuk florist",
    items: [
      {
        q: "Bagaimana cara mendaftarkan toko bunga saya di Kalamekar?",
        a: "Kunjungi halaman Untuk Florist dan ikuti langkah pendaftarannya, atau hubungi tim kami langsung via WhatsApp. Tim Kalamekar akan memverifikasi toko sebelum etalasemu tayang di direktori.",
      },
      {
        q: "Apakah ada biaya untuk bergabung sebagai florist partner?",
        a: "Pendaftaran sebagai florist partner tidak dipungut biaya di awal. Detail model kerja sama akan dijelaskan tim Kalamekar saat proses verifikasi berlangsung.",
      },
    ],
  },
];

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) =>
    g.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><HelpCircle size={13} /> FAQ</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Pertanyaan Umum Seputar Kalamekar
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Kumpulan pertanyaan yang paling sering ditanyakan seputar pemesanan, pengiriman, pembayaran, dan
            menjadi florist partner di Kalamekar.
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {GROUPS.map((g) => (
            <div key={g.h2} style={{ marginBottom: 40 }}>
              <h2 className="rk-serif" style={{ fontSize: 24, color: "var(--rk-maroon)", marginBottom: 8 }}>{g.h2}</h2>
              <div>
                {g.items.map((f) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}
