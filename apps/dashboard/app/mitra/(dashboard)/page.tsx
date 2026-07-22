import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@kalamekar/shared/catalog";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

const IN_PROGRESS_STATUSES = ["dikonfirmasi", "dirakit", "diantar"];
const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Ringkasan pakai agregasi langsung dari `orders` (tanggal pengiriman
// sebagai proksi, karena tidak ada kolom completed_at terpisah — lihat
// catatan gap di laporan Fase 0/4). Momen Terlaris & Performa (tingkat
// terima, respon rata-rata) sengaja di-skip: butuh relasi order->momen dan
// tracking waktu respon yang belum ada di skema, sesuai keputusan Fase 0.
export default async function MitraRingkasanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id, rating").eq("user_id", user.id).maybeSingle()
    : { data: null };

  const { data: orders } = floris
    ? await supabase
        .from("orders")
        .select("id, kode, nama, tanggal, status, subtotal, harga_final, mode, ukuran, product_type")
        .eq("floris_id", floris.id)
        .order("tanggal", { ascending: false })
        .limit(500)
    : { data: [] };

  const list = orders || [];
  const today = isoDate(new Date());
  const month = today.slice(0, 7);

  const todayCount = list.filter((o) => o.tanggal === today).length;
  const inProgressCount = list.filter((o) => IN_PROGRESS_STATUSES.includes(o.status)).length;
  const doneMonth = list.filter((o) => o.status === "selesai" && o.tanggal?.startsWith(month));
  const revenue = doneMonth.reduce((sum, o) => sum + (o.harga_final ?? o.subtotal ?? 0), 0);

  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = isoDate(d);
    const count = list.filter((o) => o.tanggal === iso).length;
    return { label: DAY_LABELS[d.getDay()], count };
  });
  const maxTrend = Math.max(1, ...trend.map((t) => t.count));

  const urgentOrders = list.filter((o) => o.tanggal === today && o.status !== "selesai" && o.status !== "batal").slice(0, 5);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Pesanan hari ini</div>
          <div className="dm-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{todayCount}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Sedang dikerjakan</div>
          <div className="dm-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{inProgressCount}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-ink-soft)" }}>Selesai bulan ini</div>
          <div className="dm-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{doneMonth.length}</div>
          {floris?.rating != null && (
            <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", marginTop: 4, fontWeight: 600 }}>Rating {Number(floris.rating).toFixed(1)}</div>
          )}
        </Card>
        <Card style={{ padding: 18, background: "var(--dm-forest)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dm-sidebar-fg-soft)" }}>Pendapatan bulan ini</div>
          <div className="dm-serif" style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 6 }}>{rupiah(revenue)}</div>
          <div style={{ fontSize: 11.5, color: "var(--dm-gold)", marginTop: 4, fontWeight: 600 }}>Sebelum komisi platform</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span>Tren Pesanan · 7 Hari Terakhir</span>
            <span style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", fontWeight: 600 }}>Total {trend.reduce((s, t) => s + t.count, 0)} pesanan</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140, padding: "0 4px" }}>
            {trend.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--dm-forest)" }}>{d.count}</div>
                <div style={{ width: "100%", maxWidth: 30, borderRadius: "6px 6px 0 0", background: "linear-gradient(180deg, var(--dm-badge-avatar), var(--dm-magenta))", height: `${Math.max(6, Math.round((d.count / maxTrend) * 100))}px` }} />
                <div style={{ fontSize: 10.5, color: "var(--dm-ink-soft)", fontWeight: 600 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 10 }}>Momen Terlaris</div>
          <div style={{ fontSize: 12.5, color: "var(--dm-ink-soft)", lineHeight: 1.5 }}>
            Belum tersedia — butuh relasi order ke kategori momen yang belum ada di skema saat ini.
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--dm-line)" }}>
            <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 10, fontSize: 13.5 }}>Performa</div>
            <div style={{ fontSize: 12.5, color: "var(--dm-ink-soft)", lineHeight: 1.5 }}>
              Tingkat terima & respon rata-rata belum tersedia — butuh tracking waktu respon yang belum dibangun.
            </div>
          </div>
        </Card>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 12 }}>Perlu Perhatian Segera</div>
        {urgentOrders.length === 0 ? (
          <EmptyState message="Tidak ada order dengan tenggat hari ini." />
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {urgentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/mitra/pesanan/${o.id}`}
                style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "var(--dm-status-matching-bg)", border: "1px solid #f0dcb0", flexWrap: "wrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "var(--dm-gold)", color: "var(--dm-forest)", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, textTransform: "uppercase" }}>Kirim Hari Ini</span>
                  <span style={{ fontWeight: 800, color: "var(--dm-forest)", fontSize: 13.5 }}>{o.kode}</span>
                  <span style={{ fontSize: 12.5, color: "var(--dm-ink-soft)" }}>{o.mode === "bouquet" ? "Buket" : o.mode === "wreath" ? "Krans" : o.product_type} · {o.nama}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-status-matching-fg)" }}>Lihat →</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
