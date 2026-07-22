import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCartWithItems } from "@/lib/cart";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";

export const metadata = {
  title: { absolute: "Pembayaran — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function PembayaranPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { items } = await getCartWithItems(supabase, user.id);
  if (items.length === 0) {
    redirect("/keranjang");
  }

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 560, margin: "0 auto" }}>
      <span className="rk-eyebrow"><CreditCard size={13} /> Pembayaran</span>
      <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 24px" }}>
        Metode Pembayaran
      </h1>

      <div style={{ display: "grid", gap: 20 }}>
        <OrderSummary items={items} total={total} />

        <div className="rk-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--rk-maroon)", marginBottom: 16 }}>Pilih metode pembayaran</div>
          <PaymentForm />
        </div>
      </div>
    </section>
  );
}
