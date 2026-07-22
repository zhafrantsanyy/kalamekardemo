"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Floris {
  id: string;
  nama: string;
  area: string | null;
  wa: string | null;
}

// Update langsung ke Supabase dari client — RLS policy "floris update
// profil sendiri" (user_id = auth.uid()) sudah ada, tidak butuh Route
// Handler dengan service role untuk ini (beda dari mutasi status/foto).
export default function ProfilFlorisForm({ floris }: { floris: Floris | null }) {
  const router = useRouter();
  const [form, setForm] = useState({ nama: floris?.nama || "", area: floris?.area || "", wa: floris?.wa || "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!floris) return;
    setSaving(true);
    setMsg("");
    setErr("");

    const supabase = createClient();
    const { error } = await supabase
      .from("florists")
      .update({ nama: form.nama.trim(), area: form.area.trim() || null, wa: form.wa.trim() || null })
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
      <Input id="floris-nama" label="Nama studio/floris" value={form.nama} onChange={update("nama")} required />
      <Input id="floris-area" label="Area layanan" value={form.area} onChange={update("area")} placeholder="cth. Kemang, Jakarta Selatan" />
      <Input id="floris-wa" label="Nomor WhatsApp" value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
      {msg && <p style={{ fontSize: 13, color: "var(--dm-forest)", fontWeight: 600 }}>{msg}</p>}

      <Button type="submit" disabled={saving || !floris} style={{ justifySelf: "start", padding: "12px 20px", fontSize: 14 }}>
        <Save size={16} /> {saving ? "Menyimpan…" : "Simpan"}
      </Button>
    </form>
  );
}
