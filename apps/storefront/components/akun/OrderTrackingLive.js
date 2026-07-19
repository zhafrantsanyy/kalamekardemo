"use client";

import { useEffect, useState } from "react";
import { Route, Store, Camera, Truck, Check, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { STATUS_FLOW } from "@/lib/orderFlow";
import StatusBadge from "@/components/StatusBadge";

const TRACK_STEPS = [
  { status: "matching", icon: Route, label: "Mencari floris", desc: "Mencocokkan order dengan floris terdekat." },
  { status: "dikonfirmasi", icon: Store, label: "Floris menerima order", desc: "Rangkaianmu masuk antrean rakit." },
  { status: "dirakit", icon: Camera, label: "Rakit + foto konfirmasi", desc: "Floris mengirim foto hasil rakitan." },
  { status: "diantar", icon: Truck, label: "Sedang diantar", desc: "Kurir menuju alamat penerima." },
  { status: "selesai", icon: Check, label: "Selesai", desc: "Bunga sudah diterima." },
];

export default function OrderTrackingLive({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let channel;
    let cancelled = false;

    // Sesi harus sudah termuat dulu supaya socket Realtime join dengan JWT
    // pembeli (bukan anon) — kalau tidak, RLS akan menolak semua event
    // karena tabel orders tidak punya policy SELECT untuk anon.
    supabase.auth.getSession().then(() => {
      if (cancelled) return;
      channel = supabase
        .channel(`order-${initialOrder.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${initialOrder.id}` },
          (payload) => setOrder(payload.new),
        )
        .subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  async function setujuiFoto() {
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/akun/orders/${order.id}/setujui-foto`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyetujui foto.");
      setOrder((o) => ({ ...o, foto_disetujui: true }));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="rk-card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "var(--rk-maroon-deep)" }}>{order.kode}</div>
        <StatusBadge status={order.status} />
      </div>

      {order.status === "batal" ? (
        <div className="rk-card" style={{ padding: 20, textAlign: "center", color: "#a13d3d", fontWeight: 700 }}>
          Order ini dibatalkan.
        </div>
      ) : (
        <div className="rk-card" style={{ padding: 20 }}>
          {TRACK_STEPS.map((s, i) => {
            const done = i < currentIndex || order.status === "selesai";
            const active = i === currentIndex && order.status !== "selesai";
            return (
              <div key={s.status} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i < TRACK_STEPS.length - 1 ? 24 : 0 }}>
                {i < TRACK_STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 19, top: 40, bottom: 2, width: 2, background: done ? "var(--rk-teal-deep)" : "var(--rk-line)" }} />
                )}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--rk-teal-deep)" : active ? "var(--rk-gold)" : "var(--rk-line)",
                    color: done || active ? "#fff" : "var(--rk-ink-soft)", zIndex: 1,
                  }}
                >
                  {done ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: done || active ? "var(--rk-ink)" : "var(--rk-ink-soft)" }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {order.foto_rakitan_url && (
        <div className="rk-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: "var(--rk-maroon)", marginBottom: 12 }}>Foto rakitan dari floris</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.foto_rakitan_url} alt="Foto rakitan" style={{ maxWidth: 260, borderRadius: 12, marginBottom: 14, display: "block" }} />
          {order.foto_disetujui ? (
            <p style={{ fontSize: 13.5, color: "var(--rk-teal)", fontWeight: 700 }}>Kamu sudah menyetujui foto ini.</p>
          ) : (
            <div>
              <button className="rk-btn rk-btn-primary" style={{ padding: "11px 20px", fontSize: 14 }} disabled={busy} onClick={setujuiFoto}>
                <ThumbsUp size={16} /> {busy ? "Memproses…" : "Setujui Foto"}
              </button>
              {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600, marginTop: 8 }}>{err}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
