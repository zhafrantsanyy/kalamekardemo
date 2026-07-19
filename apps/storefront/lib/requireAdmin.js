import { createClient as createServerClient } from "@/lib/supabase/server";

// Dipakai di Route Handler /api/admin/* — halaman /admin/* sudah dijaga
// middleware, tapi Route Handler di /api tidak kena matcher middleware
// jadi perlu cek ulang di sini.
export async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { user: null, error: "Akses ditolak." };
  }
  return { user, error: null };
}
