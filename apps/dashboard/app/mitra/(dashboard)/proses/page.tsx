import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@kalamekar/shared/catalog";
import Card from "@/components/ui/Card";

const COLUMNS = [
  { key: "dikonfirmasi", label: "Dikonfirmasi", dot: "var(--dm-status-dikonfirmasi-fg)" },
  { key: "dirakit", label: "Sedang Dirakit", dot: "var(--dm-status-dirakit-fg)" },
  { key: "diantar", label: "Diantar", dot: "var(--dm-status-diantar-fg)" },
] as const;

export default async function MitraProsesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id").eq("user_id", user.id).maybeSingle()
    : { data: null };

  const { data: orders } = floris
    ? await supabase
        .from("orders")
        .select("id, kode, tanggal, subtotal, mode, ukuran, status")
        .eq("floris_id", floris.id)
        .in("status", ["dikonfirmasi", "dirakit", "diantar"])
        .order("tanggal", { ascending: true })
    : { data: [] };

  const list = orders || [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {COLUMNS.map((col) => {
        const colOrders = list.filter((o) => o.status === col.key);
        return (
          <div key={col.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: col.dot }} />
              <span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--dm-forest)" }}>{col.label}</span>
              <span style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", background: "var(--dm-cream)", padding: "1px 8px", borderRadius: 999 }}>
                {colOrders.length}
              </span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {colOrders.length === 0 ? (
                <Card style={{ padding: 20, textAlign: "center", color: "var(--dm-ink-soft)", fontSize: 12.5 }}>Belum ada order</Card>
              ) : (
                colOrders.map((o) => (
                  <Link key={o.id} href={`/mitra/pesanan/${o.id}`} style={{ textDecoration: "none" }}>
                    <Card style={{ padding: 14, display: "grid", gap: 8, cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: "var(--dm-forest)" }}>{o.kode}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--dm-ink-soft)" }}>
                        {o.mode === "bouquet" ? "Buket" : "Krans"} · {o.ukuran}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", display: "flex", justifyContent: "space-between" }}>
                        <span>{new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}</span>
                        <span style={{ fontWeight: 700, color: "var(--dm-magenta)" }}>{rupiah(o.subtotal ?? 0)}</span>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
