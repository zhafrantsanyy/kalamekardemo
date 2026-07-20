"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Link reset password membawa kode di URL — @supabase/ssr browser client
    // otomatis menukarnya jadi sesi recovery saat halaman ini dimuat. Tunggu
    // event PASSWORD_RECOVERY (atau sesi apa pun) sebelum menampilkan form;
    // kalau tidak pernah muncul, link-nya tidak valid/kedaluwarsa.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const timeout = setTimeout(() => setTimedOut(true), 5000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      setErr("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setErr("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setErr("");
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setSending(false);
    if (error) {
      setErr("Gagal mengubah kata sandi. Link mungkin sudah kedaluwarsa — minta link baru lewat halaman Masuk.");
      return;
    }
    router.push("/masuk");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="rk-card" style={{ padding: 28, maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        {timedOut ? (
          <>
            <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", marginBottom: 14 }}>
              Link reset kata sandi tidak valid atau sudah kedaluwarsa.
            </p>
            <a href="/masuk" className="rk-btn rk-btn-primary" style={{ textDecoration: "none", justifyContent: "center", display: "inline-flex" }}>
              Kembali ke halaman Masuk
            </a>
          </>
        ) : (
          <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Memverifikasi link reset kata sandi…</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 28, display: "grid", gap: 18, maxWidth: 420, margin: "0 auto" }}>
      <div>
        <label style={labelStyle} htmlFor="reset-password">Kata sandi baru</label>
        <input
          id="reset-password"
          className="rk-field"
          style={fieldStyle}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
        />
      </div>
      <div>
        <label style={labelStyle} htmlFor="reset-confirm">Konfirmasi kata sandi</label>
        <input
          id="reset-confirm"
          className="rk-field"
          style={fieldStyle}
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Ulangi kata sandi"
        />
      </div>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        <KeyRound size={16} /> {sending ? "Menyimpan…" : "Simpan kata sandi baru"}
      </button>
    </form>
  );
}
