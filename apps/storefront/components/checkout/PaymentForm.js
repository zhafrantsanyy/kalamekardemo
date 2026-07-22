"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, QrCode, Loader2, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "kalamekar_checkout";

const methodButtonStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 16px",
  fontSize: 14,
  fontWeight: 700,
  justifyContent: "flex-start",
  color: active ? "var(--rk-maroon)" : "var(--rk-ink-soft)",
  width: "100%",
});

export default function PaymentForm() {
  const router = useRouter();
  const [shipping, setShipping] = useState(null);
  const [method, setMethod] = useState("transfer_bank");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      router.replace("/checkout");
      return;
    }
    try {
      setShipping(JSON.parse(raw));
    } catch {
      router.replace("/checkout");
    }
  }, [router]);

  async function handleConfirm() {
    if (!shipping) return;
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout/konfirmasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method, ...shipping }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal mengonfirmasi pembayaran.");

      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/checkout/sukses/${json.orderId}`);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  }

  // shipping masih null selagi redirect balik ke /checkout (data belum
  // diisi, mis. akses langsung via URL tanpa lewat form checkout dulu).
  if (!shipping) return null;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          type="button"
          onClick={() => setMethod("transfer_bank")}
          aria-pressed={method === "transfer_bank"}
          className={"rk-chip" + (method === "transfer_bank" ? " rk-chip-on" : "")}
          style={methodButtonStyle(method === "transfer_bank")}
        >
          <Landmark size={18} /> Transfer Bank
        </button>
        {method === "transfer_bank" && (
          <div className="rk-card" style={{ padding: 16, background: "var(--rk-cream)" }}>
            <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", fontWeight: 600 }}>Transfer ke rekening berikut</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--rk-maroon-deep)", marginTop: 6 }}>BCA 1234567890</div>
            <div style={{ fontSize: 13, color: "var(--rk-ink)", marginTop: 2 }}>a.n. Kalamekar</div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMethod("qris")}
          aria-pressed={method === "qris"}
          className={"rk-chip" + (method === "qris" ? " rk-chip-on" : "")}
          style={methodButtonStyle(method === "qris")}
        >
          <QrCode size={18} /> QRIS
        </button>
        {method === "qris" && (
          <div className="rk-card" style={{ padding: 24, textAlign: "center", background: "var(--rk-cream)" }}>
            <div
              style={{
                width: 160, height: 160, margin: "0 auto", borderRadius: 12, border: "2px dashed var(--rk-line)",
                display: "flex", alignItems: "center", justifyContent: "center", background: "#fff",
              }}
            >
              <QrCode size={64} style={{ color: "var(--rk-ink-soft)" }} />
            </div>
            <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", fontWeight: 700, marginTop: 10 }}>QRIS Dummy</div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "var(--rk-ink-soft)", display: "flex", gap: 6, alignItems: "flex-start", lineHeight: 1.5 }}>
        <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 2 }} />
        Ini simulasi pembayaran (belum terhubung payment gateway sungguhan). Klik konfirmasi untuk melanjutkan pesanan.
      </p>

      {err && <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={busy}
        className="rk-btn rk-btn-primary"
        style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }}
      >
        {busy ? <Loader2 size={16} className="rk-spin" /> : null} {busy ? "Memproses…" : "Konfirmasi Pembayaran"}
      </button>
    </div>
  );
}
