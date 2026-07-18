import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: { absolute: "Akun Saya — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function AkunPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="rk-eyebrow"><User size={13} /> Akun Saya</span>
          <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 0" }}>
            Halo, {user?.email}
          </h1>
        </div>
        <LogoutButton />
      </div>
      <div className="rk-card" style={{ padding: 24 }}>
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14.5, lineHeight: 1.6 }}>
          Dashboard riwayat pesanan, tracking, dan profil segera hadir di sini.
        </p>
      </div>
    </section>
  );
}
