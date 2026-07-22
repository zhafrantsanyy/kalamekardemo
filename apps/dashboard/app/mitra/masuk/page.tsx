import { Suspense } from "react";
import { Flower2 } from "lucide-react";
import MasukForm from "@/components/MasukForm";
import { STOREFRONT_URL } from "@/lib/site-config";

export const metadata = {
  title: "Masuk",
};

export default function MitraMasukPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 20, background: "var(--dm-cream)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--dm-magenta)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
          🌸
        </div>
        <div className="dm-serif" style={{ fontWeight: 700, fontSize: 19, color: "var(--dm-forest)" }}>
          Dashboard Mitra Kalamekar
        </div>
      </div>

      <Suspense>
        <MasukForm />
      </Suspense>

      <p style={{ fontSize: 13, color: "var(--dm-ink-soft)", textAlign: "center", display: "flex", alignItems: "center", gap: 5 }}>
        <Flower2 size={14} /> Ingin bergabung sebagai floris?{" "}
        <a href={`${STOREFRONT_URL}/untuk-florist`} style={{ color: "var(--dm-magenta)", fontWeight: 700 }}>
          Pelajari di sini
        </a>
      </p>
    </div>
  );
}
