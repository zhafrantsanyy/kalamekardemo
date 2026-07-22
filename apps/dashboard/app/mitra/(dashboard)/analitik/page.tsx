import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";

// Rating rata-rata dari florists.rating (kolom agregat yang sudah ada).
// Waktu respon & tingkat penerimaan, serta daftar ulasan per-order, gap
// yang di-skip di Fase 0/4 — butuh tracking waktu respon dan tabel
// reviews yang belum ada di skema.
export default async function MitraAnalitikPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("rating").eq("user_id", user.id).maybeSingle()
    : { data: null };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Rating rata-rata</div>
          <div className="dm-serif" style={{ fontSize: 28, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>
            {floris?.rating != null ? Number(floris.rating).toFixed(1) : "—"} <span style={{ fontSize: 14, color: "var(--dm-gold)" }}>★</span>
          </div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Waktu respon rata-rata</div>
          <div style={{ fontSize: 13, color: "var(--dm-ink-soft)", marginTop: 10 }}>Belum tersedia</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Tingkat penerimaan order</div>
          <div style={{ fontSize: 13, color: "var(--dm-ink-soft)", marginTop: 10 }}>Belum tersedia</div>
        </Card>
      </div>
      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 14 }}>Ulasan Terbaru</div>
        <div style={{ color: "var(--dm-ink-soft)", fontSize: 13, lineHeight: 1.5 }}>
          Belum ada data ulasan — tabel reviews belum dibuat di skema Supabase.
        </div>
      </Card>
    </div>
  );
}
