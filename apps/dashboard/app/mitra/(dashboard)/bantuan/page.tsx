import Card from "@/components/ui/Card";

const FAQS = [
  { q: "Bagaimana cara menerima order baru?", a: "Buka tab Order Masuk, tekan Terima Pesanan sebelum batas waktu matching habis." },
  { q: "Kapan saya harus unggah foto bukti rakitan?", a: "Setelah status berubah ke Sedang Dirakit, unggah foto sebelum menandai order sebagai diantar." },
  { q: "Bagaimana mengatur bahan yang stoknya habis?", a: "Buka tab Katalog & Stok, tekan tombol status di kolom Stok untuk menandai habis sementara — otomatis hilang dari Bouquet Builder." },
  { q: "Ke mana menghubungi support platform?", a: "Gunakan tombol Hubungi Support di tab Profil Toko — berbeda dari chat WhatsApp pembeli." },
];

export default function MitraBantuanPage() {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontWeight: 800, color: "var(--dm-forest)", marginBottom: 14 }}>Pertanyaan Umum</div>
      <div style={{ display: "grid", gap: 14 }}>
        {FAQS.map((f) => (
          <div key={f.q} style={{ borderBottom: "1px solid var(--dm-line)", paddingBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--dm-forest)", marginBottom: 5 }}>{f.q}</div>
            <div style={{ fontSize: 13, color: "var(--dm-ink-soft)", lineHeight: 1.55 }}>{f.a}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
