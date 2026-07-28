import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import AkunTabs from "@/components/akun/AkunTabs";
import DashboardSidebar from "@/components/akun/DashboardSidebar";

export const metadata = {
  title: { absolute: "Akun Saya — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function AkunLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="rk-eyebrow"><User size={13} /> Akun Saya</span>
          <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 0" }}>
            Halo, {profile?.nama || user?.email}
          </h1>
        </div>
        <LogoutButton />
      </div>
      <div className="rk-dash-tabs-mobile" style={{ marginBottom: 20 }}>
        <AkunTabs />
      </div>
      <div className="rk-dash-layout">
        <DashboardSidebar />
        <div className="rk-dash-content">
          <div className="rk-page-transition">{children}</div>
        </div>
      </div>
    </section>
  );
}
