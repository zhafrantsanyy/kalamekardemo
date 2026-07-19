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

export default function ProfilPembeliForm({ userId, profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: profile?.nama || "",
    wa: profile?.wa || "",
    alamat_default: profile?.alamat_default || "",
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
      .from("profiles")
      .update({
        nama: form.nama.trim() || null,
        wa: form.wa.trim() || null,
        alamat_default: form.alamat_default.trim() || null,
      })
      .eq("id", userId);

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
        <label style={labelStyle} htmlFor="akun-nama">Nama</label>
        <input id="akun-nama" style={fieldStyle} value={form.nama} onChange={update("nama")} placeholder="Nama lengkap" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="akun-wa">Nomor WhatsApp</label>
        <input id="akun-wa" style={fieldStyle} value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="akun-alamat">Alamat default</label>
        <textarea
          id="akun-alamat"
          rows={3}
          style={{ ...fieldStyle, resize: "vertical" }}
          value={form.alamat_default}
          onChange={update("alamat_default")}
          placeholder="Jalan, nomor, kelurahan, patokan…"
        />
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {msg && <p style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>{msg}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={saving}>
        <Save size={16} /> {saving ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
