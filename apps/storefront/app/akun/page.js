import Link from "next/link";
import { PackageSearch, ArrowRight, Sparkles } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import StatusBadge from "@/components/StatusBadge";
import AkunOrderFilterBar from "@/components/akun/AkunOrderFilterBar";
import StatCard from "@/components/akun/StatCard";

const AKTIF_STATUSES = ["baru", "matching", "dikonfirmasi", "dirakit", "diantar"];

export default async function AkunRiwayatPage({ searchParams }) {
  const sp = await searchParams;
  const status = sp?.status || "";
  const group = sp?.group || "";
  const q = (sp?.q || "").trim().toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: allOrders } = await supabase
    .from("orders")
    .select("id, kode, tanggal, total, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = allOrders || [];
  const stats = {
    total: orders.length,
    aktif: orders.filter((o) => AKTIF_STATUSES.includes(o.status)).length,
    selesai: orders.filter((o) => o.status === "selesai").length,
  };

  let filtered = orders;
  if (group === "aktif") filtered = filtered.filter((o) => AKTIF_STATUSES.includes(o.status));
  else if (status) filtered = filtered.filter((o) => o.status === status);
  if (q) filtered = filtered.filter((o) => o.kode.toLowerCase().includes(q));

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <StatCard label="Total pesanan" value={stats.total} href="/akun" active={!status && !group} />
        <StatCard label="Sedang berjalan" value={stats.aktif} href="/akun?group=aktif" active={group === "aktif"} />
        <StatCard label="Selesai" value={stats.selesai} href="/akun?status=selesai" active={status === "selesai"} />
      </div>

      <AkunOrderFilterBar />

      {filtered.length === 0 ? (
        <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
          <PackageSearch size={26} style={{ color: "var(--rk-ink-soft)" }} />
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, marginTop: 10 }}>
            {orders.length === 0 ? (
              <>
                Belum ada pesanan di akun ini. Sudah pernah pesan sebagai tamu?{" "}
                <Link href="/akun/klaim" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Klaim order</Link>.
              </>
            ) : (
              "Tidak ada pesanan yang cocok dengan filter ini."
            )}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {filtered.map((o, i) => (
            <div key={o.id} className="rk-card rk-dash-card" style={{ padding: 20, display: "grid", gap: 12, animationDelay: `${Math.min(i, 10) * 30}ms` }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--rk-maroon-deep)" }}>{o.kode}</div>
                  <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                    {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--rk-maroon)" }}>{rupiah(o.total)}</div>
                  <div style={{ marginTop: 4 }}><StatusBadge status={o.status} /></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/akun/pesanan/${o.id}`}
                  className="rk-btn rk-btn-primary"
                  style={{ padding: "9px 16px", fontSize: 13.5, textDecoration: "none" }}
                >
                  Lihat detail <ArrowRight size={15} />
                </Link>
                <a
                  href={`${BUILDER_URL}/builder?dari=${encodeURIComponent(o.kode)}`}
                  className="rk-btn rk-btn-ghost"
                  style={{ padding: "9px 16px", fontSize: 13.5, textDecoration: "none" }}
                >
                  <Sparkles size={15} /> Pesan lagi
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
