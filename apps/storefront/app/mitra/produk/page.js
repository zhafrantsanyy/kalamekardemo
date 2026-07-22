import { createClient } from "@/lib/supabase/server";
import ProdukFlorisManager from "@/components/mitra/ProdukFlorisManager";

export default async function MitraProdukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase.from("florists").select("id").eq("user_id", user.id).maybeSingle();

  if (!floris) {
    return (
      <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14 }}>Profil florismu belum lengkap.</p>
      </div>
    );
  }

  const [{ data: produk }, { data: kategori }] = await Promise.all([
    supabase
      .from("florist_products")
      .select("id, nama, deskripsi, harga, image_url, aktif, kategori_id")
      .eq("florist_id", floris.id)
      .order("created_at", { ascending: false }),
    supabase.from("florist_product_categories").select("id, nama").order("nama", { ascending: true }),
  ]);

  return <ProdukFlorisManager florisId={floris.id} produkAwal={produk || []} kategoriList={kategori || []} />;
}
