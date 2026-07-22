import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Calendar, Clock, StickyNote, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ACTION_LABEL, nextStatus } from "@/lib/orderFlow";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import OrderCanvasPreview from "@/components/OrderCanvasPreview";
import PapanBungaOrderSummary, { OrderPriceDisplay } from "@/components/PapanBungaOrderSummary";
import { MajuStatusButton, SetHargaFinalForm } from "@/components/mitra/OrderActionButtons";
import UploadFotoForm from "@/components/mitra/UploadFotoForm";
import type { Order } from "@/lib/types";
import type { OrderStatus } from "@/lib/orderFlow";

export default async function MitraOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id").eq("user_id", user.id).maybeSingle()
    : { data: null };
  if (!floris) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("floris_id", floris.id)
    .maybeSingle();
  if (!order) notFound();

  const o = order as Order;
  const next = nextStatus(o.status);
  const showFotoUpload = o.status === "dirakit";
  const isPapanBunga = o.product_type === "papan_bunga";
  const needsHargaFinal = isPapanBunga && o.status === "matching" && o.harga_final == null;
  const waLink = o.wa ? `https://wa.me/62${o.wa.replace(/\D/g, "").replace(/^0/, "")}` : null;

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
      <Link href="/mitra/proses" className="dm-btn dm-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
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
            <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)" }}>{needsHargaFinal ? "Kamu yang tentukan harga" : "Nilai untuk floris"}</div>
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

      {needsHargaFinal && (
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--dm-magenta)", marginBottom: 12 }}>Tetapkan harga final</div>
          <SetHargaFinalForm orderId={o.id} />
        </Card>
      )}

      {(showFotoUpload || o.foto_rakitan_url) && (
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--dm-magenta)", marginBottom: 12 }}>Foto Bukti Rakitan</div>
          {o.foto_rakitan_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={o.foto_rakitan_url} alt="Foto rakitan" style={{ maxWidth: 240, borderRadius: 12, marginBottom: showFotoUpload ? 12 : 0, display: "block" }} />
          )}
          {showFotoUpload && <UploadFotoForm orderId={o.id} />}
        </Card>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {waLink && (
          <a href={waLink} target="_blank" rel="noreferrer" className="dm-btn dm-btn-dark" style={{ padding: "11px 20px", fontSize: 14 }}>
            <MessageCircle size={16} /> Chat via WhatsApp
          </a>
        )}
        {o.status !== "selesai" && o.status !== "batal" && next && !needsHargaFinal && (
          <MajuStatusButton orderId={o.id} label={ACTION_LABEL[o.status] || `Lanjut ke ${next}`} />
        )}
      </div>
    </div>
  );
}
