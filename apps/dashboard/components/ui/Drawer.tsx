"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Panel/drawer generik dipakai untuk Detail Pesanan (dibuka dari Order
// Masuk, Sedang Diproses, Riwayat). Wiring datanya menyusul di Fase 4.
export default function Drawer({ open, onClose, title, children }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(23,61,40,.35)", zIndex: 40 }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          maxWidth: "100vw",
          background: "#fff",
          zIndex: 41,
          boxShadow: "-16px 0 40px -20px rgba(23,61,40,.4)",
          overflowY: "auto",
          animation: "dm-slide-in .2s ease both",
        }}
      >
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span className="dm-serif" style={{ fontSize: 16, fontWeight: 700, color: "var(--dm-forest)" }}>
              {title}
            </span>
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{ background: "var(--dm-cream)", border: "none", borderRadius: 999, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dm-ink-soft)" }}
            >
              <X size={15} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
