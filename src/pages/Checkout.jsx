import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { C, rupiah } from "../lib/theme";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ nama: "", wa: "", alamat: "", tanggal: "" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.alamat.trim() || !form.tanggal) {
      setErr("Nama, alamat, dan tanggal kirim wajib diisi.");
      return;
    }
    setErr("");
    setSending(true);
    if (supabase) {
      await supabase.from("orders").insert({
        kode: "KM-" + Math.floor(1000 + Math.random() * 9000),
        nama: form.nama.trim(),
        wa: form.wa.trim() || null,
        alamat: form.alamat.trim(),
        tanggal: form.tanggal,
        items: items.map(({ id, nama, harga, qty }) => ({ id, nama, harga, qty })),
        total,
      });
    }
    setSending(false);
    setDone(true);
    clearCart();
  };

  if (done) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <Check size={40} style={{ color: C.maroon, marginBottom: 12 }} />
        <h1 className="rk-serif" style={{ fontSize: 26, color: C.maroon, marginBottom: 8 }}>Pesanan diterima</h1>
        <p style={{ color: C.inkSoft, marginBottom: 20 }}>Tim kami akan menghubungimu untuk konfirmasi lebih lanjut.</p>
        <Link to="/" className="rk-btn rk-btn-ghost" style={{ textDecoration: "none", display: "inline-flex" }}>
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <p style={{ color: C.inkSoft, marginBottom: 16 }}>Keranjangmu kosong.</p>
        <Link to="/produk" className="rk-btn rk-btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "26px 20px 60px" }}>
      <h1 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 20 }}>Checkout</h1>
      <form className="rk-card" style={{ padding: 20 }} onSubmit={submit}>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nama penerima</label>
        <input className="rk-input" value={form.nama} onChange={set("nama")} placeholder="cth. Salsabila Putri" style={{ marginBottom: 12 }} />

        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nomor WhatsApp</label>
        <input className="rk-input" value={form.wa} onChange={set("wa")} placeholder="08xx xxxx xxxx" style={{ marginBottom: 12 }} inputMode="tel" />

        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Alamat lengkap</label>
        <textarea className="rk-input" rows={3} value={form.alamat} onChange={set("alamat")} placeholder="Jalan, nomor, kelurahan, patokan…" style={{ marginBottom: 12, resize: "vertical" }} />

        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Tanggal kirim</label>
        <input className="rk-input" type="date" value={form.tanggal} onChange={set("tanggal")} style={{ marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.maroon}`, paddingTop: 10, marginBottom: 16 }}>
          <span style={{ fontWeight: 800 }}>Total</span>
          <span className="rk-serif" style={{ fontWeight: 800, fontSize: 20, color: C.maroon }}>{rupiah(total)}</span>
        </div>

        {err && <div style={{ color: "#a13d3d", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{err}</div>}
        <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }} disabled={sending}>
          {sending ? "Memproses…" : "Buat Pesanan"}
        </button>
        <div style={{ fontSize: 11, color: C.inkSoft, textAlign: "center", marginTop: 8 }}>
          {supabase
            ? "Fase pilot: pembayaran & status dikonfirmasi tim kami via WhatsApp."
            : "Mode demo — pesanan tidak disimpan (env Supabase belum diisi)."}
        </div>
      </form>
    </div>
  );
}
