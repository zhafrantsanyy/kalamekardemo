import { Store, Wand2, Truck, ShieldCheck } from "lucide-react";
import { BUILDER_URL } from "@/lib/builderUrl";

export const metadata = {
  title: "Papan Bunga Grand Opening",
  description:
    "Pesan papan bunga ucapan grand opening lewat kanvas drag-and-drop Kalamekar. Susun sendiri ukuran dan teks ucapan, floris lokal merakit dan mengirim di hari yang sama.",
  alternates: { canonical: "/papan-bunga-grand-opening" },
  openGraph: {
    title: "Papan Bunga Grand Opening | Kalamekar",
    description:
      "Papan bunga ucapan grand opening custom, dirakit floris lokal terverifikasi, dikirim same-day ke lokasi acara.",
    url: "https://kalamekar.id/papan-bunga-grand-opening",
    type: "website",
  },
};

const KEUNGGULAN = [
  [Wand2, "Ucapan sesuai keinginan", "Tentukan ukuran krans, warna bunga, dan teks ucapan lewat kanvas rangkai kami — harga terhitung real-time."],
  [ShieldCheck, "Dirakit floris lokal", "Papan bunga dirakit tangan oleh florist partner terverifikasi terdekat dari lokasi acara."],
  [Truck, "Kirim same-day", "Pesan sebelum jam 3 sore, papan bunga tiba tepat waktu di hari pembukaan usaha."],
];

export default function PapanBungaGrandOpeningPage() {
  return (
    <div>
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><Store size={13} /> Momen Grand Opening</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Papan Bunga Grand Opening, Kirim Hari Ini
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640 }}>
            Rayakan pembukaan usaha rekan atau klien dengan papan bunga ucapan yang disusun sendiri — pilih
            ukuran, warna bunga, dan teks ucapan lewat kanvas drag-and-drop Kalamekar. Floris lokal terdekat
            merakit dan mengantarnya tepat waktu ke lokasi acara.
          </p>
          <a className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 24, textDecoration: "none" }} href={BUILDER_URL}>
            Rangkai Papan Bunga
          </a>
        </div>
      </section>

      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {KEUNGGULAN.map(([Ic, t, d]) => (
            <div key={t} className="rk-card" style={{ padding: 24 }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Ic size={20} color="var(--rk-maroon)" />
              </span>
              <h2 className="rk-serif" style={{ fontSize: 17.5, marginBottom: 6, color: "var(--rk-ink)" }}>{t}</h2>
              <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
