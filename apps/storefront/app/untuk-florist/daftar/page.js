import Link from "next/link";
import { Store } from "lucide-react";
import { SITE_URL } from "@kalamekar/shared/tokens";
import FloristDaftarForm from "@/components/FloristDaftarForm";

export const metadata = {
  title: { absolute: "Daftar Florist Partner — Kalamekar" },
  description: "Isi formulir pendaftaran florist partner Kalamekar. Gratis, mudah, dan diverifikasi tim kami dalam 2-3 hari kerja.",
  alternates: { canonical: "/untuk-florist/daftar" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Daftar Florist Partner — Kalamekar",
    description: "Isi formulir pendaftaran florist partner Kalamekar. Gratis, mudah, dan diverifikasi tim kami dalam 2-3 hari kerja.",
    url: `${SITE_URL}/untuk-florist/daftar`,
    type: "website",
  },
};

export default function DaftarFloristPage() {
  return (
    <div style={{ padding: "56px 20px 80px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto 32px", textAlign: "center" }}>
        <span className="rk-eyebrow"><Store size={13} /> Daftar Florist Partner</span>
        <h1 className="rk-serif" style={{ fontSize: "clamp(26px, 4vw, 34px)", color: "var(--rk-maroon-deep)", margin: "14px 0 12px" }}>
          Isi Data Tokomu untuk Bergabung
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--rk-ink-soft)" }}>
          Lengkapi formulir di bawah ini. Tim kami akan meninjau dan menghubungimu lewat WhatsApp setelah proses
          verifikasi selesai. Cari tahu lebih dulu{" "}
          <Link href="/untuk-florist" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>
            keuntungan jadi florist partner
          </Link>
          .
        </p>
      </div>

      <FloristDaftarForm />
    </div>
  );
}
