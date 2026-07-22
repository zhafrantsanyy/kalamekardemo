"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/mitra";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  function update(field: "email" | "password") {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    setSending(false);

    if (error) {
      setErr("Email atau kata sandi salah, atau akun ini belum terdaftar sebagai mitra floris.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="dm-card" style={{ padding: 28, display: "grid", gap: 16, maxWidth: 400, width: "100%" }}>
      <Input id="masuk-email" label="Email" type="email" required value={form.email} onChange={update("email")} placeholder="nama@tokobunga.com" />
      <Input id="masuk-password" label="Kata sandi" type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <Button type="submit" disabled={sending} style={{ padding: "13px 22px", fontSize: 14.5 }}>
        <LogIn size={16} /> {sending ? "Memproses…" : "Masuk"}
      </Button>
    </form>
  );
}
