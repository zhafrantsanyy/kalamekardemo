import { Flower2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import MitraTabs from "@/components/mitra/MitraTabs";

export const metadata = {
  title: { absolute: "Dashboard Mitra — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function MitraLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase
    .from("florists")
    .select("nama, area")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="rk-eyebrow"><Flower2 size={13} /> Dashboard Mitra</span>
          <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 0" }}>
            Halo, {floris?.nama || user?.email}
          </h1>
        </div>
        <LogoutButton />
      </div>
      <MitraTabs />
      <div style={{ marginTop: 20 }}>{children}</div>
    </section>
  );
}
