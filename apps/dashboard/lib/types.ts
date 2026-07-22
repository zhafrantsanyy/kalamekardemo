import type { OrderStatus } from "@/lib/orderFlow";

// Bentuk baris tabel `orders` yang relevan untuk dashboard mitra — lihat
// skema aslinya di Supabase (kolom lengkap ada di apps/storefront juga,
// tabel yang sama dipakai lintas workspace).
export interface Order {
  id: string;
  kode: string;
  nama: string;
  wa: string | null;
  alamat: string;
  tanggal: string;
  waktu: string | null;
  kartu: string | null;
  mode: "bouquet" | "wreath" | null;
  ukuran: string;
  items: unknown;
  subtotal: number | null;
  total: number | null;
  status: OrderStatus;
  floris_id: string | null;
  foto_rakitan_url: string | null;
  foto_disetujui: boolean;
  status_log: unknown;
  product_type: "krans" | "buket" | "papan_bunga" | "kustom";
  papan_bunga_config: PapanBungaConfig | null;
  harga_estimasi_min: number | null;
  harga_estimasi_max: number | null;
  harga_final: number | null;
  desain_preview_url: string | null;
  internal_notes: string | null;
  commission_rate: number;
  payout_status: "belum_dibayar" | "dibayar";
  commission_amount: number | null;
  payout_amount: number | null;
  payout_paid_at: string | null;
  payout_note: string | null;
  created_at: string;
}

// Bentuk baris tabel `florists` — lihat migration 01_phase2_auth.sql
// (kolom dasar) dan 09_admin_panel.sql (verified, kategori).
export interface Florist {
  id: string;
  user_id: string | null;
  nama: string;
  area: string | null;
  wa: string | null;
  kategori: string | null;
  rating: number | null;
  aktif: boolean;
  verified: boolean;
  created_at: string;
}

// Bentuk baris tabel `admin_audit_log` — lihat migration 10_payout_audit.sql.
export interface AuditLogEntry {
  id: string;
  admin_id: string | null;
  admin_email: string;
  action: string;
  entity_type: "order" | "florist";
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string;
}

export interface PapanBungaConfig {
  kategoriLabel?: string;
  ukuranLabel?: string;
  bentukLabel?: string;
  ucapan?: string;
  namaUtama?: string;
  namaUtamaUppercase?: boolean;
  teksPendukung?: string;
  namaPengirim?: string;
  catatanFloris?: string;
}
