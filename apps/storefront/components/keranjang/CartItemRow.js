"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Loader2, Flower2 } from "lucide-react";
import { rupiah } from "@/lib/catalog";
import { CUSTOM_LABEL } from "@/lib/cart";

const qtyBtnStyle = {
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  border: "none",
  cursor: "pointer",
  color: "var(--rk-ink)",
};

export default function CartItemRow({ item }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const isCustom = item.item_type === "builder_composition";
  const snap = item.item_snapshot || {};
  const nama = isCustom ? CUSTOM_LABEL[snap.product_type] || "Rangkaian Custom" : snap.nama || "Produk";
  const gambar = isCustom ? snap.preview_url : snap.image_url;
  const subtotal = item.unit_price * item.quantity;

  async function kirim(body) {
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/keranjang/item/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal memperbarui keranjang.");
      router.refresh();
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  }

  function ubahJumlah(quantityBaru) {
    if (quantityBaru < 0) return;
    kirim({ action: "ubah", quantity: quantityBaru });
  }

  return (
    <div className="rk-card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start", opacity: busy ? 0.6 : 1 }}>
      <div
        style={{
          width: 76, height: 76, borderRadius: 12, background: "var(--rk-cream)", flexShrink: 0,
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {gambar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gambar} alt={nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Flower2 size={24} style={{ color: "var(--rk-ink-soft)" }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--rk-ink)" }}>{nama}</div>
          {isCustom && (
            <span
              style={{
                background: "var(--rk-rose-soft)", color: "var(--rk-maroon)", fontSize: 10.5, fontWeight: 700,
                letterSpacing: ".03em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999,
              }}
            >
              Custom Rangkaian
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 4 }}>{rupiah(item.unit_price)} / item</div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--rk-line)", borderRadius: 10, overflow: "hidden" }}>
            <button type="button" disabled={busy} onClick={() => ubahJumlah(item.quantity - 1)} style={qtyBtnStyle} aria-label="Kurangi jumlah">
              <Minus size={14} />
            </button>
            <span style={{ minWidth: 28, textAlign: "center", fontSize: 13.5, fontWeight: 700 }}>{item.quantity}</span>
            <button type="button" disabled={busy} onClick={() => ubahJumlah(item.quantity + 1)} style={qtyBtnStyle} aria-label="Tambah jumlah">
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => kirim({ action: "hapus" })}
            style={{
              background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center",
              gap: 5, fontSize: 12.5, fontWeight: 600, color: "#a13d3d", fontFamily: "var(--font-body)",
            }}
          >
            {busy ? <Loader2 size={14} className="rk-spin" /> : <Trash2 size={14} />} Hapus
          </button>
        </div>

        {err && <p role="alert" style={{ fontSize: 12, color: "#a13d3d", marginTop: 8 }}>{err}</p>}
      </div>

      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--rk-maroon)", whiteSpace: "nowrap" }}>{rupiah(subtotal)}</div>
    </div>
  );
}
