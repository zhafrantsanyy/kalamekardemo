import Link from "next/link";
import { ShoppingBag, ArrowRight, Flower2, Store } from "lucide-react";
import { BUILDER_URL } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/server";
import { getCartWithItems } from "@/lib/cart";
import { rupiah } from "@/lib/catalog";
import CartItemRow from "@/components/keranjang/CartItemRow";

export const metadata = {
  title: { absolute: "Keranjang — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function KeranjangPage({ searchParams }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { items } = await getCartWithItems(supabase, user.id);
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 780, margin: "0 auto" }}>
      <span className="rk-eyebrow"><ShoppingBag size={13} /> Keranjang</span>
      <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 24px" }}>
        Keranjang Belanja
      </h1>

      {sp?.error === "komposisi_gagal" && (
        <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600, marginBottom: 16 }}>
          Gagal menambahkan rangkaian custom dari builder ke keranjang. Coba lagi dari builder.
        </p>
      )}

      {items.length === 0 ? (
        <div className="rk-card" style={{ padding: 40, textAlign: "center" }}>
          <ShoppingBag size={28} style={{ color: "var(--rk-ink-soft)" }} />
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, margin: "12px 0 22px" }}>
            Keranjangmu masih kosong. Yuk pilih rangkaian dari toko bunga, atau rangkai sendiri lewat builder.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/toko-bunga" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 13.5, textDecoration: "none" }}>
              <Store size={15} /> Lihat Toko Bunga
            </Link>
            <a href={BUILDER_URL} className="rk-btn rk-btn-ghost" style={{ padding: "12px 20px", fontSize: 13.5, textDecoration: "none" }}>
              <Flower2 size={15} /> Rangkai Sendiri
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div
            className="rk-card"
            style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}
          >
            <div>
              <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", fontWeight: 600 }}>Total belanja</div>
              <div className="rk-serif" style={{ fontSize: 24, fontWeight: 700, color: "var(--rk-maroon-deep)" }}>{rupiah(total)}</div>
            </div>
            <Link href="/checkout" className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 14.5, textDecoration: "none" }}>
              Lanjut ke Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
