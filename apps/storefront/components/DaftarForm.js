"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { humanizeAuthError } from "@/lib/authErrors";

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };
const fieldBase = { width: "100%", borderRadius: 11, border: "1.5px solid var(--rk-line)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)" };

export default function DaftarForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      options: {
        data: { nama: form.nama.trim() },
        // Tanpa ini, link konfirmasi email jatuh ke Site URL default di
        // project Supabase (bisa nyangkut di localhost kalau belum diubah
        // untuk production) — set eksplisit supaya benar di environment mana pun.
        emailRedirectTo: `${window.location.origin}/masuk`,
      },
    });

    if (error) {
      setSending(false);
      setErr(humanizeAuthError(error));
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
    <div>
      <h1 className="rk-serif" style={{ fontSize: 26, color: "var(--rk-maroon-deep)", margin: "0 0 6px" }}>
        Daftar akun pembeli
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", margin: "0 0 24px" }}>
        Sudah punya akun? <a href="/masuk" style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>Masuk di sini</a>
      </p>

      {info ? (
        <div className="rk-card" style={{ padding: 22, display: "grid", gap: 10, textAlign: "center" }}>
          <CheckCircle2 size={28} style={{ color: "var(--rk-teal)", margin: "0 auto" }} />
          <p style={{ fontSize: 14, color: "var(--rk-ink)", fontWeight: 600 }}>{info}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <div>
            <label style={labelStyle} htmlFor="daftar-nama">Nama</label>
            <div className="rk-input-wrap">
              <User size={16} className="rk-input-icon" />
              <input id="daftar-nama" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="text" required autoComplete="name" value={form.nama} onChange={update("nama")} placeholder="Nama lengkap" />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="daftar-email">Email</label>
            <div className="rk-input-wrap">
              <Mail size={16} className="rk-input-icon" />
              <input id="daftar-email" className="rk-field" style={{ ...fieldBase, padding: "12px 14px" }} type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder="nama@email.com" />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="daftar-password">Kata sandi</label>
            <div className="rk-input-wrap">
              <Lock size={16} className="rk-input-icon" />
              <input
                id="daftar-password"
                className="rk-field"
                style={{ ...fieldBase, padding: "12px 40px 12px 14px" }}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                minLength={6}
                value={form.password}
                onChange={update("password")}
                placeholder="Minimal 6 karakter"
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

          <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
            {sending ? <Loader2 size={16} className="rk-spin" /> : <UserPlus size={16} />} {sending ? "Memproses…" : "Daftar"}
          </button>

          <p style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", textAlign: "center", lineHeight: 1.5 }}>
            Pendaftaran ini khusus pembeli. Akun mitra floris dibuat lewat undangan.
          </p>
        </form>
      )}
    </div>
  );
}
