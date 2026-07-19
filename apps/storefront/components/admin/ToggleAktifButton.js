"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Power } from "lucide-react";

export default function ToggleAktifButton({ florisId, aktif }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/florists/${florisId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // Biarkan diam — tombol tetap di posisi semula, admin bisa coba lagi.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={"rk-btn " + (aktif ? "rk-btn-ghost" : "rk-btn-primary")}
      style={{ padding: "8px 14px", fontSize: 13 }}
    >
      <Power size={14} /> {aktif ? "Nonaktifkan" : "Aktifkan"}
    </button>
  );
}
