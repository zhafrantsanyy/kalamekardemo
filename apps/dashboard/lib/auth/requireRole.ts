import { createClient as createServerClient } from "@/lib/supabase/server";

// Model peran di sini struktural (sama seperti storefront), BUKAN kolom
// profiles.role: florist = ada baris di tabel `florists` dengan
// user_id = auth uid; admin = user.app_metadata.role === "admin" (belum
// dipakai di dashboard/ sekarang, disiapkan untuk /admin di masa depan).
export type Role = "florist" | "admin";

// Dipakai di Route Handler /api/mitra/* — halaman /mitra/* sudah dijaga
// middleware, tapi Route Handler tidak kena matcher middleware jadi perlu
// cek ulang di sini (sama alasan seperti requireAdmin.js di storefront).
export async function requireRole(role: Role) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, data: null, error: "Belum masuk." };
  }

  if (role === "florist") {
    const { data: floris } = await supabase
      .from("florists")
      .select("id, nama, area, wa, aktif")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!floris) {
      return { user: null, data: null, error: "Akun ini bukan floris terdaftar." };
    }
    return { user, data: floris, error: null };
  }

  if (role === "admin") {
    if (user.app_metadata?.role !== "admin") {
      return { user: null, data: null, error: "Akses ditolak." };
    }
    return { user, data: null, error: null };
  }

  return { user: null, data: null, error: "Peran tidak dikenal." };
}
