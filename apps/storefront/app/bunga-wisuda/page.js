import { GraduationCap, Wand2, Truck, ShieldCheck } from "lucide-react";
import { BUILDER_URL } from "@/lib/builderUrl";

export const metadata = {
  title: "Bunga Wisuda",
  description:
    "Pesan buket bunga wisuda custom lewat kanvas drag-and-drop Kalamekar. Susun sendiri warna dan gaya, floris lokal merakit dan mengirim di hari yang sama.",
  alternates: { canonical: "/bunga-wisuda" },
  openGraph: {
    title: "Bunga Wisuda | Kalamekar",
    description:
      "Buket bunga wisuda custom, dirakit floris lokal terverifikasi, dikirim same-day ke lokasi wisuda.",
    url: "https://kalamekar.id/bunga-wisuda",
    type: "website",
  },
};

const KEUNGGULAN = [
  [Wand2, "Susun sendiri", "Pilih warna, jenis bunga, dan ukuran buket lewat kanvas drag-and-drop kami — lihat harga real-time."],
  [ShieldCheck, "Dirakit floris lokal", "Setiap buket dirakit tangan oleh florist partner terverifikasi terdekat dari lokasi wisuda."],
  [Truck, "Kirim same-day", "Pesan sebelum jam 3 sore, buket wisuda tiba tepat waktu di hari kelulusan."],
];

export default function BungaWisudaPage() {
  return (
    <div>
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><GraduationCap size={13} /> Momen Wisuda</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Bunga Wisuda, Dirangkai Sesuai Selera
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640 }}>
            Rayakan kelulusan dengan buket bunga wisuda yang disusun sendiri — pilih bunga, warna pita, dan ukuran
            lewat kanvas drag-and-drop Kalamekar. Floris lokal terdekat merakit dan mengantarnya tepat waktu ke
            lokasi wisuda.
          </p>
          <a className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, marginTop: 24, textDecoration: "none" }} href={BUILDER_URL}>
            Rangkai Bunga Wisuda
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
