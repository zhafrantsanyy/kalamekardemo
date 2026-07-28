import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PengaturanClient from "@/components/akun/pengaturan/PengaturanClient";

export const metadata = {
  title: "Pengaturan Akun — Kalamekar",
  robots: { index: false, follow: false },
};

export default async function AkunPengaturanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <span className="rk-eyebrow"><Settings size={13} /> Pengaturan Akun</span>
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, marginTop: 8 }}>
          Kelola foto profil, data akun, keamanan, dan preferensi notifikasimu di sini.
        </p>
      </div>

      <PengaturanClient userId={user.id} email={user.email} />
    </div>
  );
}
