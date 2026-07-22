import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

// Katalog & Stok — skeleton Fase 1. Tabel bahan floris + toggle stok
// butuh tabel Supabase baru (belum ada) — dibuatkan migrasinya di Fase 4
// setelah dikonfirmasi.
export default function MitraKatalogPage() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled>+ Tambah Bahan</Button>
      </div>
      <EmptyState message="Katalog bahan belum diisi. Fitur ini disambungkan di Fase 4 setelah skema tabel bahan disetujui." />
    </div>
  );
}
