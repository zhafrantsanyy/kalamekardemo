import Link from "next/link";
import { PackageSearch, ArrowRight, Sparkles } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import StatusBadge from "@/components/StatusBadge";

export default async function AkunRiwayatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, kode, tanggal, total, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
        <PackageSearch size={26} style={{ color: "var(--rk-ink-soft)" }} />
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, marginTop: 10 }}>
          Belum ada pesanan di akun ini. Sudah pernah pesan sebagai tamu?{" "}
          <Link href="/akun/klaim" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Klaim order</Link>.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {orders.map((o) => (
        <div key={o.id} className="rk-card" style={{ padding: 20, display: "grid", gap: 12 }}>
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
  );
}
