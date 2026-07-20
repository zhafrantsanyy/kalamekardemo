import { KeyRound } from "lucide-react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata = {
  title: { absolute: "Atur Ulang Kata Sandi — Kalamekar" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <section style={{ padding: "72px 20px 80px", background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", marginBottom: 32 }}>
        <span className="rk-eyebrow"><KeyRound size={13} /> Akun</span>
        <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--rk-maroon-deep)", margin: "14px 0 0" }}>
          Atur Ulang Kata Sandi
        </h1>
      </div>
      <ResetPasswordForm />
    </section>
  );
}
