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

export function SetHargaFinalForm({ orderId }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    const hargaFinal = Number(value);
    if (!Number.isInteger(hargaFinal) || hargaFinal <= 0) {
      setErr("Masukkan angka harga yang valid.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/mitra/orders/${orderId}/harga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ harga_final: hargaFinal }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan harga final.");
      router.refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Harga final (Rp)</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="rk-input"
          type="number"
          min={1}
          step={1000}
          placeholder="cth. 550000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="rk-btn rk-btn-primary" style={{ padding: "0 18px", fontSize: 13.5, whiteSpace: "nowrap" }} disabled={busy} type="submit">
          {busy ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--rk-ink-soft)", marginTop: 6 }}>
        Order baru bisa lanjut ke &ldquo;Dikonfirmasi&rdquo; setelah harga final diisi dan pembeli setuju via WhatsApp.
      </p>
      {err && <p style={{ fontSize: 12, color: "#a13d3d", fontWeight: 600, marginTop: 6 }}>{err}</p>}
    </form>
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
