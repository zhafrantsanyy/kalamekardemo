import { createClient } from "@/lib/supabase/server";
import FloristApplicationActions from "@/components/admin/FloristApplicationActions";

const STATUS_STYLE = {
  baru: { bg: "#fbe9e9", fg: "#a13d3d", label: "Baru" },
  dihubungi: { bg: "#fff4d9", fg: "#8a6416", label: "Dihubungi" },
  disetujui: { bg: "#e9f5e6", fg: "#2f7d3b", label: "Disetujui" },
  ditolak: { bg: "#f0f0f0", fg: "#666", label: "Ditolak" },
};

export default async function AdminFloristPendaftaranPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("florist_applications")
    .select("id, nama_toko, nama_pemilik, email, wa, kota, kecamatan, alamat, instagram, pengalaman, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {!applications || applications.length === 0 ? (
        <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14 }}>Belum ada pendaftaran florist.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {applications.map((a, i) => {
            const st = STATUS_STYLE[a.status] || STATUS_STYLE.baru;
            return (
              <div
                key={a.id}
                className="rk-card rk-dash-card"
                style={{ padding: 18, display: "grid", gap: 10, animationDelay: `${Math.min(i, 10) * 30}ms` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--rk-maroon-deep)" }}>{a.nama_toko}</div>
                    <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                      {a.nama_pemilik} · {a.kecamatan}, {a.kota}
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: st.bg, color: st.fg }}>
                    {st.label}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "var(--rk-ink)", lineHeight: 1.6 }}>
                  <div>{a.email} · {a.wa}</div>
                  <div>{a.alamat}</div>
                  {a.instagram && <div>IG: {a.instagram}</div>}
                  {a.pengalaman && <div style={{ color: "var(--rk-ink-soft)", marginTop: 4 }}>{a.pengalaman}</div>}
                </div>

                <FloristApplicationActions id={a.id} status={a.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
