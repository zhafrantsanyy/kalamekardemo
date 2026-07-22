"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function callStatus(orderId: string, action: "maju" | "tolak") {
  const res = await fetch(`/api/mitra/orders/${orderId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Gagal memproses permintaan.");
  return json;
}

export function TerimaTolakButtons({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run(action: "maju" | "tolak") {
    setErr("");
    setBusy(true);
    try {
      await callStatus(orderId, action);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button style={{ flex: 1, padding: "10px 0", fontSize: 13.5 }} disabled={busy} onClick={() => run("maju")}>
          <Check size={15} /> Terima
        </Button>
        <Button variant="ghost" style={{ flex: 1, padding: "10px 0", fontSize: 13.5 }} disabled={busy} onClick={() => run("tolak")}>
          <X size={15} /> Tolak
        </Button>
      </div>
      {err && <p style={{ fontSize: 12, color: "#a13d3d", fontWeight: 600, marginTop: 6 }}>{err}</p>}
    </div>
  );
}

export function SetHargaFinalForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
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
      setErr(e2 instanceof Error ? e2.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Input label="Harga final (Rp)" type="number" min={1} step={1000} placeholder="cth. 550000" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} style={{ padding: "0 18px", fontSize: 13.5, height: 42, whiteSpace: "nowrap" }}>
          {busy ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", marginTop: 6 }}>
        Order baru bisa lanjut ke &ldquo;Dikonfirmasi&rdquo; setelah harga final diisi dan pembeli setuju via WhatsApp.
      </p>
      {err && <p style={{ fontSize: 12, color: "#a13d3d", fontWeight: 600, marginTop: 6 }}>{err}</p>}
    </form>
  );
}

export function MajuStatusButton({ orderId, label }: { orderId: string; label: string }) {
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
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button disabled={busy} onClick={run} style={{ padding: "11px 20px", fontSize: 14 }}>
        <ArrowRight size={16} /> {busy ? "Memproses…" : label}
      </Button>
      {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600, marginTop: 8 }}>{err}</p>}
    </div>
  );
}
