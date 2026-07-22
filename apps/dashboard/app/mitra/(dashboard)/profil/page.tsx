import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import ProfilFlorisForm from "@/components/mitra/ProfilFlorisForm";
import { WA_SUPPORT_NUMBER } from "@/lib/site-config";

// Mode Libur belum bisa disambungkan — kolom florists.is_on_leave belum
// ada di skema (gap yang dilaporkan & sengaja di-skip di Fase 0/4).
export default async function MitraProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id, nama, area, wa").eq("user_id", user.id).maybeSingle()
    : { data: null };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 14 }}>Informasi Toko</div>
        <ProfilFlorisForm floris={floris} />
      </Card>

      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 6 }}>Mode Libur</div>
          <div style={{ fontSize: 12.5, color: "var(--dm-ink-soft)" }}>
            Nonaktifkan sementara penerimaan order baru saat toko tutup atau cuti. Fitur ini butuh kolom baru di tabel florists — belum tersedia, akan menyusul setelah migrasi disetujui.
          </div>
        </Card>
        <Card style={{ padding: 22, background: "var(--dm-forest)", color: "var(--dm-cream)" }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Butuh bantuan?</div>
          <div style={{ fontSize: 12.5, color: "var(--dm-sidebar-fg-soft)", marginBottom: 12 }}>
            Hubungi tim support Kalamekar (beda dari chat pembeli).
          </div>
          <a href={`https://wa.me/${WA_SUPPORT_NUMBER}`} target="_blank" rel="noreferrer" className="dm-btn" style={{ background: "var(--dm-gold)", color: "var(--dm-forest)", padding: "9px 16px", fontSize: 13 }}>
            Hubungi Support
          </a>
        </Card>
      </div>
    </div>
  );
}
