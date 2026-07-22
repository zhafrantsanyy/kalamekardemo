import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Calendar, Clock, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import OrderCanvasPreview from "@/components/OrderCanvasPreview";
import PapanBungaOrderSummary, { OrderPriceDisplay } from "@/components/PapanBungaOrderSummary";
import OrderAdminControls from "@/components/admin/OrderAdminControls";
import type { Order, Florist } from "@/lib/types";
import type { OrderStatus } from "@/lib/orderFlow";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase.from("orders").select("*, florists(id, nama, wa)").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: florists } = await supabase.from("florists").select("id, nama, area, wa").eq("aktif", true).order("nama");

  const o = order as unknown as Order & { florists: { id: string; nama: string; wa: string | null } | null };
  const isPapanBunga = o.product_type === "papan_bunga";
  const buyerWaLink = o.wa ? `https://wa.me/62${o.wa.replace(/\D/g, "").replace(/^0/, "")}` : null;
  const floristWaLink = o.florists?.wa ? `https://wa.me/62${o.florists.wa.replace(/\D/g, "").replace(/^0/, "")}` : null;

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
      <Link href="/admin/orders" className="dm-btn dm-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali
      </Link>

      <Card style={{ padding: 22, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--dm-forest)" }}>{o.kode}</div>
            <div style={{ marginTop: 6 }}>
              <Badge status={o.status as OrderStatus} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--dm-magenta)" }}>
              <OrderPriceDisplay order={o} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: 13.5, color: "var(--dm-ink)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--dm-ink-soft)" }} /> {o.alamat}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Phone size={15} style={{ flexShrink: 0, color: "var(--dm-ink-soft)" }} /> {o.nama} · {o.wa || "-"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Calendar size={15} style={{ flexShrink: 0, color: "var(--dm-ink-soft)" }} />{" "}
            {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          {o.waktu && (
            <div style={{ display: "flex", gap: 8 }}>
              <Clock size={15} style={{ flexShrink: 0, color: "var(--dm-ink-soft)" }} /> {o.waktu}
            </div>
          )}
          {o.kartu && (
            <div style={{ display: "flex", gap: 8 }}>
              <StickyNote size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--dm-ink-soft)" }} /> &ldquo;{o.kartu}&rdquo;
            </div>
          )}
        </div>
      </Card>

      <Card style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)", marginBottom: 12 }}>Rancangan</div>
        {isPapanBunga ? (
          <PapanBungaOrderSummary order={o} />
        ) : (
          <div style={{ maxWidth: 280, margin: "0 auto" }}>
            <OrderCanvasPreview items={o.items as Array<{ type: string; x?: number; y?: number; size?: number; rot?: number }>} mode={o.mode ?? "bouquet"} />
          </div>
        )}
      </Card>

      <OrderAdminControls
        orderId={o.id}
        currentStatus={o.status}
        currentFloristId={o.floris_id}
        currentNotes={o.internal_notes ?? ""}
        florists={(florists || []) as Pick<Florist, "id" | "nama" | "area" | "wa">[]}
        buyerWaLink={buyerWaLink}
        floristWaLink={floristWaLink}
        payoutOrder={{ product_type: o.product_type, subtotal: o.subtotal, total: o.total, harga_final: o.harga_final }}
        currentCommissionRate={o.commission_rate}
        currentPayoutStatus={o.payout_status}
        currentCommissionAmount={o.commission_amount}
        currentPayoutAmount={o.payout_amount}
        currentPayoutPaidAt={o.payout_paid_at}
      />
    </div>
  );
}
