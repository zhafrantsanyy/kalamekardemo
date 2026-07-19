"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function KlaimForm() {
  const router = useRouter();
  const [form, setForm] = useState({ kode: "", wa: "" });
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk(false);
    setSending(true);

    try {
      const res = await fetch("/api/akun/klaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode: form.kode.trim(), wa: form.wa.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal mengklaim order.");

      setOk(true);
      setForm({ kode: "", wa: "" });
      router.push(`/akun/pesanan/${json.orderId}`);
      router.refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 24, display: "grid", gap: 18, maxWidth: 420 }}>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.6, margin: 0 }}>
        Pernah pesan sebagai tamu? Masukkan kode order dan nomor WhatsApp yang dipakai saat checkout untuk
        menghubungkannya ke akun ini.
      </p>
      <div>
        <label style={labelStyle} htmlFor="klaim-kode">Kode order</label>
        <input id="klaim-kode" style={fieldStyle} required value={form.kode} onChange={update("kode")} placeholder="cth. KM-1234" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="klaim-wa">Nomor WhatsApp</label>
        <input id="klaim-wa" style={fieldStyle} required value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {ok && <p style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>Order berhasil diklaim.</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        <Search size={16} /> {sending ? "Mencari…" : "Klaim order"}
      </button>
    </form>
  );
}
