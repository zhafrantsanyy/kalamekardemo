import { createClient } from "@/lib/supabase/server";
import ProfilFlorisForm from "@/components/mitra/ProfilFlorisForm";

export default async function MitraProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase
    .from("florists")
    .select("id, nama, area, wa")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="rk-card" style={{ padding: 24, maxWidth: 480 }}>
      <ProfilFlorisForm floris={floris} />
    </div>
  );
}
