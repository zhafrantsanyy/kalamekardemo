"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const CATEGORIES = ["Pemesanan", "Kerja sama florist", "Media / press", "Lainnya"];

export default function ContactForm() {
  const [form, setForm] = useState({ nama: "", email: "", kategori: CATEGORIES[0], pesan: "" });
  const [sent, setSent] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subject = `[Kalamekar] ${form.kategori} — ${form.nama}`;
    const body = `Nama: ${form.nama}\nEmail: ${form.email}\nKategori: ${form.kategori}\n\nPesan:\n${form.pesan}`;
    window.location.href = `mailto:halo@kalamekar.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const fieldStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
    background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
  };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

  return (
    <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 28, display: "grid", gap: 18, maxWidth: 560 }}>
      <div>
        <label style={labelStyle} htmlFor="kontak-nama">Nama</label>
        <input id="kontak-nama" style={fieldStyle} type="text" required value={form.nama} onChange={update("nama")} placeholder="Nama lengkap" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="kontak-email">Email</label>
        <input id="kontak-email" style={fieldStyle} type="email" required value={form.email} onChange={update("email")} placeholder="nama@email.com" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="kontak-kategori">Kategori pertanyaan</label>
        <select id="kontak-kategori" style={fieldStyle} value={form.kategori} onChange={update("kategori")}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle} htmlFor="kontak-pesan">Pesan</label>
        <textarea id="kontak-pesan" style={{ ...fieldStyle, minHeight: 120, resize: "vertical" }} required value={form.pesan} onChange={update("pesan")} placeholder="Tulis pertanyaan atau pesanmu di sini..." />
      </div>
      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }}>
        <Send size={16} /> Kirim Pesan
      </button>
      {sent && (
        <p style={{ fontSize: 13.5, color: "var(--rk-teal)" }}>
          Aplikasi emailmu akan terbuka dengan pesan ini — tinggal klik kirim. Kami akan membalas secepatnya.
        </p>
      )}
    </form>
  );
}
