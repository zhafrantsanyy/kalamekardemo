import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import StatusBadge from "@/components/StatusBadge";
import OrderFilterBar from "@/components/admin/OrderFilterBar";

export default async function AdminOrderListPage({ searchParams }) {
  const sp = await searchParams;
  const status = sp?.status || "";
  const q = (sp?.q || "").trim();

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, kode, nama, status, tanggal, total, floris_id")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`kode.ilike.%${q}%,nama.ilike.%${q}%`);

  const { data: orders } = await query;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <OrderFilterBar />

      {!orders || orders.length === 0 ? (
        <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
          <PackageSearch size={26} style={{ color: "var(--rk-ink-soft)" }} />
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, marginTop: 10 }}>Tidak ada order yang cocok.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o, i) => (
            <Link
              key={o.id}
              href={`/admin/pesanan/${o.id}`}
              className="rk-card rk-dash-card rk-dash-card-link"
              style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", gap: 12, flexWrap: "wrap", animationDelay: `${Math.min(i, 10) * 30}ms` }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--rk-maroon-deep)" }}>{o.kode}</div>
                <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                  {o.nama} · {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--rk-maroon)" }}>{rupiah(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
