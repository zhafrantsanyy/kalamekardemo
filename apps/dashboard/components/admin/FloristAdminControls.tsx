"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import type { Florist } from "@/lib/types";

async function patchFlorist(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/florists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Gagal menyimpan perubahan.");
  return json;
}

// Beda dari ProfilFlorisForm.tsx (floris update profil sendiri lewat RLS
// client-direct) — di sini admin update baris milik floris lain, tidak
// ada policy UPDATE untuk admin, jadi lewat Route Handler service role.
export default function FloristAdminControls({ floris }: { floris: Florist }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: floris.nama,
    area: floris.area || "",
    wa: floris.wa || "",
    kategori: floris.kategori || "",
  });
  const [aktif, setAktif] = useState(floris.aktif);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function run(key: string, body: Record<string, unknown>, successMsg?: string) {
    setErr("");
    setMsg("");
    setBusy(key);
    try {
      await patchFlorist(floris.id, body);
      if (successMsg) setMsg(successMsg);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await run(
      "profil",
      {
        nama: form.nama.trim(),
        area: form.area.trim() || null,
        wa: form.wa.trim() || null,
        kategori: form.kategori.trim() || null,
      },
      "Profil floris tersimpan.",
    );
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          className="dm-badge"
          style={{
            background: floris.verified ? "var(--dm-status-selesai-bg)" : "var(--dm-status-matching-bg)",
            color: floris.verified ? "var(--dm-status-selesai-fg)" : "var(--dm-status-matching-fg)",
          }}
        >
          {floris.verified ? "Terverifikasi" : "Menunggu verifikasi"}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" disabled={busy !== null} onClick={() => run("verify", { verified: true }, "Floris disetujui.")} style={{ padding: "8px 14px", fontSize: 12.5 }}>
            <Check size={14} /> Approve
          </Button>
          <Button variant="danger-ghost" disabled={busy !== null} onClick={() => run("verify", { verified: false }, "Floris ditolak/dibatalkan verifikasinya.")} style={{ padding: "8px 14px", fontSize: 12.5 }}>
            <X size={14} /> Reject
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dm-ink)" }}>Status aktif</span>
        <Switch
          on={aktif}
          onToggle={() => {
            const next = !aktif;
            setAktif(next);
            run("aktif", { aktif: next });
          }}
          label="Toggle aktif floris"
        />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)" }}>Data floris</div>
        <Input id="floris-nama" label="Nama studio/floris" value={form.nama} onChange={update("nama")} required />
        <Input id="floris-area" label="Kota/area layanan" value={form.area} onChange={update("area")} placeholder="cth. Kemang, Jakarta Selatan" />
        <Input id="floris-wa" label="Nomor WhatsApp" value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" inputMode="tel" />
        <Input id="floris-kategori" label="Kategori" value={form.kategori} onChange={update("kategori")} placeholder="cth. Buket, Krans, Papan Bunga" />

        {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
        {msg && <p style={{ fontSize: 13, color: "var(--dm-forest)", fontWeight: 600 }}>{msg}</p>}

        <Button type="submit" disabled={busy !== null} style={{ justifySelf: "start", padding: "12px 20px", fontSize: 14 }}>
          <Save size={16} /> {busy === "profil" ? "Menyimpan…" : "Simpan"}
        </Button>
      </form>
    </div>
  );
}
