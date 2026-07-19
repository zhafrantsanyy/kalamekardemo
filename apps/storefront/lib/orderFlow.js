// Urutan status yang bisa dijalani sebuah order setelah di-assign ke floris.
// "batal" sengaja di luar rantai ini — order batal tidak boleh diproses lagi.
export const STATUS_FLOW = ["matching", "dikonfirmasi", "dirakit", "diantar", "selesai"];

// Semua status yang mungkin ada di kolom orders.status — dipakai admin
// (filter daftar order, dropdown override status) yang boleh lihat/pilih
// status apa saja, beda dari floris yang hanya boleh maju satu tahap.
export const ALL_STATUSES = ["baru", "matching", "dikonfirmasi", "dirakit", "diantar", "selesai", "batal"];

export const STATUS_LABEL = {
  baru: "Baru",
  matching: "Menunggu Floris",
  dikonfirmasi: "Dikonfirmasi",
  dirakit: "Sedang Dirakit",
  diantar: "Sedang Diantar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

// Label tombol aksi berdasarkan status order SAAT INI (bukan status tujuan),
// supaya tombol berbunyi seperti perintah ("Mulai rakit") bukan status.
export const ACTION_LABEL = {
  matching: "Terima order",
  dikonfirmasi: "Mulai rakit",
  dirakit: "Sudah dirakit, siap antar",
  diantar: "Tandai sudah diterima",
};

export function nextStatus(current) {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}
