"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { CART_CHANGED_EVENT } from "@/components/Navbar";

export default function TambahKeKeranjangButton({ productId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleClick() {
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/keranjang/tambah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "catalog", productId, quantity: 1 }),
      });

      if (res.status === 401) {
        router.push(`/masuk?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menambahkan ke keranjang.");

      setDone(true);
      window.dispatchEvent(new Event(CART_CHANGED_EVENT));
      setTimeout(() => setDone(false), 2000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="rk-btn rk-btn-primary"
        style={{ width: "100%", padding: "9px 14px", fontSize: 13, justifyContent: "center" }}
      >
        {busy ? (
          <Loader2 size={14} className="rk-spin" />
        ) : done ? (
          <Check size={14} />
        ) : (
          <ShoppingBag size={14} />
        )}
        {busy ? "Menambahkan…" : done ? "Ditambahkan" : "Tambah ke Keranjang"}
      </button>
      {err && <p role="alert" style={{ fontSize: 11.5, color: "#a13d3d", fontWeight: 600, marginTop: 6 }}>{err}</p>}
    </div>
  );
}
