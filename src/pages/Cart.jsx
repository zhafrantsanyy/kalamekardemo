import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { C, rupiah } from "../lib/theme";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <ShoppingBag size={40} style={{ color: C.rose, marginBottom: 12 }} />
        <h1 className="rk-serif" style={{ fontSize: 26, color: C.maroon, marginBottom: 8 }}>Keranjang kosong</h1>
        <p style={{ color: C.inkSoft, marginBottom: 20 }}>Belum ada produk di keranjangmu.</p>
        <Link to="/produk" className="rk-btn rk-btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "26px 20px 60px" }}>
      <h1 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 20 }}>Keranjang</h1>
      <div className="rk-card" style={{ padding: 20, marginBottom: 20 }}>
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: C.cream, overflow: "hidden", flexShrink: 0 }}>
              {it.img && <img src={it.img} alt={it.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{it.nama}</div>
              <div style={{ color: C.inkSoft, fontSize: 13.5 }}>{rupiah(it.harga)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button className="rk-tool" style={{ width: 28, height: 28 }} onClick={() => updateQty(it.id, it.qty - 1)} aria-label="Kurangi">
                <Minus size={14} />
              </button>
              <span style={{ minWidth: 20, textAlign: "center" }}>{it.qty}</span>
              <button className="rk-tool" style={{ width: 28, height: 28 }} onClick={() => updateQty(it.id, it.qty + 1)} aria-label="Tambah">
                <Plus size={14} />
              </button>
            </div>
            <button className="rk-tool rk-tool-danger" style={{ width: 28, height: 28 }} onClick={() => removeItem(it.id)} aria-label="Hapus">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <span style={{ fontWeight: 800 }}>Total</span>
        <span className="rk-serif" style={{ fontSize: 22, fontWeight: 800, color: C.maroon }}>{rupiah(total)}</span>
      </div>
      <button
        className="rk-btn rk-btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }}
        onClick={() => navigate("/checkout")}
      >
        Lanjut ke Checkout
      </button>
    </div>
  );
}
