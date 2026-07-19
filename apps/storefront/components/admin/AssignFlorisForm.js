"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};

export default function AssignFlorisForm({ orderId, florists }) {
  const router = useRouter();
  const [florisId, setFlorisId] = useState(florists[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!florisId) return;
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ florisId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal assign floris.");
      router.refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  if (florists.length === 0) {
    return <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Tidak ada floris aktif untuk di-assign.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <select className="rk-field" style={fieldStyle} value={florisId} onChange={(e) => setFlorisId(e.target.value)}>
        {florists.map((f) => (
          <option key={f.id} value={f.id}>{f.nama}{f.area ? ` — ${f.area}` : ""}</option>
        ))}
      </select>
      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "11px 18px", fontSize: 13.5 }} disabled={busy}>
        <UserCheck size={15} /> {busy ? "Memproses…" : "Assign"}
      </button>
      {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600, width: "100%" }}>{err}</p>}
    </form>
  );
}
