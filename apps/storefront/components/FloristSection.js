import Link from "next/link";
import { Star, BadgeCheck, Store, ArrowRight } from "lucide-react";
import FloristPhotoPlaceholder from "@/components/FloristPhotoPlaceholder";

// florists akan datang dari Supabase begitu florist partner per kota tersedia.
// Selama kosong, tampilkan empty state yang jujur + CTA, bukan section kosong.
export default function FloristSection({ cityName, florists = [] }) {
  if (florists.length > 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {florists.map((f) => (
          <Link key={f.id || f.nama} href={f.href} className="rk-florist-card" style={{ textDecoration: "none" }}>
            <div className="rk-florist-photo">
              {f.foto_url ? (
                <img src={f.foto_url} alt={f.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <FloristPhotoPlaceholder />
              )}
              <span className="rk-badge"><BadgeCheck size={12} /> Terverifikasi</span>
            </div>
            <div style={{ padding: 16, textAlign: "left" }}>
              <div className="rk-serif" style={{ fontSize: 16, fontWeight: 700, color: "var(--rk-ink)" }}>{f.nama}</div>
              <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 3 }}>{f.meta}</div>
              {f.rating && (
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Star size={13} fill="var(--rk-gold)" color="var(--rk-gold)" /> {f.rating}
                  {f.ulasan && <span style={{ fontWeight: 400, color: "var(--rk-ink-soft)" }}>({f.ulasan} ulasan)</span>}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="rk-card" style={{ padding: "36px 28px", textAlign: "center" }}>
      <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Store size={21} color="var(--rk-maroon)" />
      </span>
      <p style={{ fontSize: 15, color: "var(--rk-ink)", fontWeight: 700, marginBottom: 6 }}>
        Florist partner di {cityName} akan segera hadir
      </p>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", maxWidth: 440, margin: "0 auto 18px", lineHeight: 1.55 }}>
        Kami sedang mengurasi florist lokal terverifikasi untuk halaman ini. Sambil menunggu, kamu tetap bisa
        mendesain buketmu sendiri lewat Bouquet Builder kami.
      </p>
      <Link href="/untuk-florist" className="rk-btn rk-btn-primary" style={{ padding: "12px 22px", fontSize: 14, textDecoration: "none", display: "inline-flex" }}>
        Punya toko bunga di {cityName}? Jadi florist partner pertama kami di sini <ArrowRight size={15} />
      </Link>
    </div>
  );
}
