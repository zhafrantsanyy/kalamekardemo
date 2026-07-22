import Link from "next/link";
import { Search, MessageCircle, CheckCircle2, PackageCheck, Truck } from "lucide-react";
import { BUILDER_URL, SITE_URL } from "@kalamekar/shared/tokens";

export const metadata = {
  title: { absolute: "Cara Pesan Bunga di Kalamekar — Panduan Lengkap" },
  description:
    "Panduan langkah demi langkah memesan bunga di Kalamekar, dari memilih florist sampai bunga terkirim. Mudah lewat WhatsApp.",
  alternates: { canonical: "/cara-pesan" },
  openGraph: {
    title: "Cara Pesan Bunga di Kalamekar — Panduan Lengkap",
    description:
      "Panduan langkah demi langkah memesan bunga di Kalamekar, dari memilih florist sampai bunga terkirim. Mudah lewat WhatsApp.",
    url: `${SITE_URL}/cara-pesan`,
    type: "website",
  },
};

const STEPS = [
  {
    icon: Search,
    t: "Pilih florist di kotamu atau desain buket sendiri",
    d: "Cari florist terverifikasi lewat direktori Toko Bunga, atau kalau kamu sudah punya bayangan sendiri, susun rangkaiannya lewat Bouquet Builder — kanvas drag-and-drop kami.",
  },
  {
    icon: MessageCircle,
    t: "Chat langsung via WhatsApp",
    d: "Setelah menemukan florist atau selesai mendesain buket, hubungi florist atau tim Kalamekar lewat WhatsApp untuk membahas detail pesanan. Di sinilah kamu bisa nego detail rangkaian, tanya rekomendasi, atau menyesuaikan budget — sesuatu yang sulit dilakukan lewat checkout otomatis.",
  },
  {
    icon: CheckCircle2,
    t: "Konfirmasi desain, harga, dan metode pembayaran",
    d: "Florist akan mengonfirmasi detail akhir rangkaian, total harga, serta metode pembayaran yang tersedia. Pastikan alamat dan waktu pengiriman sudah benar sebelum melanjutkan.",
  },
  {
    icon: PackageCheck,
    t: "Florist memproses dan menyiapkan pesananmu",
    d: "Florist mulai merangkai bunga sesuai kesepakatan. Untuk pesanan dengan kartu ucapan atau permintaan khusus, florist biasanya mengirim foto hasil rangkaian sebelum dikirim.",
  },
  {
    icon: Truck,
    t: "Bunga dikirim ke alamat tujuan",
    d: "Kurir florist mengantar bunga ke alamat yang kamu berikan. Kamu bisa memantau status pesanan dengan menghubungi florist langsung via WhatsApp kapan saja.",
  },
];

const FAQS = [
  {
    q: "Berapa lama sebelum acara sebaiknya saya pesan?",
    a: "Untuk pemesanan same-day, chat florist sebelum jam 3 sore di hari yang sama. Untuk acara besar seperti pernikahan atau grand opening yang butuh rangkaian khusus, sebaiknya pesan 3–7 hari sebelumnya supaya florist punya waktu menyiapkan bahan dan desain.",
  },
  {
    q: "Apakah bisa request desain khusus?",
    a: "Bisa. Kamu bisa jelaskan warna, jenis bunga, ukuran, atau tema yang diinginkan langsung ke florist via WhatsApp, atau susun sendiri rangkaiannya lewat Bouquet Builder untuk kontrol penuh atas hasil akhir.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Metode pembayaran mengikuti kebijakan masing-masing florist — umumnya transfer bank, e-wallet, atau QRIS. Florist akan menginformasikan opsi yang tersedia saat konfirmasi pesanan.",
  },
  {
    q: "Bagaimana kalau saya ingin membatalkan pesanan?",
    a: "Hubungi florist atau tim Kalamekar sesegera mungkin via WhatsApp. Karena bunga adalah produk segar yang mulai disiapkan setelah konfirmasi, pembatalan setelah proses perangkaian dimulai mungkin dikenakan biaya sesuai kebijakan florist terkait.",
  },
  {
    q: "Apakah ada garansi kalau bunga rusak saat pengiriman?",
    a: "Florist partner Kalamekar bertanggung jawab atas kualitas pengiriman. Kalau bunga sampai dalam kondisi rusak, segera foto dan laporkan ke florist atau tim Kalamekar untuk proses penggantian atau kompensasi.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cara Pesan Bunga di Kalamekar",
  description: "Panduan langkah demi langkah memesan bunga di Kalamekar.",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.t,
    text: s.d,
  })),
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

export default function CaraPesanPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><MessageCircle size={13} /> Panduan</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Cara Pesan Bunga di Kalamekar
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Kalamekar sengaja tidak pakai checkout otomatis — semua pesanan dikonfirmasi lewat chat WhatsApp
            langsung dengan florist. Kenapa? Supaya kamu bisa nego detail, tanya rekomendasi, dan pastikan
            hasilnya sesuai sebelum florist mulai merangkai. Berikut lima langkah memesannya.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 20px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 20 }}>
          {STEPS.map((s, i) => (
            <div key={s.t} className="rk-card" style={{ padding: 24, display: "flex", gap: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--rk-teal)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={20} color="#fff" />
              </div>
              <div>
                <div className="rk-serif" style={{ fontSize: 12, fontWeight: 700, color: "var(--rk-teal)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>
                  Langkah {i + 1}
                </div>
                <h2 className="rk-serif" style={{ fontSize: 19, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 }}>{s.t}</h2>
                <p style={{ fontSize: 14.5, color: "var(--rk-ink-soft)", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/toko-bunga" className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, textDecoration: "none" }}>
            Cari Florist
          </Link>
          <a href={BUILDER_URL} className="rk-btn rk-btn-ghost" style={{ padding: "13px 24px", fontSize: 14.5, textDecoration: "none" }}>
            Desain Buket Sendiri
          </a>
        </div>
      </section>

      <section style={{ padding: "72px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 30, color: "var(--rk-maroon)", margin: "8px 0 24px" }}>Pertanyaan seputar proses pemesanan</h2>
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
