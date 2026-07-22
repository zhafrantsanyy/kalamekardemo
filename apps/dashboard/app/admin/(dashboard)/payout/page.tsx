import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@kalamekar/shared/catalog";
import { orderValue, computeCommission } from "@/lib/payout";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import PayoutFilterBar from "@/components/admin/PayoutFilterBar";
import type { Order } from "@/lib/types";

type PayoutRow = Pick<
  Order,
  "id" | "kode" | "tanggal" | "product_type" | "subtotal" | "total" | "harga_final" | "commission_rate" | "payout_status" | "commission_amount" | "payout_amount" | "payout_paid_at"
> & { florists: { nama: string } | null };

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function AdminPayoutPage({
  searchParams,
}: {
  searchParams: Promise<{ payout_status?: string }>;
}) {
  const { payout_status } = await searchParams;
  const filterStatus = payout_status ?? "belum_dibayar";
  const supabase = await createClient();

  const [{ data: rows }, { data: unpaidRows }, { data: paidThisMonthRows }] = await Promise.all([
    (() => {
      let q = supabase
        .from("orders")
        .select(
          "id, kode, tanggal, product_type, subtotal, total, harga_final, commission_rate, payout_status, commission_amount, payout_amount, payout_paid_at, florists(nama)",
        )
        .not("floris_id", "is", null)
        .order("tanggal", { ascending: false });
      if (filterStatus) q = q.eq("payout_status", filterStatus);
      return q;
    })(),
    supabase
      .from("orders")
      .select("product_type, subtotal, total, harga_final, commission_rate")
      .not("floris_id", "is", null)
      .eq("payout_status", "belum_dibayar"),
    supabase
      .from("orders")
      .select("payout_amount")
      .eq("payout_status", "dibayar")
      .gte("payout_paid_at", startOfMonth(new Date()).toISOString()),
  ]);

  const list = (rows || []) as unknown as PayoutRow[];

  const totalBelumDibayar = (unpaidRows || []).reduce((sum, o) => {
    const value = orderValue(o);
    if (value == null) return sum;
    return sum + computeCommission(value, o.commission_rate).payout;
  }, 0);
  const totalDibayarBulanIni = (paidThisMonthRows || []).reduce((sum, o) => sum + (o.payout_amount || 0), 0);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Belum dibayar (estimasi)</div>
          <div className="dm-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{rupiah(totalBelumDibayar)}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Dibayar bulan ini</div>
          <div className="dm-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{rupiah(totalDibayarBulanIni)}</div>
        </Card>
      </div>

      <PayoutFilterBar />

      {list.length === 0 ? (
        <EmptyState message="Tidak ada order yang cocok dengan filter ini." />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--dm-cream)", textAlign: "left" }}>
                  {["Order", "Floris", "Nilai order", "Komisi", "Payout", "Status", "Dibayar"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--dm-ink-soft)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((o) => {
                  const value = orderValue(o);
                  const isPaid = o.payout_status === "dibayar";
                  const preview = !isPaid && value != null ? computeCommission(value, o.commission_rate) : null;
                  const commission = isPaid ? o.commission_amount : preview?.commission ?? null;
                  const payout = isPaid ? o.payout_amount : preview?.payout ?? null;
                  return (
                    <tr key={o.id} style={{ borderTop: "1px solid var(--dm-line)" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <Link href={`/admin/orders/${o.id}`} style={{ color: "var(--dm-forest)", fontWeight: 700, textDecoration: "none" }}>
                          {o.kode}
                        </Link>
                      </td>
                      <td style={{ padding: "10px 14px" }}>{o.florists?.nama || "-"}</td>
                      <td style={{ padding: "10px 14px" }}>{value != null ? rupiah(value) : "Menunggu harga"}</td>
                      <td style={{ padding: "10px 14px" }}>{commission != null ? rupiah(commission) : "-"}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--dm-magenta)" }}>{payout != null ? rupiah(payout) : "-"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span
                          className="dm-badge"
                          style={{
                            background: isPaid ? "var(--dm-status-selesai-bg)" : "var(--dm-status-matching-bg)",
                            color: isPaid ? "var(--dm-status-selesai-fg)" : "var(--dm-status-matching-fg)",
                          }}
                        >
                          {isPaid ? "Sudah dibayar" : "Belum dibayar"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        {o.payout_paid_at ? new Date(o.payout_paid_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
