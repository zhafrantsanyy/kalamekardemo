"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Ban } from "lucide-react";
import { ALL_STATUSES, STATUS_LABEL } from "@/lib/orderFlow";

const fieldStyle = {
  padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};

// Induk (app/admin/pesanan/[id]/page.js) me-render ini dengan
// key={order.status} — remount saat status berubah, supaya useState di
// bawah tidak "nyangkut" di status lama setelah router.refresh().
export default function StatusOverrideForm({ orderId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submitStatus(next) {
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal memperbarui status.");
      router.refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select className="rk-field" style={fieldStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <button
          type="button"
          className="rk-btn rk-btn-primary"
          style={{ padding: "11px 18px", fontSize: 13.5 }}
          disabled={busy || status === currentStatus}
          onClick={() => submitStatus(status)}
        >
          <Save size={15} /> {busy ? "Menyimpan…" : "Simpan status"}
        </button>
        {currentStatus !== "batal" && (
          <button
            type="button"
            className="rk-btn rk-btn-ghost"
            style={{ padding: "11px 18px", fontSize: 13.5, borderColor: "#a13d3d", color: "#a13d3d" }}
            disabled={busy}
            onClick={() => submitStatus("batal")}
          >
            <Ban size={15} /> Batalkan order
          </button>
        )}
      </div>
      {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
    </div>
  );
}
