"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ArrowRight } from "lucide-react";

async function callStatus(orderId, action) {
  const res = await fetch(`/api/mitra/orders/${orderId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Gagal memproses permintaan.");
  return json;
}

export function TerimaTolakButtons({ orderId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run(action) {
    setErr("");
    setBusy(true);
    try {
      await callStatus(orderId, action);
      router.refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="rk-btn rk-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 0", fontSize: 13.5 }} disabled={busy} onClick={() => run("maju")}>
          <Check size={15} /> Terima
        </button>
        <button className="rk-btn rk-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "10px 0", fontSize: 13.5 }} disabled={busy} onClick={() => run("tolak")}>
          <X size={15} /> Tolak
        </button>
      </div>
      {err && <p style={{ fontSize: 12, color: "#a13d3d", fontWeight: 600, marginTop: 6 }}>{err}</p>}
    </div>
  );
}

export function MajuStatusButton({ orderId, label }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setErr("");
    setBusy(true);
    try {
      await callStatus(orderId, "maju");
      router.refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="rk-btn rk-btn-primary" style={{ padding: "11px 20px", fontSize: 14 }} disabled={busy} onClick={run}>
        <ArrowRight size={16} /> {busy ? "Memproses…" : label}
      </button>
      {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600, marginTop: 8 }}>{err}</p>}
    </div>
  );
}
