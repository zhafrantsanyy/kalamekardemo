"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/akun";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    setSending(false);

    if (error) {
      setErr("Email atau kata sandi salah. Coba lagi.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleLupaPassword() {
    if (!form.email.trim()) {
      setErr("Isi email dulu, lalu klik \"Lupa kata sandi\".");
      return;
    }
    setErr("");
    setInfo("");
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim());

    setSending(false);

    if (error) {
      setErr("Gagal mengirim email reset. Coba lagi beberapa saat lagi.");
      return;
    }
    setInfo("Link reset kata sandi sudah dikirim ke emailmu.");
  }

  return (
    <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 28, display: "grid", gap: 18, maxWidth: 420, margin: "0 auto" }}>
      <div>
        <label style={labelStyle} htmlFor="masuk-email">Email</label>
        <input id="masuk-email" style={fieldStyle} type="email" required value={form.email} onChange={update("email")} placeholder="nama@email.com" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="masuk-password">Kata sandi</label>
        <input id="masuk-password" style={fieldStyle} type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {info && <p style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>{info}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        <LogIn size={16} /> {sending ? "Memproses…" : "Masuk"}
      </button>

      <button
        type="button"
        onClick={handleLupaPassword}
        disabled={sending}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--rk-maroon)", textAlign: "center", fontFamily: "var(--font-body)" }}
      >
        Lupa kata sandi?
      </button>

      <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", textAlign: "center" }}>
        Belum punya akun? <a href="/daftar" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Daftar</a>
      </p>
    </form>
  );
}
