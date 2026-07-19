import { createClient } from "@/lib/supabase/server";
import ProfilPembeliForm from "@/components/akun/ProfilPembeliForm";

export default async function AkunProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, wa, alamat_default")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="rk-card" style={{ padding: 24, maxWidth: 480 }}>
      <ProfilPembeliForm userId={user.id} profile={profile} />
    </div>
  );
}
