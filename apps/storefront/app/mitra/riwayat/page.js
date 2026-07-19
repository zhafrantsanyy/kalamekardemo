import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function MitraRiwayatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase
    .from("florists")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: orders } = floris
    ? await supabase
        .from("orders")
        .select("id, kode, tanggal, status")
        .eq("floris_id", floris.id)
        .in("status", ["selesai", "batal"])
        .order("tanggal", { ascending: false })
    : { data: [] };

  if (!orders || orders.length === 0) {
    return (
      <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14 }}>Belum ada riwayat order.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/mitra/pesanan/${o.id}`}
          className="rk-card"
          style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", gap: 12, flexWrap: "wrap" }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--rk-maroon-deep)" }}>{o.kode}</div>
            <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 2 }}>
              {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusBadge status={o.status} />
            <ArrowRight size={16} style={{ color: "var(--rk-ink-soft)" }} />
          </div>
        </Link>
      ))}
    </div>
  );
}
