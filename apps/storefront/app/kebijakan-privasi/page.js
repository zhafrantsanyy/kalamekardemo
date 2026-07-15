export const metadata = {
  title: { absolute: "Kebijakan Privasi — Kalamekar" },
  description: "Kebijakan privasi Kalamekar mengenai pengumpulan, penggunaan, dan perlindungan data pengguna.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <section style={{ padding: "72px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--rk-maroon-deep)", marginBottom: 20 }}>
          Kebijakan Privasi
        </h1>
        <div style={{ display: "grid", gap: 20, fontSize: 15, lineHeight: 1.7, color: "var(--rk-ink-soft)" }}>
          <p>
            Kalamekar menghormati privasi setiap pengguna platform kami — baik pembeli maupun florist partner.
            Kebijakan ini menjelaskan data apa saja yang kami kumpulkan, bagaimana data tersebut digunakan, dan
            hak yang kamu miliki atas datamu.
          </p>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Data yang kami kumpulkan</h2>
            <p>
              Saat kamu menghubungi kami lewat form kontak atau WhatsApp, kami mengumpulkan nama, alamat email,
              nomor telepon, dan isi pesan yang kamu kirimkan. Untuk florist partner, kami juga mengumpulkan data
              toko seperti alamat usaha dan galeri produk untuk keperluan verifikasi.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Penggunaan data</h2>
            <p>
              Data yang kamu berikan digunakan untuk memproses pertanyaan, menghubungkan pembeli dengan florist
              yang relevan, dan meningkatkan kualitas layanan Kalamekar. Kami tidak menjual data pribadi pengguna
              kepada pihak ketiga.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Hak pengguna</h2>
            <p>
              Kamu berhak meminta salinan data yang kami simpan, meminta koreksi data yang tidak akurat, atau
              meminta penghapusan data dengan menghubungi kami lewat halaman Kontak.
            </p>
          </div>
          <p style={{ fontSize: 13.5 }}>
            Kebijakan ini dapat diperbarui sewaktu-waktu seiring perkembangan layanan Kalamekar. Hubungi kami
            lewat halaman Kontak bila ada pertanyaan lebih lanjut.
          </p>
        </div>
      </div>
    </section>
  );
}
