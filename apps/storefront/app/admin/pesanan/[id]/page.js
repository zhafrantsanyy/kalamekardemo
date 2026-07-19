import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Calendar, Clock, StickyNote, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import { STATUS_LABEL } from "@/lib/orderFlow";
import StatusBadge from "@/components/StatusBadge";
import OrderCanvasPreview from "@/components/OrderCanvasPreview";
import AssignFlorisForm from "@/components/admin/AssignFlorisForm";
import StatusOverrideForm from "@/components/admin/StatusOverrideForm";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: florists } = await supabase
    .from("florists")
    .select("id, nama, area")
    .eq("aktif", true)
    .order("nama");

  const statusLog = Array.isArray(order.status_log) ? [...order.status_log].reverse() : [];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Link href="/admin" className="rk-btn rk-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali
      </Link>

      <div className="rk-card" style={{ padding: 22, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--rk-maroon-deep)" }}>{order.kode}</div>
            <div style={{ marginTop: 6 }}><StatusBadge status={order.status} /></div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "var(--rk-maroon)" }}>{rupiah(order.total)}</div>
        </div>
        <div style={{ display: "grid", gap: 8, fontSize: 13.5, color: "var(--rk-ink)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--rk-ink-soft)" }} /> {order.alamat}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Phone size={15} style={{ flexShrink: 0, color: "var(--rk-ink-soft)" }} /> {order.nama} · {order.wa || "-"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Calendar size={15} style={{ flexShrink: 0, color: "var(--rk-ink-soft)" }} />{" "}
            {new Date(order.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          {order.waktu && (
            <div style={{ display: "flex", gap: 8 }}>
              <Clock size={15} style={{ flexShrink: 0, color: "var(--rk-ink-soft)" }} /> {order.waktu}
            </div>
          )}
          {order.kartu && (
            <div style={{ display: "flex", gap: 8 }}>
              <StickyNote size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--rk-ink-soft)" }} /> &ldquo;{order.kartu}&rdquo;
            </div>
          )}
        </div>
      </div>

      <div className="rk-card" style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Rancangan</div>
        <div style={{ maxWidth: 240, margin: "0 auto" }}>
          <OrderCanvasPreview items={order.items} mode={order.mode} />
        </div>
      </div>

      <div className="rk-card" style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Assign floris</div>
        {order.floris_id && (
          <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginBottom: 10 }}>
            Order ini sudah di-assign ke floris. Pilih floris lain untuk memindahkannya.
          </p>
        )}
        <AssignFlorisForm orderId={order.id} florists={florists || []} />
      </div>

      <div className="rk-card" style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Override status</div>
        <StatusOverrideForm key={order.status} orderId={order.id} currentStatus={order.status} />
      </div>

      {statusLog.length > 0 && (
        <div className="rk-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <History size={16} /> Riwayat status
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {statusLog.map((entry, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: i < statusLog.length - 1 ? "1px solid var(--rk-line)" : "none", paddingBottom: 8 }}>
                <span>
                  <strong>{STATUS_LABEL[entry.status] || entry.status}</strong>
                  {entry.aksi ? ` (${entry.aksi})` : ""} — oleh {entry.by || "-"}
                </span>
                <span style={{ color: "var(--rk-ink-soft)" }}>
                  {entry.at ? new Date(entry.at).toLocaleString("id-ID") : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
