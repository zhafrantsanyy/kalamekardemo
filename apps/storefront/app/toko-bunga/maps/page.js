import { MapPin } from "lucide-react";
import { SITE_URL } from "@kalamekar/shared/tokens";
import FloristMapsShell from "@/components/maps/FloristMapsShell";

export const metadata = {
  title: { absolute: "Peta Florist Terdekat | Kalamekar" },
  description:
    "Temukan florist Kalamekar terdekat dari lokasimu di peta interaktif, atau pilih kotamu langsung — Jakarta Selatan, Barat, Timur, Utara, Pusat, dan Bekasi.",
  alternates: { canonical: "/toko-bunga/maps" },
  openGraph: {
    title: "Peta Florist Terdekat | Kalamekar",
    description: "Temukan florist Kalamekar terdekat dari lokasimu langsung di peta.",
    url: `${SITE_URL}/toko-bunga/maps`,
    type: "website",
  },
};

export default function FloristMapsPage() {
  return (
    <div>
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "56px 20px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="rk-eyebrow">
            <MapPin size={13} /> Peta Florist
          </span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4.5vw, 42px)", color: "var(--rk-maroon-deep)", margin: "14px 0 12px" }}>
            Florist Terdekat dari Lokasimu
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680, marginBottom: 8 }}>
            Izinkan akses lokasi supaya peta langsung berpusat di tempatmu dan menonjolkan florist terdekat. Semua
            florist partner tetap tampil di peta — geser atau perbesar untuk melihat wilayah lain, termasuk lima
            wilayah Jakarta dan Bekasi yang sudah kami layani.
          </p>
        </div>
      </section>

      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FloristMapsShell />
        </div>
      </section>
    </div>
  );
}
