import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Jika env belum diisi, aplikasi tetap jalan dalam "mode demo"
// (pesanan tidak disimpan ke database).
export const supabase = url && key ? createClient(url, key) : null;

export const ADMIN_WA = (import.meta.env.VITE_ADMIN_WA || "").replace(/\D/g, "");
