"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function ProfilFlorisForm({ floris }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: floris?.nama || "",
    area: floris?.area || "",
    wa: floris?.wa || "",
    foto_url: floris?.foto_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");

    const supabase = createClient();
    const { error } = await supabase
      .from("florists")
      .update({
        nama: form.nama.trim(),
        area: form.area.trim() || null,
        wa: form.wa.trim() || null,
        foto_url: form.foto_url.trim() || null,
      })
      .eq("id", floris.id);

    setSaving(false);
    if (error) {
      setErr("Gagal menyimpan profil. Coba lagi.");
      return;
    }
    setMsg("Profil tersimpan.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle} htmlFor="floris-nama">Nama studio/floris</label>
        <input id="floris-nama" className="rk-field" style={fieldStyle} value={form.nama} onChange={update("nama")} required />
      </div>
      <div>
        <label style={labelStyle} htmlFor="floris-area">Area layanan</label>
        <input id="floris-area" className="rk-field" style={fieldStyle} value={form.area} onChange={update("area")} placeholder="cth. Kemang, Jakarta Selatan" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="floris-wa">Nomor WhatsApp</label>
        <input id="floris-wa" className="rk-field" style={fieldStyle} value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="floris-foto">URL foto toko</label>
        <input id="floris-foto" className="rk-field" style={fieldStyle} value={form.foto_url} onChange={update("foto_url")} placeholder="https://..." inputMode="url" />
        <p style={{ fontSize: 12, color: "var(--rk-ink-soft)", marginTop: 6 }}>
          Kosongkan untuk pakai ilustrasi template bawaan di halaman toko-bunga.
        </p>
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {msg && <p style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>{msg}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={saving}>
        <Save size={16} /> {saving ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
