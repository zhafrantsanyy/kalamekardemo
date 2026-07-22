import { Flower2 } from "lucide-react";
import { rupiah } from "@/lib/catalog";
import { CUSTOM_LABEL } from "@/lib/cart";

export default function OrderSummary({ items, total }) {
  return (
    <div className="rk-card" style={{ padding: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--rk-maroon)", marginBottom: 14 }}>Ringkasan pesanan</div>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => {
          const isCustom = item.item_type === "builder_composition";
          const snap = item.item_snapshot || {};
          const nama = isCustom ? CUSTOM_LABEL[snap.product_type] || "Rangkaian Custom" : snap.nama || "Produk";
          return (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--rk-ink)" }}>
                {isCustom && <Flower2 size={13} style={{ color: "var(--rk-maroon)", flexShrink: 0 }} />}
                {nama} <span style={{ color: "var(--rk-ink-soft)" }}>× {item.quantity}</span>
              </div>
              <div style={{ fontWeight: 700, color: "var(--rk-ink)", whiteSpace: "nowrap" }}>
                {rupiah(item.unit_price * item.quantity)}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 14,
          borderTop: "1px solid var(--rk-line)", fontWeight: 800, fontSize: 15.5,
        }}
      >
        <span style={{ color: "var(--rk-ink)" }}>Total</span>
        <span style={{ color: "var(--rk-maroon)" }}>{rupiah(total)}</span>
      </div>
    </div>
  );
}
