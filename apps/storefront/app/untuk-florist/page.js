import Link from "next/link";
import { Store, Users, Wallet, Headset, MapPinned, ClipboardCheck, Rocket, MessageCircle } from "lucide-react";
import { WA_NUMBER } from "@kalamekar/shared/tokens";

export const metadata = {
  title: { absolute: "Jadi Mitra Florist Kalamekar — Jangkau Pelanggan Baru" },
  description:
    "Daftarkan toko bunga Anda di Kalamekar dan jangkau lebih banyak pelanggan. Gratis, mudah, dan didampingi tim kami.",
  alternates: { canonical: "/untuk-florist" },
  openGraph: {
    title: "Jadi Mitra Florist Kalamekar — Jangkau Pelanggan Baru",
    description:
      "Daftarkan toko bunga Anda di Kalamekar dan jangkau lebih banyak pelanggan. Gratis, mudah, dan didampingi tim kami.",
    url: "https://kalamekar.id/untuk-florist",
    type: "website",
  },
};

const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kalamekar, saya ingin mendaftarkan toko bunga saya sebagai florist partner.")}`;

const KENAPA = [
  [Users, "Jangkauan pelanggan baru", "Dapatkan pembeli baru di kotamu tanpa perlu bangun website atau strategi marketing sendiri — cukup fokus merangkai, kami bantu ditemukan."],
  [Wallet, "Tanpa biaya setup di awal", "Pendaftaran sebagai florist partner tidak dipungut biaya di muka, jadi kamu bisa mencoba dulu tanpa risiko investasi besar."],
  [Headset, "Dibantu tim Kalamekar", "Tim kami mendampingi proses order sebagai concierge — bukan kamu urus semua sendirian, kami bantu memastikan komunikasi dengan pembeli berjalan lancar."],
  [MapPinned, "Terdaftar di direktori kota yang relevan", "Etalase tokomu tayang di halaman direktori kota sesuai lokasi usahamu, jadi ditemukan pembeli yang memang mencari florist di areamu."],
];

const STEPS = [
  [ClipboardCheck, "Daftar", "Isi formulir pendaftaran dengan data toko dan galeri produk terbaikmu."],
  [Store, "Verifikasi", "Tim Kalamekar memverifikasi alamat dan galeri untuk memastikan kualitas direktori tetap terjaga."],
  [MapPinned, "Toko tayang di direktori", "Setelah lolos verifikasi, etalase tokomu tayang di halaman kota yang sesuai dengan lokasimu."],
  [Rocket, "Mulai terima order", "Pembeli menemukan tokomu lewat Kalamekar dan menghubungimu langsung via WhatsApp untuk mulai bertransaksi."],
];

const FAQS = [
  {
    q: "Berapa lama proses verifikasi toko?",
    a: "Umumnya 2–3 hari kerja setelah data dan galeri produk lengkap kami terima.",
  },
  {
    q: "Apakah saya harus punya toko fisik untuk bergabung?",
    a: "Tidak wajib. Yang penting kamu bisa menunjukkan alamat operasional yang jelas dan galeri hasil rangkaian asli untuk proses verifikasi.",
  },
];

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Jadi Mitra Florist Kalamekar",
  url: "https://kalamekar.id/untuk-florist",
  description: "Halaman pendaftaran florist partner Kalamekar.",
};

export default function UntukFloristPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><Store size={13} /> Untuk Florist</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Punya Toko Bunga? Jangkau Pelanggan Baru Lewat Kalamekar
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640, marginBottom: 24 }}>
            Bergabunglah sebagai florist partner dan buka etalase online tanpa biaya setup di awal — kami bantu
            kamu ditemukan pembeli baru di kotamu, dengan pesanan yang masuk langsung ke WhatsApp tokomu.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/untuk-florist/daftar" className="rk-btn rk-btn-primary" style={{ padding: "14px 26px", fontSize: 15, textDecoration: "none" }}>
              Daftar Sekarang
            </Link>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="rk-btn rk-btn-ghost" style={{ padding: "14px 26px", fontSize: 15, textDecoration: "none" }}>
              <MessageCircle size={17} /> Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Kenapa Gabung</span>
          <h2 className="rk-serif" style={{ fontSize: 30, color: "var(--rk-maroon)", margin: "8px 0 28px" }}>Manfaat jadi florist partner</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {KENAPA.map(([Ic, t, d]) => (
              <div key={t} className="rk-card" style={{ padding: 22 }}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Ic size={20} color="var(--rk-maroon)" />
                </span>
                <h3 className="rk-serif" style={{ fontSize: 17, marginBottom: 6, color: "var(--rk-ink)" }}>{t}</h3>
                <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--rk-cream)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>Cara Kerja</span>
          <h2 className="rk-serif" style={{ fontSize: 30, color: "var(--rk-maroon)", margin: "8px 0 28px" }}>Empat langkah jadi florist partner</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {STEPS.map(([Ic, t, d], i) => (
              <div key={t} className="rk-card" style={{ padding: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--rk-teal)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Ic size={20} color="#fff" />
                </div>
                <div className="rk-serif" style={{ fontSize: 12, fontWeight: 700, color: "var(--rk-teal)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>
                  {i + 1}
                </div>
                <div className="rk-serif" style={{ fontSize: 17, fontWeight: 700, color: "var(--rk-maroon)", marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/untuk-florist/daftar" className="rk-btn rk-btn-primary" style={{ padding: "14px 26px", fontSize: 15, textDecoration: "none" }}>
              Daftar Jadi Florist Partner
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: "var(--rk-maroon)" }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon)", margin: "8px 0 20px" }}>Pertanyaan singkat calon florist partner</h2>
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
          <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", marginTop: 20 }}>
            Pertanyaan lain seputar pemesanan dan pembayaran? Lihat <Link href="/faq" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>FAQ lengkap</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
