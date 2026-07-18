import { Suspense } from "react";
import { LogIn } from "lucide-react";
import MasukForm from "@/components/MasukForm";

export const metadata = {
  title: { absolute: "Masuk — Kalamekar" },
  robots: { index: false, follow: false },
};

export default function MasukPage() {
  return (
    <section style={{ padding: "72px 20px 80px", background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", marginBottom: 32 }}>
        <span className="rk-eyebrow"><LogIn size={13} /> Akun</span>
        <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--rk-maroon-deep)", margin: "14px 0 0" }}>
          Masuk ke Akun Kalamekar
        </h1>
      </div>
      <Suspense fallback={null}>
        <MasukForm />
      </Suspense>
    </section>
  );
}
