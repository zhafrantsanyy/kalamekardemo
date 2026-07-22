import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle, Home, PackageSearch } from "lucide-react";
import { WA_NUMBER } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import OrderSummary from "@/components/checkout/OrderSummary";

export const metadata = {
  title: { absolute: "Pesanan Berhasil — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function CheckoutSuksesPage({ params }) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select("id, kode, total, status, created_at")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) notFound();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, item_type, product_id, composition_id, quantity, unit_price, item_snapshot")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 560, margin: "0 auto" }}>
      <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
        <CheckCircle2 size={40} style={{ color: "var(--rk-teal)", margin: "0 auto" }} />
        <h1 className="rk-serif" style={{ fontSize: 24, color: "var(--rk-maroon-deep)", margin: "14px 0 6px" }}>
          Pesanan Berhasil Dibuat
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
          Nomor pesanan <strong style={{ color: "var(--rk-ink)" }}>{order.kode}</strong>
        </p>
        <div style={{ marginTop: 10 }}>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <OrderSummary items={orderItems || []} total={order.total} />
      </div>

      <div className="rk-card" style={{ padding: 18, marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <MessageCircle size={18} style={{ color: "var(--rk-teal)", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13.5, color: "var(--rk-ink)", lineHeight: 1.55, margin: 0 }}>
          Tim Kalamekar akan menghubungimu lewat WhatsApp untuk koordinasi rangkaian & pengiriman. Ada pertanyaan?{" "}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Kalamekar, saya ingin bertanya soal pesanan ${order.kode}.`)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--rk-maroon)", fontWeight: 700 }}
          >
            Chat via WhatsApp
          </a>
          .
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
        <Link href="/" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 13.5, textDecoration: "none" }}>
          <Home size={15} /> Kembali ke Beranda
        </Link>
        <Link href="/akun" className="rk-btn rk-btn-ghost" style={{ padding: "12px 20px", fontSize: 13.5, textDecoration: "none" }}>
          <PackageSearch size={15} /> Lihat Pesanan Lain
        </Link>
      </div>
    </section>
  );
}
