"use client";

import { useState } from "react";
import { Store, User, Mail, Phone, MapPin, Home, Instagram, FileText, Send, Loader2, CheckCircle2 } from "lucide-react";

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };
const fieldBase = { width: "100%", borderRadius: 11, border: "1.5px solid var(--rk-line)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)" };

const initialForm = {
  namaToko: "",
  namaPemilik: "",
  email: "",
  wa: "",
  kota: "",
  alamat: "",
  instagram: "",
  pengalaman: "",
};

export default function FloristDaftarForm() {
  const [form, setForm] = useState(initialForm);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSending(true);
    try {
      const res = await fetch("/api/florist-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal mengirim pendaftaran.");
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rk-card" style={{ padding: 28, display: "grid", gap: 10, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <CheckCircle2 size={32} style={{ color: "var(--rk-teal)", margin: "0 auto" }} />
        <h2 className="rk-serif" style={{ fontSize: 20, color: "var(--rk-maroon-deep)" }}>Pendaftaran diterima</h2>
        <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.6 }}>
          Tim Kalamekar akan meninjau data tokomu dan menghubungi lewat WhatsApp dalam 2–3 hari kerja.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18, maxWidth: 520, margin: "0 auto" }}>
      <div>
        <label style={labelStyle} htmlFor="ff-nama-toko">Nama toko/studio</label>
        <div className="rk-input-wrap">
          <Store size={16} className="rk-input-icon" />
          <input id="ff-nama-toko" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" required value={form.namaToko} onChange={update("namaToko")} placeholder="cth. Melati Florist" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-nama-pemilik">Nama pemilik/PIC</label>
        <div className="rk-input-wrap">
          <User size={16} className="rk-input-icon" />
          <input id="ff-nama-pemilik" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" required value={form.namaPemilik} onChange={update("namaPemilik")} placeholder="Nama lengkap" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-email">Email</label>
        <div className="rk-input-wrap">
          <Mail size={16} className="rk-input-icon" />
          <input id="ff-email" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder="nama@email.com" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-wa">Nomor WhatsApp</label>
        <div className="rk-input-wrap">
          <Phone size={16} className="rk-input-icon" />
          <input id="ff-wa" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="tel" required inputMode="tel" value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-kota">Kota/area operasional</label>
        <div className="rk-input-wrap">
          <MapPin size={16} className="rk-input-icon" />
          <input id="ff-kota" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" required value={form.kota} onChange={update("kota")} placeholder="cth. Jakarta Selatan" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-alamat">Alamat operasional</label>
        <div className="rk-input-wrap">
          <Home size={16} className="rk-input-icon" />
          <input id="ff-alamat" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" required value={form.alamat} onChange={update("alamat")} placeholder="Alamat lengkap toko/workshop" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-instagram">Instagram (opsional)</label>
        <div className="rk-input-wrap">
          <Instagram size={16} className="rk-input-icon" />
          <input id="ff-instagram" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" value={form.instagram} onChange={update("instagram")} placeholder="@namatoko" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-pengalaman">Ceritakan pengalaman merangkaimu (opsional)</label>
        <div className="rk-input-wrap">
          <FileText size={16} className="rk-input-icon" style={{ top: 14, transform: "none" }} />
          <textarea
            id="ff-pengalaman"
            className="rk-field"
            style={{ ...fieldBase, padding: "12px 14px", minHeight: 90, resize: "vertical", fontFamily: "var(--font-body)" }}
            value={form.pengalaman}
            onChange={update("pengalaman")}
            placeholder="Lama usaha, jenis produk andalan, dsb."
          />
        </div>
      </div>

      {err && <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        {sending ? <Loader2 size={16} className="rk-spin" /> : <Send size={16} />} {sending ? "Mengirim…" : "Kirim Pendaftaran"}
      </button>
    </form>
  );
}
