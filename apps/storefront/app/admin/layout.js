import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";

export const metadata = {
  title: { absolute: "Admin — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section style={{ padding: "60px 20px 80px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="rk-eyebrow"><ShieldCheck size={13} /> Admin</span>
          <h1 className="rk-serif" style={{ fontSize: 28, color: "var(--rk-maroon-deep)", margin: "10px 0 0" }}>
            Halo, {user?.email}
          </h1>
        </div>
        <LogoutButton />
      </div>
      <AdminTabs />
      <div style={{ marginTop: 20 }}>{children}</div>
    </section>
  );
}
