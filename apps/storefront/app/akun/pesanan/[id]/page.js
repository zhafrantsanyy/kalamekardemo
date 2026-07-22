import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Calendar, Clock, StickyNote, MessageCircle } from "lucide-react";
import { WA_NUMBER } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/server";
import OrderCanvasPreview from "@/components/OrderCanvasPreview";
import PapanBungaOrderSummary, { OrderPriceDisplay } from "@/components/PapanBungaOrderSummary";
import OrderTrackingLive from "@/components/akun/OrderTrackingLive";

export default async function AkunOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) notFound();

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Link href="/akun" className="rk-btn rk-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali
      </Link>

      <div className="rk-card" style={{ padding: 22, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--rk-maroon-deep)" }}>{order.kode}</div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "var(--rk-maroon)" }}><OrderPriceDisplay order={order} /></div>
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

      {order.product_type === "papan_bunga" ? (
        <div className="rk-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Rancangan papan bunga</div>
          <PapanBungaOrderSummary order={order} />
          {order.harga_final == null && (
            <p style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 14, lineHeight: 1.5 }}>
              Harga final belum ditetapkan floris. Kami akan menghubungimu via WhatsApp begitu harga disepakati, sebelum pesanan lanjut ke status &ldquo;Dikonfirmasi&rdquo;.
            </p>
          )}
        </div>
      ) : (
        <div className="rk-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Rancangan</div>
          <div style={{ maxWidth: 280, margin: "0 auto" }}>
            <OrderCanvasPreview items={order.items} mode={order.mode} />
          </div>
        </div>
      )}

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Kalamekar, saya ingin bertanya soal pesanan ${order.kode}.`)}`}
        target="_blank"
        rel="noreferrer"
        className="rk-btn rk-btn-teal"
        style={{ padding: "12px 20px", fontSize: 14, textDecoration: "none", justifyContent: "center" }}
      >
        <MessageCircle size={16} /> Chat via WhatsApp
      </a>

      <OrderTrackingLive initialOrder={order} />
    </div>
  );
}
