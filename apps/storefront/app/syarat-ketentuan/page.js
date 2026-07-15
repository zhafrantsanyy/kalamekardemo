export const metadata = {
  title: { absolute: "Syarat & Ketentuan — Kalamekar" },
  description: "Syarat dan ketentuan penggunaan platform Kalamekar untuk pembeli dan florist partner.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <section style={{ padding: "72px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--rk-maroon-deep)", marginBottom: 20 }}>
          Syarat &amp; Ketentuan
        </h1>
        <div style={{ display: "grid", gap: 20, fontSize: 15, lineHeight: 1.7, color: "var(--rk-ink-soft)" }}>
          <p>
            Dengan menggunakan Kalamekar, kamu setuju dengan syarat dan ketentuan berikut. Harap baca dengan
            saksama sebelum memesan atau mendaftar sebagai florist partner.
          </p>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Peran Kalamekar</h2>
            <p>
              Kalamekar adalah marketplace dan direktori yang menghubungkan pembeli dengan florist lokal
              terverifikasi. Transaksi jual-beli, termasuk kesepakatan harga, desain, dan pengiriman, dilakukan
              langsung antara pembeli dan florist melalui WhatsApp.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Tanggung jawab florist</h2>
            <p>
              Florist partner bertanggung jawab atas kualitas produk, ketepatan waktu pengiriman, dan keakuratan
              informasi yang ditampilkan di etalase mereka. Kalamekar berhak menonaktifkan florist yang melanggar
              standar kualitas atau menerima keluhan berulang dari pembeli.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Tanggung jawab pembeli</h2>
            <p>
              Pembeli bertanggung jawab memberikan informasi pengiriman yang benar dan menyelesaikan pembayaran
              sesuai kesepakatan dengan florist. Pembatalan atau perubahan pesanan mengikuti kebijakan
              masing-masing florist.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 8 }}>Perubahan ketentuan</h2>
            <p>
              Kalamekar dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan
              melalui halaman ini. Penggunaan layanan setelah perubahan berarti kamu menyetujui ketentuan yang
              berlaku.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
