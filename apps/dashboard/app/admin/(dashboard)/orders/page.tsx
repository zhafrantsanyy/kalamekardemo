import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { areaKasar } from "@/lib/maskAlamat";
import { OrderPriceDisplay } from "@/components/PapanBungaOrderSummary";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import OrdersFilterBar from "@/components/admin/OrdersFilterBar";
import type { Order } from "@/lib/types";
import type { OrderStatus } from "@/lib/orderFlow";

type OrderRow = Pick<
  Order,
  "id" | "kode" | "nama" | "alamat" | "status" | "tanggal" | "total" | "subtotal" | "harga_final" | "harga_estimasi_min" | "harga_estimasi_max" | "product_type" | "floris_id"
> & { florists: { nama: string } | null };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(
      "id, kode, nama, alamat, status, tanggal, total, subtotal, harga_final, harga_estimasi_min, harga_estimasi_max, product_type, floris_id, florists(nama)",
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`nama.ilike.%${q}%,kode.ilike.%${q}%`);

  const { data } = await query;
  const orders = (data || []) as unknown as OrderRow[];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <OrdersFilterBar />

      {orders.length === 0 ? (
        <EmptyState message="Tidak ada order yang cocok dengan filter ini." />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--dm-cream)", textAlign: "left" }}>
                  {["Pembeli", "Kota", "Status", "Floris", "Tanggal", "Total"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--dm-ink-soft)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderTop: "1px solid var(--dm-line)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <Link href={`/admin/orders/${o.id}`} style={{ color: "var(--dm-forest)", fontWeight: 700, textDecoration: "none" }}>
                        {o.nama}
                      </Link>
                      <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)" }}>{o.kode}</div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>{areaKasar(o.alamat)}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <Badge status={o.status as OrderStatus} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>{o.florists?.nama || <span style={{ color: "var(--dm-ink-soft)" }}>Belum di-assign</span>}</td>
                    <td style={{ padding: "10px 14px" }}>{new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--dm-magenta)" }}>
                      <OrderPriceDisplay order={o as unknown as Order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
