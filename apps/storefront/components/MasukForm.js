"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { APP_URL } from "@kalamekar/shared/tokens";
import { createClient } from "@/lib/supabase/browser";
import { humanizeAuthError } from "@/lib/authErrors";

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

// Baca ?redirect= langsung dari window.location, bukan lewat hook
// useSearchParams() — hook itu mewajibkan boundary <Suspense> di Next.js,
// dan pada kombinasi Next 16 + Turbopack di sini boundary itu macet (fallback
// null tidak pernah ditukar ke konten asli, form jadi kosong). Membaca
// langsung dari window aman karena nilainya cuma dipakai setelah mount.
function getRedirectParam() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("redirect");
}

export default function MasukForm() {
  const router = useRouter();
  // null di server & saat render pertama di client (biar tidak mismatch
  // hydration) — nilai asli diisi lewat effect setelah mount.
  const [redirectParam, setRedirectParam] = useState(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const param = getRedirectParam();
    if (param) setRedirectParam(param);
  }, []);

  // Halaman ini khusus pembeli — floris masuk lewat dashboard mitra
  // (apps/dashboard, tautan "Masuk Dashboard Mitra" di /untuk-florist).
  const redirectTo = redirectParam || "/akun";

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
      setErr(humanizeAuthError(error));
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
      setErr(humanizeAuthError(error));
      return;
    }
    setInfo("Link reset kata sandi sudah dikirim ke emailmu.");
  }

  return (
    <div>
      <h1 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon-deep)", margin: "0 0 6px" }}>
        Masuk ke akunmu
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", margin: "0 0 8px" }}>
        Belum punya akun? <a href="/daftar" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Daftar di sini</a>
      </p>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", margin: "0 0 24px" }}>
        Kamu floris mitra? <a href={`${APP_URL}/mitra/masuk`} style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Masuk lewat Dashboard Mitra</a>
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
        <div>
          <label style={labelStyle} htmlFor="masuk-email">Email</label>
          <div className="rk-input-wrap">
            <Mail size={16} className="rk-input-icon" />
            <input
              id="masuk-email"
              className="rk-field"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)" }}
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              placeholder="nama@email.com"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="masuk-password">Kata sandi</label>
          <div className="rk-input-wrap">
            <Lock size={16} className="rk-input-icon" />
            <input
              id="masuk-password"
              className="rk-field"
              style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)" }}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="rk-input-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {err && <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
        {info && <p role="status" style={{ fontSize: 13, color: "var(--rk-teal)", fontWeight: 600 }}>{info}</p>}

        <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
          {sending ? <Loader2 size={16} className="rk-spin" /> : <LogIn size={16} />} {sending ? "Memproses…" : "Masuk"}
        </button>

        <button
          type="button"
          onClick={handleLupaPassword}
          disabled={sending}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--rk-maroon)", textAlign: "center", fontFamily: "var(--font-body)" }}
        >
          Lupa kata sandi?
        </button>
      </form>
    </div>
  );
}
