"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Copy } from "lucide-react";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function TambahFlorisForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", nama: "", area: "", wa: "" });
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSending(true);
    try {
      const res = await fetch("/api/admin/florists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal membuat floris.");

      setCreated({ email: form.email.trim(), password: json.tempPassword });
      setForm({ email: "", nama: "", area: "", wa: "" });
      router.refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rk-card" style={{ padding: 24 }}>
      <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 14 }}>Tambah floris baru</div>

      {created && (
        <div style={{ background: "var(--rk-cream)", border: "1px solid var(--rk-gold)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 13.5, lineHeight: 1.6 }}>
          Akun dibuat. Kata sandi sementara <strong>hanya ditampilkan sekali</strong> — salin dan kirim ke floris via WhatsApp:
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontFamily: "monospace", background: "#fff", border: "1px solid var(--rk-line)", borderRadius: 8, padding: "8px 12px" }}>
            <span>{created.email} / {created.password}</span>
            <button
              type="button"
              className="rk-btn rk-btn-ghost"
              style={{ padding: "4px 10px", fontSize: 12 }}
              onClick={() => navigator.clipboard?.writeText(`${created.email} / ${created.password}`)}
            >
              <Copy size={13} /> Salin
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 420 }}>
        <div>
          <label style={labelStyle} htmlFor="floris-email">Email</label>
          <input id="floris-email" className="rk-field" style={fieldStyle} type="email" required value={form.email} onChange={update("email")} placeholder="floris@email.com" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="floris-nama-baru">Nama studio/floris</label>
          <input id="floris-nama-baru" className="rk-field" style={fieldStyle} required value={form.nama} onChange={update("nama")} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="floris-area-baru">Area layanan</label>
          <input id="floris-area-baru" className="rk-field" style={fieldStyle} value={form.area} onChange={update("area")} placeholder="cth. Kemang, Jakarta Selatan" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="floris-wa-baru">Nomor WhatsApp</label>
          <input id="floris-wa-baru" className="rk-field" style={fieldStyle} value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />
        </div>

        {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

        <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={sending}>
          <UserPlus size={16} /> {sending ? "Membuat…" : "Buat floris"}
        </button>
      </form>
    </div>
  );
}
