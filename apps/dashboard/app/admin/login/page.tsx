import { Suspense } from "react";
import MasukForm from "@/components/MasukForm";

export const metadata = {
  title: "Masuk — Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 20, background: "var(--dm-cream)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--dm-forest)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
          🌸
        </div>
        <div className="dm-serif" style={{ fontWeight: 700, fontSize: 19, color: "var(--dm-forest)" }}>
          Dashboard Admin Kalamekar
        </div>
      </div>

      <Suspense>
        <MasukForm redirectDefault="/admin" invalidMessage="Email atau kata sandi salah, atau akun ini tidak punya akses admin." />
      </Suspense>
    </div>
  );
}
