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
