"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PhoneCall, CheckCircle2, XCircle } from "lucide-react";

const ACTIONS = [
  { status: "dihubungi", label: "Sudah Dihubungi", icon: PhoneCall },
  { status: "disetujui", label: "Setujui", icon: CheckCircle2 },
  { status: "ditolak", label: "Tolak", icon: XCircle },
];

export default function FloristApplicationActions({ id, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function handleClick(newStatus) {
    setBusy(newStatus);
    try {
      const res = await fetch(`/api/admin/florist-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // Biarkan diam — admin bisa coba lagi.
    } finally {
      setBusy("");
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {ACTIONS.filter((a) => a.status !== status).map((a) => (
        <button
          key={a.status}
          type="button"
          onClick={() => handleClick(a.status)}
          disabled={!!busy}
          className={"rk-btn " + (a.status === "disetujui" ? "rk-btn-primary" : "rk-btn-ghost")}
          style={{ padding: "8px 14px", fontSize: 12.5 }}
        >
          {busy === a.status ? <Loader2 size={14} className="rk-spin" /> : <a.icon size={14} />} {a.label}
        </button>
      ))}
    </div>
  );
}
