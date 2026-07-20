"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, User, Flower2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [role, setRole] = useState(redirectParam?.startsWith("/mitra") ? "florist" : "pembeli");
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);

  const redirectTo = redirectParam || (role === "florist" ? "/mitra" : "/akun");

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
    const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

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
        <label style={labelStyle}>Masuk sebagai</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setRole("pembeli")}
            aria-pressed={role === "pembeli"}
            className="rk-chip"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 12px", fontSize: 13.5, fontWeight: 700, color: role === "pembeli" ? "var(--rk-maroon)" : "var(--rk-ink-soft)",
              borderColor: role === "pembeli" ? "var(--rk-maroon)" : undefined,
              boxShadow: role === "pembeli" ? "0 0 0 2px var(--rk-maroon) inset" : undefined,
            }}
          >
            <User size={15} /> Pembeli
          </button>
          <button
            type="button"
            onClick={() => setRole("florist")}
            aria-pressed={role === "florist"}
            className="rk-chip"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 12px", fontSize: 13.5, fontWeight: 700, color: role === "florist" ? "var(--rk-maroon)" : "var(--rk-ink-soft)",
              borderColor: role === "florist" ? "var(--rk-maroon)" : undefined,
              boxShadow: role === "florist" ? "0 0 0 2px var(--rk-maroon) inset" : undefined,
            }}
          >
            <Flower2 size={15} /> Florist
          </button>
        </div>
      </div>

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
