import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client service-role — HANYA boleh diimpor dari Route Handler / server
// code. Tidak pernah dikirim ke bundle client (paket "server-only"
// membuat build gagal kalau ini kebawa ke client component).
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
