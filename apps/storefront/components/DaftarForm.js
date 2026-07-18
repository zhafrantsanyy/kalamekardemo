"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function DaftarForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      setErr("Kata sandi minimal 6 karakter.");
      return;
    }
    setErr("");
    setInfo("");
    setSending(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { nama: form.nama.trim() } },
    });

    if (error) {
      setSending(false);
      setErr(error.message.includes("already registered") ? "Email ini sudah terdaftar." : "Pendaftaran gagal. Coba lagi.");
      return;
    }

    if (data.session) {
      await supabase.from("profiles").update({ nama: form.nama.trim() }).eq("id", data.user.id);
      setSending(false);
      router.push("/akun");
      router.refresh();
      return;
    }

    setSending(false);
    setInfo("Akun dibuat. Cek emailmu untuk konfirmasi sebelum bisa masuk.");
  }

  return (
    <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 28, display: "grid", gap: 18, maxWidth: 420, margin: "0 auto" }}>
      <div>
        <label style={labelStyle} htmlFor="daftar-nama">Nama</label>
        <input id="daftar-nama" style={fieldStyle} type="text" required value={form.nama} onChange={update("nama")} placeholder="Nama lengkap" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="daftar-email">Email</label>
        <input id="daftar-email" style={fieldStyle} type="email" required value={form.email} onChange={update("email")} placeholder="nama@email.com" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="daftar-password">Kata sandi</label>
        <input id="daftar-password" style={fieldStyle} type="password" required value={form.password} onChange={update("password")} placeholder="Minimal 6 karakter" />
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {info && <p style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>{info}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        <UserPlus size={16} /> {sending ? "Memproses…" : "Daftar"}
      </button>

      <p style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", textAlign: "center", lineHeight: 1.5 }}>
        Pendaftaran ini khusus pembeli. Akun mitra floris dibuat oleh admin Kalamekar.
      </p>

      <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", textAlign: "center" }}>
        Sudah punya akun? <a href="/masuk" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Masuk</a>
      </p>
    </form>
  );
}
