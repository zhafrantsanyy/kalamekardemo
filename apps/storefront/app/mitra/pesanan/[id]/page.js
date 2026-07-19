import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Calendar, Clock, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import { ACTION_LABEL, nextStatus } from "@/lib/orderFlow";
import StatusBadge from "@/components/mitra/StatusBadge";
import OrderCanvasPreview from "@/components/mitra/OrderCanvasPreview";
import { MajuStatusButton } from "@/components/mitra/OrderActionButtons";
import UploadFotoForm from "@/components/mitra/UploadFotoForm";

export default async function MitraOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase
    .from("florists")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!floris) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("floris_id", floris.id)
    .maybeSingle();
  if (!order) notFound();

  const next = nextStatus(order.status);
  const showFotoUpload = order.status === "dirakit";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Link href="/mitra/proses" className="rk-btn rk-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali
      </Link>

      <div className="rk-card" style={{ padding: 22, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--rk-maroon-deep)" }}>{order.kode}</div>
            <div style={{ marginTop: 6 }}><StatusBadge status={order.status} /></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--rk-maroon)" }}>{rupiah(order.subtotal)}</div>
            <div style={{ fontSize: 11.5, color: "var(--rk-ink-soft)" }}>Nilai untuk floris</div>
          </div>
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
        <div style={{ maxWidth: 280, margin: "0 auto" }}>
          <OrderCanvasPreview items={order.items} mode={order.mode} />
        </div>
      </div>

      {order.status !== "selesai" && order.status !== "batal" && next && (
        <div className="rk-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Update status</div>
          <MajuStatusButton orderId={order.id} label={ACTION_LABEL[order.status] || `Lanjut ke ${next}`} />
        </div>
      )}

      {(showFotoUpload || order.foto_rakitan_url) && (
        <div className="rk-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Foto rakitan</div>
          {order.foto_rakitan_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={order.foto_rakitan_url} alt="Foto rakitan" style={{ maxWidth: 240, borderRadius: 12, marginBottom: showFotoUpload ? 12 : 0, display: "block" }} />
          )}
          {showFotoUpload && <UploadFotoForm orderId={order.id} />}
        </div>
      )}
    </div>
  );
}
