import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const metadata = {
  title: { absolute: "Dashboard Admin — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminLabel = user?.email || "Admin";

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <AdminSidebar adminLabel={adminLabel} />
      <div style={{ flex: 1, height: "100%", overflowY: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 32px 60px" }}>
          <AdminTopbar />
          {children}
        </div>
      </div>
    </div>
  );
}
