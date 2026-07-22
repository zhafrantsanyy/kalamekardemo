import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client anon tanpa cookies — untuk halaman publik yang statis/ISR
// (mis. direktori /toko-bunga/[slug]). Tidak memakai lib/supabase/server.js
// karena createClient() di sana memanggil cookies(), yang memaksa
// Next.js keluar dari static rendering meskipun halamannya tidak butuh
// sesi user. Dibatasi RLS "anon baca floris aktif" (aktif = true) di
// tabel florists.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } },
  );
}
