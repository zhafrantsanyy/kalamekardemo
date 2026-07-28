"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldOff } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ToastProvider";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function SecurityForm() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [signingOutAll, setSigningOutAll] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.next.length < 6) {
      toast.error("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (form.next !== form.confirm) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.current,
    });
    if (verifyError) {
      setSaving(false);
      toast.error("Kata sandi saat ini salah.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: form.next });
    setSaving(false);
    if (updateError) {
      toast.error("Gagal mengganti kata sandi.");
      return;
    }

    setForm({ current: "", next: "", confirm: "" });
    toast.success("Kata sandi berhasil diganti.");
  }

  async function handleSignOutAll() {
    setSigningOutAll(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: "global" });
    setSigningOutAll(false);
    if (error) {
      toast.error("Gagal keluar dari semua perangkat.");
      return;
    }
    toast.success("Berhasil keluar dari semua perangkat.");
    router.push("/masuk");
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="sec-current">Kata Sandi Saat Ini</label>
          <input id="sec-current" type="password" className="rk-field" style={fieldStyle} value={form.current} onChange={update("current")} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="sec-next">Kata Sandi Baru</label>
          <input id="sec-next" type="password" className="rk-field" style={fieldStyle} value={form.next} onChange={update("next")} required minLength={6} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="sec-confirm">Konfirmasi Kata Sandi Baru</label>
          <input id="sec-confirm" type="password" className="rk-field" style={fieldStyle} value={form.confirm} onChange={update("confirm")} required minLength={6} />
        </div>
        <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={saving}>
          <KeyRound size={16} /> {saving ? "Menyimpan…" : "Ganti Kata Sandi"}
        </button>
      </form>

      <div style={{ borderTop: "1px solid var(--rk-line)", paddingTop: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Keluar dari Semua Perangkat</div>
        <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginBottom: 12 }}>
          Ini akan mengakhiri sesi login di semua perangkat, termasuk perangkat ini.
        </p>
        <button type="button" className="rk-btn rk-btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5 }} onClick={handleSignOutAll} disabled={signingOutAll}>
          <ShieldOff size={15} /> {signingOutAll ? "Memproses…" : "Keluar dari Semua Perangkat"}
        </button>
      </div>
    </div>
  );
}
