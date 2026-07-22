// Konten 19 halaman momen (flat routes seperti /bunga-wisuda, bukan /momen/bunga-wisuda).
// Tiap page.js di app/[slug]/page.js cukup import MOMEN_DATA[slug] + momenMetadata(slug)
// dan render <MomenPageTemplate data={...} />. Lihat components/momen/MomenPageTemplate.js.

import { SITE_URL as BASE_URL } from "@kalamekar/shared/tokens";

export const MOMEN_SLUGS = [
  // personal
  "bunga-wisuda",
  "bunga-ulang-tahun",
  "bunga-anniversary",
  "bunga-valentine",
  "bunga-hari-ibu",
  "bunga-ucapan-selamat",
  "bunga-cepat-sembuh",
  "bunga-permintaan-maaf",
  // formal / papan bunga
  "papan-bunga-grand-opening",
  "papan-bunga-pernikahan",
  "papan-bunga-selamat-sukses",
  "papan-bunga-anniversary-perusahaan",
  "papan-bunga-duka-cita",
  "papan-bunga-ulang-tahun",
  // duka cita & religi
  "bunga-duka-cita",
  "karangan-bunga-duka-cita",
  "bunga-salib-duka",
  // korporat
  "bunga-kantor",
  "bunga-perusahaan",
];

export const MOMEN_DATA = {
  "bunga-wisuda": {
    slug: "bunga-wisuda",
    kelompok: "personal",
    nama: "Bunga Wisuda",
    metaTitle: "Bunga Wisuda — Rangkaian & Papan Bunga Wisuda | Kalamekar",
    metaDescription:
      "Rayakan momen wisuda dengan buket atau papan bunga terbaik. Pesan lewat WhatsApp, florist terverifikasi siap kirim hari ini.",
    h1: "Bunga Wisuda",
    intro:
      "Wisuda adalah momen pencapaian yang layak dirayakan besar-besaran, dan bunga jadi salah satu cara paling ikonik untuk menyampaikannya. Ada dua bentuk populer yang bisa kamu pilih — buket genggam yang pas untuk dipegang dan difoto bersama wisudawan, atau papan bunga besar yang dipajang di area kampus sebagai ucapan yang lebih terlihat dari jauh. Florist partner Kalamekar terbiasa menangani lonjakan pesanan musim wisuda, jadi rangkaianmu tetap rapi dan tepat waktu meski dipesan mendadak. Baik untuk merayakan kelulusan sendiri maupun mengejutkan teman dan keluarga, kamu tinggal pilih gaya yang paling sesuai lalu pesan langsung lewat WhatsApp.",
    kenapaPilihIni: [
      "Paham tren buket wisuda kekinian, dari money bouquet sampai buket boneka dan snack",
      "Bisa custom warna rangkaian sesuai warna almamater kampusmu",
      "Pengiriman tepat waktu langsung ke lokasi wisuda, bahkan untuk pesanan mendadak",
    ],
    jenisRangkaian: [
      { nama: "Buket Wisuda Klasik", deskripsi: "Rangkaian bunga segar genggam, cocok untuk foto momen kelulusan.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Money Bouquet Wisuda", deskripsi: "Buket kreasi uang kertas yang dirangkai seperti bunga, favorit generasi sekarang.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Papan Bunga Wisuda", deskripsi: "Ucapan besar yang dipajang di area kampus, terlihat dari jarak jauh.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Kapan waktu terbaik memesan bunga wisuda?", jawaban: "Sebaiknya pesan H-2 sampai H-3 sebelum hari wisuda, terutama karena musim wisuda biasanya ramai dan slot florist bisa penuh lebih cepat dari biasanya." },
      { pertanyaan: "Bisa custom warna sesuai almamater?", jawaban: "Bisa. Sebutkan warna almamater atau tema yang kamu inginkan saat memesan, florist akan menyesuaikan pilihan bunga dan pita." },
      { pertanyaan: "Isi buket wisuda biasanya apa saja?", jawaban: "Umumnya kombinasi bunga segar, tapi banyak juga yang menambahkan snack, boneka kecil, atau uang kertas yang dirangkai seperti money bouquet." },
      { pertanyaan: "Bisa kirim langsung ke lokasi wisuda?", jawaban: "Bisa. Sertakan nama gedung, kampus, dan perkiraan waktu acara supaya florist bisa mengatur jadwal pengiriman yang pas." },
    ],
  },

  "bunga-ulang-tahun": {
    slug: "bunga-ulang-tahun",
    kelompok: "personal",
    nama: "Bunga Ulang Tahun",
    metaTitle: "Bunga Ulang Tahun — Buket Spesial untuk Orang Tersayang | Kalamekar",
    metaDescription:
      "Kejutkan orang tersayang dengan buket ulang tahun. Berbagai pilihan warna dan gaya, pesan mudah lewat WhatsApp.",
    h1: "Bunga Ulang Tahun",
    intro:
      "Buket ulang tahun adalah cara sederhana tapi berkesan untuk menunjukkan kamu ingat dan peduli di hari spesial seseorang. Kalamekar menghadirkan berbagai pilihan warna dan gaya rangkaian, dari yang ceria dan playful sampai yang elegan dan minimalis, sehingga kamu bisa menyesuaikan dengan kepribadian penerimanya. Kartu ucapan personal bisa ditambahkan supaya pesanmu terasa lebih hangat. Kalau kamu mencari kejutan yang lebih besar dan mencolok — misalnya untuk ulang tahun milestone atau ingin mengejutkan seseorang di kantornya — lihat juga pilihan papan bunga ulang tahun kami yang dirancang untuk momen yang lebih meriah.",
    kenapaPilihIni: [
      "Bisa custom kartu ucapan sesuai pesan personalmu",
      "Opsi kombinasi dengan cokelat atau kado kecil lain",
      "Pengiriman same-day untuk kejutan hari itu juga",
    ],
    jenisRangkaian: [
      { nama: "Buket Ulang Tahun Ceria", deskripsi: "Warna-warni cerah, cocok untuk sahabat atau pasangan yang playful.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket Ulang Tahun Elegan", deskripsi: "Palet warna lembut dan rapi, cocok untuk kesan yang lebih dewasa.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Parcel Bunga + Kado", deskripsi: "Kombinasi buket dengan cokelat atau hadiah kecil lainnya.", linkKategori: "/kategori#parcel-bunga" },
    ],
    faq: [
      { pertanyaan: "Bisa tambah kartu ucapan pribadi?", jawaban: "Bisa. Tulis pesanmu saat checkout dan florist akan menyertakan kartu ucapan bersama buketnya." },
      { pertanyaan: "Bisa kirim tanpa diketahui penerima (kejutan)?", jawaban: "Bisa. Informasikan ke florist soal rencana kejutanmu, misalnya waktu pengiriman spesifik atau titipan ke pihak ketiga, supaya bisa dikoordinasikan." },
      { pertanyaan: "Berapa lama bunga ulang tahun bertahan segar?", jawaban: "Umumnya sekitar 4-7 hari tergantung jenis bunga dan perawatan, seperti rutin mengganti air dan menghindari sinar matahari langsung." },
      { pertanyaan: "Ada opsi bunga yang tahan lebih lama?", jawaban: "Ada, kamu bisa memilih bunga artificial untuk kado yang bisa dipajang dalam jangka panjang tanpa perlu perawatan.", link: { label: "Lihat Bunga Artificial", href: "/kategori#bunga-artificial" } },
      { pertanyaan: "Apa bedanya dengan papan bunga ulang tahun?", jawaban: "Buket ini berbentuk genggam dan personal, cocok diberikan langsung ke tangan penerima. Kalau kamu ingin kejutan yang lebih besar dan mencolok — misalnya untuk ulang tahun milestone atau dikirim ke kantor — lihat pilihan papan bunga ulang tahun kami.", link: { label: "Lihat Papan Bunga Ulang Tahun", href: "/papan-bunga-ulang-tahun" } },
    ],
  },

  "bunga-anniversary": {
    slug: "bunga-anniversary",
    kelompok: "personal",
    nama: "Bunga Anniversary",
    metaTitle: "Bunga Anniversary — Rayakan Hari Jadi dengan Buket Spesial | Kalamekar",
    metaDescription:
      "Rayakan hari jadi pernikahan atau hubungan dengan buket anniversary romantis. Pesan lewat WhatsApp, kirim hari ini juga.",
    h1: "Bunga Anniversary",
    intro:
      "Merayakan hari jadi — baik pernikahan, hubungan, maupun persahabatan lama — terasa lebih istimewa dengan rangkaian bunga yang dipilih khusus untuk momen itu. Buket anniversary dari Kalamekar dirancang dengan sentuhan romantis, menggunakan bunga-bunga yang sarat makna seperti mawar merah atau pink, dan bisa dipadukan dengan lilin atau cokelat untuk kesan yang lebih lengkap. Halaman ini fokus untuk perayaan personal antar pasangan atau orang terdekat. Kalau yang kamu rayakan adalah hari jadi bisnis atau perusahaan, kunjungi halaman papan bunga anniversary perusahaan kami yang dirancang dengan tone dan format yang lebih sesuai untuk konteks korporat.",
    kenapaPilihIni: [
      "Pilihan bunga bermakna romantis seperti mawar merah dan pink",
      "Bisa dikombinasikan dengan lilin atau cokelat untuk kesan lebih lengkap",
      "Opsi permintaan jam pengiriman malam hari untuk momen candle light dinner",
    ],
    jenisRangkaian: [
      { nama: "Buket Mawar Klasik", deskripsi: "Rangkaian mawar merah atau pink, pilihan paling populer untuk anniversary.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket Anniversary Mewah", deskripsi: "Kombinasi bunga premium dengan kemasan yang lebih elegan.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Bunga Meja untuk Dinner", deskripsi: "Rangkaian vas kecil untuk mempercantik meja makan romantis.", linkKategori: "/kategori#bunga-meja" },
    ],
    faq: [
      { pertanyaan: "Bunga apa yang paling cocok untuk anniversary?", jawaban: "Mawar adalah pilihan paling populer karena maknanya yang romantis, tapi kamu bisa menyesuaikan dengan bunga favorit pasanganmu." },
      { pertanyaan: "Bisa request jam pengiriman malam hari?", jawaban: "Bisa, koordinasikan waktu pengiriman yang kamu inginkan saat memesan supaya florist bisa mengatur jadwalnya." },
      { pertanyaan: "Bisa tambah pesan romantis di kartu ucapan?", jawaban: "Bisa. Tulis pesan yang kamu inginkan dan florist akan menyertakan kartu ucapan bersama buketnya." },
      { pertanyaan: "Ada paket yang termasuk hadiah lain?", jawaban: "Ada, kamu bisa memilih kombinasi buket dengan cokelat atau parcel kecil lainnya untuk kesan yang lebih lengkap." },
      { pertanyaan: "Apa bedanya dengan papan bunga anniversary perusahaan?", jawaban: "Buket ini dirancang untuk perayaan personal antara pasangan atau orang terdekat. Untuk merayakan hari jadi bisnis atau perusahaan, gunakan papan bunga anniversary perusahaan yang formatnya lebih formal dan korporat.", link: { label: "Lihat Papan Bunga Anniversary Perusahaan", href: "/papan-bunga-anniversary-perusahaan" } },
    ],
  },

  "bunga-valentine": {
    slug: "bunga-valentine",
    kelompok: "personal",
    nama: "Bunga Valentine",
    metaTitle: "Bunga Valentine — Buket Romantis untuk Hari Kasih Sayang | Kalamekar",
    metaDescription:
      "Sambut Hari Valentine dengan buket bunga romantis. Pesan lebih awal, florist terverifikasi siap membantu.",
    h1: "Bunga Valentine",
    intro:
      "Setiap mendekati 14 Februari, permintaan buket valentine melonjak tajam di seluruh florist partner Kalamekar. Selain mawar merah klasik yang identik dengan hari kasih sayang, ada banyak variasi warna dan gaya lain yang bisa kamu pilih supaya ucapanmu terasa lebih personal dan tidak seragam dengan kebanyakan orang. Karena volume pesanan yang tinggi di musim ini, kami sangat menyarankan untuk pre-order lebih awal supaya florist punya cukup waktu menyiapkan rangkaian terbaik dan memastikan pengiriman tepat waktu di hari-H.",
    kenapaPilihIni: [
      "Florist berpengalaman menangani lonjakan pesanan musim valentine",
      "Tersedia opsi buket eksklusif di luar mawar merah klasik",
      "Bisa pre-order dari jauh hari untuk memastikan slot pengiriman",
    ],
    jenisRangkaian: [
      { nama: "Buket Mawar Merah Klasik", deskripsi: "Pilihan tradisional yang selalu jadi favorit di Hari Valentine.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket Valentine Mix Warna", deskripsi: "Kombinasi warna selain merah untuk kesan yang lebih unik.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket + Cokelat", deskripsi: "Paket lengkap buket bunga dipadukan dengan cokelat pilihan.", linkKategori: "/kategori#parcel-bunga" },
    ],
    faq: [
      { pertanyaan: "Kapan sebaiknya pesan bunga valentine?", jawaban: "Sangat disarankan pesan mulai H-7 sebelum 14 Februari, karena slot florist di musim valentine cepat penuh." },
      { pertanyaan: "Apakah harga naik saat musim valentine?", jawaban: "Ada kemungkinan penyesuaian harga musiman mengingat tingginya permintaan dan biaya bahan baku bunga tertentu di periode ini — florist akan menginformasikan harga final sebelum kamu konfirmasi pesanan." },
      { pertanyaan: "Ada pilihan warna lain selain merah?", jawaban: "Ada. Kamu bisa memilih kombinasi warna pink, putih, atau mix sesuai selera." },
      { pertanyaan: "Bisa pesan mendadak di hari-H valentine?", jawaban: "Bisa dicoba, tapi risikonya stok dan slot pengiriman florist partner biasanya sudah terbatas atau penuh di hari-H — kami tetap sarankan pre-order lebih awal untuk hasil terbaik." },
    ],
  },

  "bunga-hari-ibu": {
    slug: "bunga-hari-ibu",
    kelompok: "personal",
    nama: "Bunga Hari Ibu",
    metaTitle: "Bunga Hari Ibu — Ucapan Terima Kasih untuk Ibu | Kalamekar",
    metaDescription:
      "Kirim buket bunga hari ibu sebagai ucapan terima kasih dan kasih sayang. Pesan lewat WhatsApp, kirim hari ini juga.",
    h1: "Bunga Hari Ibu",
    intro:
      "Hari Ibu yang jatuh setiap 22 Desember adalah momen tepat untuk menyampaikan rasa terima kasih dan kasih sayang lewat rangkaian bunga yang hangat. Karena permintaan biasanya melonjak signifikan mendekati tanggal tersebut, kami menyarankan untuk memesan lebih awal supaya florist punya waktu cukup menyiapkan buket terbaik. Kamu bisa memilih warna-warna lembut dan elegan yang biasanya disukai ibu, lalu melengkapi rangkaian dengan kartu ucapan personal supaya pesanmu terasa lebih bermakna.",
    kenapaPilihIni: [
      "Pilihan warna lembut dan elegan yang sesuai selera ibu",
      "Bisa tambah kartu ucapan personal",
      "Florist siap menghadapi lonjakan pesanan musim Hari Ibu",
    ],
    jenisRangkaian: [
      { nama: "Buket Hari Ibu Elegan", deskripsi: "Rangkaian warna pastel yang lembut dan hangat.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket + Parcel Hampers", deskripsi: "Kombinasi buket dengan hampers untuk hadiah yang lebih lengkap.", linkKategori: "/kategori#parcel-bunga" },
    ],
    faq: [
      { pertanyaan: "Kapan sebaiknya pesan bunga Hari Ibu?", jawaban: "Sarankan pesan mulai H-5 sampai H-7 sebelum 22 Desember, karena permintaan musiman biasanya cukup tinggi mendekati tanggal tersebut." },
      { pertanyaan: "Bunga apa yang cocok untuk Hari Ibu?", jawaban: "Lily dan mawar pastel adalah pilihan populer, tapi kamu bisa menyesuaikan dengan bunga favorit ibu." },
      { pertanyaan: "Bisa custom kartu ucapan?", jawaban: "Bisa. Tulis pesanmu saat memesan dan florist akan menyertakan kartu ucapan bersama buketnya." },
      { pertanyaan: "Ada paket kombinasi dengan hadiah lain?", jawaban: "Ada, kamu bisa memilih paket parcel bunga yang dipadukan dengan hampers atau hadiah kecil lainnya." },
    ],
  },

  "bunga-ucapan-selamat": {
    slug: "bunga-ucapan-selamat",
    kelompok: "personal",
    nama: "Bunga Ucapan Selamat",
    metaTitle: "Bunga Ucapan Selamat — Rayakan Pencapaian Orang Terdekat | Kalamekar",
    metaDescription:
      "Kirim buket bunga ucapan selamat untuk merayakan pencapaian, promosi, atau kabar baik. Pesan mudah lewat WhatsApp.",
    h1: "Bunga Ucapan Selamat",
    intro:
      "Tidak semua kabar baik butuh perayaan besar — kadang buket bunga yang dikirim tepat waktu sudah cukup untuk menunjukkan kamu ikut senang atas pencapaian seseorang. Halaman ini fleksibel untuk berbagai momen: promosi jabatan, kelulusan, kelahiran anak, atau prestasi lain yang layak diapresiasi. Kalamekar menghadirkan pilihan buket ceria maupun elegan yang bisa disesuaikan dengan jenis pencapaian dan siapa penerimanya, cocok dikirim langsung ke rumah maupun ke kantor. Kalau kamu butuh versi yang lebih formal untuk dipajang di lokasi acara, lihat juga pilihan papan bunga selamat & sukses kami.",
    kenapaPilihIni: [
      "Pilihan buket ceria dan elegan untuk berbagai jenis pencapaian",
      "Rangkaian bisa disesuaikan dengan konteks ucapanmu",
      "Cocok dikirim ke rumah maupun langsung ke kantor",
    ],
    jenisRangkaian: [
      { nama: "Buket Ucapan Selamat", deskripsi: "Rangkaian fleksibel untuk berbagai momen pencapaian.", linkKategori: "/kategori#buket-bunga" },
    ],
    faq: [
      { pertanyaan: "Untuk momen apa saja bunga ucapan selamat cocok?", jawaban: "Cocok untuk promosi jabatan, kelulusan, pencapaian bisnis, kelahiran, atau kabar baik lainnya yang ingin kamu rayakan bersama." },
      { pertanyaan: "Bisa custom kartu ucapan?", jawaban: "Bisa. Tulis pesan yang kamu inginkan dan florist akan menyertakan kartu ucapan bersama buketnya." },
      { pertanyaan: "Bisa dikirim ke kantor penerima?", jawaban: "Bisa, sertakan alamat kantor lengkap beserta nama penerima supaya pengiriman lebih lancar." },
      { pertanyaan: "Apa bedanya dengan papan bunga selamat & sukses?", jawaban: "Buket ini lebih personal dan fleksibel untuk berbagai pencapaian, sementara papan bunga selamat & sukses formatnya lebih formal dan biasanya dipajang di lokasi acara atau kantor.", link: { label: "Lihat Papan Bunga Selamat & Sukses", href: "/papan-bunga-selamat-sukses" } },
    ],
  },

  "bunga-cepat-sembuh": {
    slug: "bunga-cepat-sembuh",
    kelompok: "personal",
    nama: "Bunga Cepat Sembuh",
    metaTitle: "Bunga Cepat Sembuh — Kirim Semangat untuk Orang Tersayang | Kalamekar",
    metaDescription:
      "Kirim buket bunga cepat sembuh sebagai bentuk perhatian untuk orang yang sedang sakit. Pesan lewat WhatsApp, kirim hari ini.",
    h1: "Bunga Cepat Sembuh",
    intro:
      "Mengunjungi atau mengirim kabar ke orang yang sedang sakit terasa lebih hangat dengan tambahan buket bunga yang membawa semangat. Berbeda dari nuansa duka cita yang lebih formal dan sendu, rangkaian bunga cepat sembuh dirancang dengan tone yang lebih ringan dan penuh perhatian — cocok dikirim langsung ke rumah maupun ke kamar rawat rumah sakit. Kami memilihkan bunga dengan aroma yang tidak terlalu menyengat dan ukuran yang kompak, supaya tetap nyaman berada di ruangan pasien tanpa mengganggu istirahatnya.",
    kenapaPilihIni: [
      "Pilihan bunga beraroma ringan yang nyaman untuk ruangan rumah sakit",
      "Ukuran kompak supaya tidak memakan banyak tempat di kamar rawat",
      "Bisa tambah kartu ucapan yang membawa semangat untuk yang sakit",
    ],
    jenisRangkaian: [
      { nama: "Buket Cepat Sembuh Ringan", deskripsi: "Rangkaian kompak dengan aroma lembut, cocok untuk kamar rawat.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Bunga Meja untuk Kamar Rawat", deskripsi: "Vas kecil yang tidak memakan banyak tempat di ruangan pasien.", linkKategori: "/kategori#bunga-meja" },
    ],
    faq: [
      { pertanyaan: "Ada rekomendasi bunga yang aman untuk ruang rumah sakit?", jawaban: "Pilih rangkaian beraroma ringan dan ukuran kompak, supaya tetap nyaman untuk pasien dan tidak mengganggu ruangan yang biasanya terbatas." },
      { pertanyaan: "Bisa kirim langsung ke rumah sakit?", jawaban: "Bisa. Sertakan nama pasien, nomor kamar, dan nama rumah sakit yang lengkap supaya kurir tidak kesulitan mengantarkan." },
      { pertanyaan: "Bisa custom kartu ucapan semangat?", jawaban: "Bisa. Tulis pesan semangatmu dan florist akan menyertakan kartu ucapan bersama buketnya." },
      { pertanyaan: "Berapa lama waktu pengirimannya?", jawaban: "Estimasi umum mengikuti waktu pengiriman same-day di kotamu — kalau kebutuhanmu mendesak, koordinasikan langsung dengan florist via WhatsApp untuk kepastian waktu." },
    ],
  },

  "bunga-permintaan-maaf": {
    slug: "bunga-permintaan-maaf",
    kelompok: "personal",
    nama: "Bunga Permintaan Maaf",
    metaTitle: "Bunga Permintaan Maaf — Sampaikan Maaf dengan Tulus | Kalamekar",
    metaDescription:
      "Kirim buket bunga permintaan maaf untuk menyampaikan penyesalan dengan cara yang berkesan. Pesan lewat WhatsApp.",
    h1: "Bunga Permintaan Maaf",
    intro:
      "Kadang kata-kata saja terasa belum cukup untuk menyampaikan penyesalan yang tulus. Buket bunga permintaan maaf bisa jadi cara yang lebih berkesan untuk menunjukkan kesungguhanmu, baik untuk pasangan, keluarga, sahabat, maupun rekan kerja. Kalamekar menghadirkan pilihan warna dan jenis bunga yang menyampaikan ketulusan, dan kamu bisa melengkapi rangkaian dengan kartu ucapan personal yang berisi pesan panjang kalau memang dibutuhkan. Kalau situasinya butuh pendekatan yang lebih diskret, beberapa florist partner kami juga bisa membantu pengiriman tanpa mencantumkan identitas pengirim — cukup koordinasikan langsung soal kebutuhan ini.",
    kenapaPilihIni: [
      "Pilihan warna dan jenis bunga yang menyampaikan ketulusan",
      "Bisa custom kartu ucapan personal dengan pesan panjang",
      "Opsi pengiriman diskret kalau situasinya membutuhkan",
    ],
    jenisRangkaian: [
      { nama: "Buket Permintaan Maaf", deskripsi: "Rangkaian warna lembut yang menyampaikan ketulusan.", linkKategori: "/kategori#buket-bunga" },
      { nama: "Buket + Kartu Personal", deskripsi: "Buket dilengkapi kartu ucapan dengan pesan personal yang lebih panjang.", linkKategori: "/kategori#buket-bunga" },
    ],
    faq: [
      { pertanyaan: "Bunga apa yang cocok untuk permintaan maaf?", jawaban: "Umumnya warna lembut seperti putih atau pastel dipilih untuk kesan tulus, tapi kamu tetap bisa menyesuaikan dengan preferensi penerima." },
      { pertanyaan: "Bisa custom pesan panjang di kartu ucapan?", jawaban: "Bisa. Tulis pesanmu selengkap yang kamu butuhkan, florist akan menyertakannya di kartu ucapan bersama buket." },
      { pertanyaan: "Bisa dikirim tanpa mencantumkan nama pengirim?", jawaban: "Untuk sebagian florist partner ini memungkinkan, tapi kebijakannya bisa berbeda-beda — koordinasikan langsung soal kebutuhan ini saat memesan." },
      { pertanyaan: "Berapa lama bunga permintaan maaf bertahan segar?", jawaban: "Umumnya 4-7 hari tergantung jenis bunga dan cara perawatannya." },
    ],
  },

  "papan-bunga-grand-opening": {
    slug: "papan-bunga-grand-opening",
    kelompok: "formal",
    nama: "Papan Bunga Grand Opening",
    metaTitle: "Papan Bunga Grand Opening — Ucapan Sukses Pembukaan Usaha | Kalamekar",
    metaDescription:
      "Kirim papan bunga grand opening untuk ucapan sukses pembukaan usaha rekan atau klien. Proses cepat, florist terverifikasi.",
    h1: "Papan Bunga Grand Opening",
    intro:
      "Papan bunga sudah jadi bagian tak terpisahkan dari budaya bisnis Indonesia untuk menyambut pembukaan usaha baru — mulai dari toko, restoran, kantor cabang, sampai kantor pusat perusahaan. Ukurannya yang besar dan dipajang di lokasi acara membuat ucapanmu langsung terlihat oleh tamu dan pengunjung yang hadir. Karena ini biasanya jadi representasi hubungan bisnis atau relasi personal dengan si pemilik usaha, penting untuk memastikan teks ucapan dan nama pengirim tertulis dengan tepat. Florist partner Kalamekar terbiasa menangani standar ukuran untuk kebutuhan acara bisnis dan siap membantu proses dari awal sampai pemasangan di lokasi.",
    kenapaPilihIni: [
      "Paham standar ukuran papan bunga untuk acara bisnis",
      "Bantu penyusunan teks ucapan supaya formatnya tepat",
      "Pengiriman terkoordinasi sesuai jadwal acara pembukaan",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Standard", deskripsi: "Ukuran umum yang paling sering dipesan untuk acara bisnis.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Papan Bunga Premium", deskripsi: "Ukuran lebih besar dengan pilihan bunga yang lebih eksklusif.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Standing Flower", deskripsi: "Alternatif dekoratif yang bisa ditempatkan di area pintu masuk atau booth.", linkKategori: "/kategori#standing-flower" },
    ],
    faq: [
      { pertanyaan: "Berapa ukuran standar papan bunga grand opening?", jawaban: "Ada beberapa opsi ukuran yang bisa disesuaikan dengan budget dan lokasi acara — florist akan membantu merekomendasikan yang paling pas." },
      { pertanyaan: "Bagaimana cara menentukan teks ucapan?", jawaban: "Sertakan nama pengirim dan pesan singkat yang kamu inginkan, florist akan membantu memformatnya supaya terbaca rapi di papan bunga." },
      { pertanyaan: "Apakah papan bunga dipasang di lokasi atau hanya diantar?", jawaban: "Umumnya florist membantu pemasangan langsung di lokasi acara — konfirmasikan detail ini saat pemesanan." },
      { pertanyaan: "Berapa lama sebelum acara sebaiknya pesan?", jawaban: "Sarankan pesan H-2 sampai H-3 sebelum acara supaya florist punya cukup waktu untuk persiapan dan koordinasi pengiriman." },
    ],
  },

  "papan-bunga-pernikahan": {
    slug: "papan-bunga-pernikahan",
    kelompok: "formal",
    nama: "Papan Bunga Pernikahan",
    metaTitle: "Papan Bunga Pernikahan — Ucapan Selamat untuk Pasangan | Kalamekar",
    metaDescription:
      "Kirim papan bunga pernikahan sebagai ucapan selamat untuk pasangan yang menikah. Florist terverifikasi, proses cepat.",
    h1: "Papan Bunga Pernikahan",
    intro:
      "Mengirim papan bunga ke lokasi resepsi sudah jadi tradisi umum untuk menyampaikan ucapan selamat kepada pasangan yang menikah. Dibanding papan bunga formal untuk acara bisnis, desain papan bunga pernikahan biasanya dibuat lebih elegan dan lembut, dengan pilihan warna yang bisa disesuaikan dengan tema pernikahan si pasangan. Florist partner Kalamekar berpengalaman mengoordinasikan pengiriman langsung ke venue acara, termasuk memperhitungkan waktu supaya papan bunga sudah terpasang rapi sebelum tamu mulai berdatangan.",
    kenapaPilihIni: [
      "Desain lebih elegan dan lembut dibanding papan bunga formal bisnis",
      "Warna rangkaian bisa disesuaikan dengan tema pernikahan",
      "Koordinasi pengiriman langsung ke venue acara",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Elegan", deskripsi: "Desain lembut dengan warna yang bisa disesuaikan tema pernikahan.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Standing Flower Dekoratif", deskripsi: "Pilihan dekorasi tambahan untuk mempercantik area resepsi.", linkKategori: "/kategori#standing-flower" },
      { nama: "Karangan Bunga Meja Resepsi", deskripsi: "Rangkaian meja untuk melengkapi dekorasi meja tamu atau prasmanan.", linkKategori: "/kategori#bunga-meja" },
    ],
    faq: [
      { pertanyaan: "Bisa custom warna sesuai tema pernikahan?", jawaban: "Bisa. Sebutkan tema warna pernikahannya saat memesan, florist akan menyesuaikan pilihan bunga dan pita." },
      { pertanyaan: "Bagaimana pengiriman ke venue diatur?", jawaban: "Sertakan alamat venue lengkap beserta perkiraan waktu acara supaya florist bisa mengatur jadwal pemasangan sebelum tamu datang." },
      { pertanyaan: "Ada paket dekorasi tambahan?", jawaban: "Ada, kamu bisa menambahkan standing flower atau karangan bunga meja untuk melengkapi dekorasi area resepsi." },
      { pertanyaan: "Berapa lama sebelum hari-H sebaiknya pesan?", jawaban: "Sarankan pesan H-5 sampai H-7 sebelum hari pernikahan, terutama kalau kamu juga ingin request dekorasi tambahan." },
    ],
  },

  "papan-bunga-selamat-sukses": {
    slug: "papan-bunga-selamat-sukses",
    kelompok: "formal",
    nama: "Papan Bunga Selamat & Sukses",
    metaTitle: "Papan Bunga Selamat & Sukses — Ucapan Formal untuk Pencapaian | Kalamekar",
    metaDescription:
      "Kirim papan bunga selamat & sukses untuk merayakan pencapaian bisnis atau karier rekan/klien. Florist terverifikasi, proses cepat.",
    h1: "Papan Bunga Selamat & Sukses",
    intro:
      "Selain grand opening, ada banyak momen bisnis lain yang biasanya dirayakan dengan papan bunga — pelantikan jabatan baru, pencapaian target perusahaan, pembukaan cabang, sampai penghargaan bisnis. Papan bunga selamat & sukses dirancang untuk konteks yang lebih luas ini, dengan standar ukuran dan format teks ucapan formal yang sama rapinya seperti papan bunga bisnis lainnya. Florist partner Kalamekar siap mengoordinasikan pengiriman langsung ke lokasi acara atau kantor penerima sesuai jadwal yang kamu butuhkan.",
    kenapaPilihIni: [
      "Standar ukuran dan format teks ucapan formal untuk konteks bisnis",
      "Cocok untuk berbagai momen pencapaian karier maupun perusahaan",
      "Pengiriman terkoordinasi ke lokasi acara atau kantor",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Selamat Standard", deskripsi: "Ukuran umum untuk berbagai momen pencapaian bisnis.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Papan Bunga Selamat Premium", deskripsi: "Ukuran lebih besar dengan pilihan bunga yang lebih eksklusif.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Untuk acara apa saja papan bunga ini cocok?", jawaban: "Cocok untuk pelantikan jabatan, pencapaian bisnis, pembukaan cabang, penghargaan, atau momen formal lain yang ingin kamu rayakan." },
      { pertanyaan: "Bagaimana cara menentukan teks ucapan?", jawaban: "Sertakan nama pengirim dan pesan singkat yang kamu inginkan, florist akan membantu memformatnya di papan bunga." },
      { pertanyaan: "Apakah dipasang langsung di lokasi acara?", jawaban: "Bisa, konfirmasikan detail lokasi dan waktu acara saat memesan supaya florist bisa mengatur pemasangan." },
      { pertanyaan: "Berapa lama sebelum acara sebaiknya pesan?", jawaban: "Sarankan H-2 sampai H-3 sebelum acara supaya florist punya cukup waktu persiapan." },
      { pertanyaan: "Apa bedanya dengan bunga ucapan selamat biasa?", jawaban: "Papan bunga ini formatnya formal dan besar, biasa dipajang di lokasi acara atau kantor. Untuk ucapan yang lebih personal dan fleksibel, seperti dikirim langsung ke rumah, gunakan buket bunga ucapan selamat.", link: { label: "Lihat Bunga Ucapan Selamat", href: "/bunga-ucapan-selamat" } },
    ],
  },

  "papan-bunga-anniversary-perusahaan": {
    slug: "papan-bunga-anniversary-perusahaan",
    kelompok: "formal",
    nama: "Papan Bunga Anniversary Perusahaan",
    metaTitle: "Papan Bunga Anniversary Perusahaan — Ucapan untuk Hari Jadi Bisnis | Kalamekar",
    metaDescription:
      "Kirim papan bunga anniversary perusahaan sebagai ucapan untuk hari jadi bisnis rekan atau klien. Florist terverifikasi.",
    h1: "Papan Bunga Anniversary Perusahaan",
    intro:
      "Hari jadi perusahaan adalah momen formal yang biasanya dirayakan dengan cara yang berbeda dari anniversary personal — lebih fokus pada apresiasi profesional dan hubungan bisnis, bukan romantisme. Papan bunga anniversary perusahaan dirancang khusus untuk konteks ini, dengan standar ukuran dan etika penulisan ucapan yang sesuai untuk relasi bisnis atau klien. Florist partner Kalamekar memahami format yang tepat untuk momen korporat semacam ini, dan beberapa florist bahkan bisa menyesuaikan warna rangkaian dengan identitas brand perusahaan penerima.",
    kenapaPilihIni: [
      "Paham standar ukuran dan etika ucapan untuk konteks bisnis",
      "Beberapa florist bisa custom warna sesuai identitas brand perusahaan",
      "Pengiriman terkoordinasi sesuai jadwal acara perusahaan",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Anniversary Korporat", deskripsi: "Ukuran dan format formal untuk perayaan hari jadi perusahaan.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Apa bedanya dengan bunga anniversary personal?", jawaban: "Halaman ini khusus untuk merayakan hari jadi perusahaan atau bisnis, dengan format formal dan tone profesional. Untuk perayaan hari jadi pernikahan atau hubungan personal, gunakan bunga anniversary yang tone-nya lebih romantis.", link: { label: "Lihat Bunga Anniversary", href: "/bunga-anniversary" } },
      { pertanyaan: "Bisa custom warna sesuai identitas brand perusahaan?", jawaban: "Tergantung ketersediaan florist — tanyakan langsung saat memesan apakah mereka bisa menyesuaikan warna sesuai brand perusahaanmu." },
      { pertanyaan: "Bagaimana pengiriman ke kantor diatur?", jawaban: "Sertakan alamat kantor dan waktu acara yang lengkap supaya florist bisa mengatur jadwal pengiriman dan pemasangan." },
      { pertanyaan: "Berapa lama sebelum acara sebaiknya pesan?", jawaban: "Sarankan H-2 sampai H-3 sebelum acara supaya florist punya cukup waktu persiapan." },
    ],
  },

  "papan-bunga-duka-cita": {
    slug: "papan-bunga-duka-cita",
    kelompok: "formal",
    nama: "Papan Bunga Duka Cita",
    metaTitle: "Papan Bunga Duka Cita — Kirim ke Lokasi dengan Cepat | Kalamekar",
    metaDescription:
      "Papan bunga duka cita untuk ucapan belasungkawa, dikirim langsung ke lokasi acara. Proses cepat, florist siap membantu.",
    h1: "Papan Bunga Duka Cita",
    intro:
      "Papan bunga duka cita adalah bentuk belasungkawa berukuran besar yang dipajang berdiri di rumah duka atau tempat ibadah, biasanya untuk mewakili ucapan dari perusahaan, komunitas, atau kelompok kerabat. Karena kebutuhannya kerap mendesak, kecepatan pengiriman jadi hal yang paling penting — florist partner Kalamekar memahami standar ukuran papan bunga duka cita untuk berbagai kepercayaan dan siap membantu proses pemesanan sampai pemasangan di lokasi secepat mungkin. Kami menyampaikan halaman ini dengan penuh rasa hormat, dan siap membantumu menyampaikan belasungkawa dengan cara yang layak.",
    kenapaPilihIni: [
      "Paham standar papan bunga duka cita untuk berbagai kepercayaan",
      "Proses cepat untuk kebutuhan yang sifatnya mendesak",
      "Bantu pemasangan langsung di lokasi rumah duka atau tempat ibadah",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Duka Cita Standard", deskripsi: "Ukuran umum yang paling sering dipesan untuk belasungkawa.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Papan Bunga Duka Cita Premium", deskripsi: "Ukuran lebih besar dengan susunan bunga yang lebih lengkap.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Berapa lama waktu pengiriman untuk kebutuhan mendesak?", jawaban: "Kami memahami kebutuhan ini sering mendesak — hubungi florist langsung via WhatsApp untuk memastikan estimasi waktu tercepat yang bisa mereka penuhi di kotamu." },
      { pertanyaan: "Informasi apa yang perlu disiapkan saat memesan?", jawaban: "Siapkan nama pengirim, teks ucapan, dan alamat lengkap rumah duka atau tempat ibadah beserta waktu dibutuhkan." },
      { pertanyaan: "Apakah papan bunga dipasang otomatis di lokasi?", jawaban: "Umumnya ya, florist akan membantu pemasangan langsung di lokasi — konfirmasikan detail ini saat pemesanan." },
      { pertanyaan: "Ada perbedaan untuk berbagai kepercayaan?", jawaban: "Desain dan simbol pada papan bunga bisa disesuaikan dengan kepercayaan yang dianut — sampaikan preferensimu saat memesan." },
      { pertanyaan: "Apa bedanya dengan karangan bunga atau bunga duka cita?", jawaban: "Papan bunga ini ukurannya paling besar dan berdiri, cocok mewakili ucapan formal dari kelompok atau perusahaan. Karangan bunga duka cita bentuknya lebih kecil dan fleksibel, sementara bunga duka cita adalah halaman panduan umum kalau kamu belum yakin pilihan mana yang paling sesuai.", link: { label: "Lihat Karangan Bunga Duka Cita", href: "/karangan-bunga-duka-cita" } },
    ],
  },

  "papan-bunga-ulang-tahun": {
    slug: "papan-bunga-ulang-tahun",
    kelompok: "formal",
    nama: "Papan Bunga Ulang Tahun",
    metaTitle: "Papan Bunga Ulang Tahun — Ucapan Meriah untuk Momen Spesial | Kalamekar",
    metaDescription:
      "Kirim papan bunga ulang tahun untuk ucapan yang lebih besar dan meriah. Cocok untuk ulang tahun milestone atau dikirim ke kantor. Florist terverifikasi.",
    h1: "Papan Bunga Ulang Tahun",
    intro:
      "Untuk ulang tahun yang terasa lebih besar dari biasanya — seperti milestone ke-17, 30, 40, atau 50 tahun — papan bunga ulang tahun hadir sebagai versi yang lebih mencolok dibanding buket genggam biasa. Ukurannya yang besar cocok dikirim ke kantor sebagai kejutan yang langsung terlihat oleh rekan kerja penerima, atau dipajang di rumah untuk perayaan yang lebih meriah. Berbeda dari bunga ulang tahun genggam yang lebih personal dan intim, halaman ini fokus untuk kejutan berskala lebih besar dan formal. Kamu bisa menambahkan teks ucapan yang lebih panjang atau bahkan lucu, sesuai karakter orang yang kamu rayakan.",
    kenapaPilihIni: [
      "Ukuran lebih besar dan mencolok dibanding buket ulang tahun biasa",
      "Bisa custom teks ucapan yang lebih panjang, termasuk pesan yang lucu",
      "Cocok dikirim ke kantor sebagai kejutan publik untuk penerima",
    ],
    jenisRangkaian: [
      { nama: "Papan Bunga Ulang Tahun Standard", deskripsi: "Ukuran umum untuk kejutan ulang tahun yang meriah.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Papan Bunga Ulang Tahun Premium", deskripsi: "Tersedia tema custom kalau florist mendukung, untuk kesan lebih personal.", linkKategori: "/kategori#standing-flower" },
    ],
    faq: [
      { pertanyaan: "Apa bedanya dengan buket ulang tahun biasa?", jawaban: "Papan bunga ulang tahun ini jauh lebih besar dan mencolok, cocok untuk kejutan publik seperti di kantor. Kalau kamu mencari rangkaian genggam yang lebih personal untuk diberikan langsung ke tangan penerima, lihat bunga ulang tahun.", link: { label: "Lihat Bunga Ulang Tahun", href: "/bunga-ulang-tahun" } },
      { pertanyaan: "Bisa custom teks ucapan panjang atau lucu?", jawaban: "Bisa. Tulis teks ucapan yang kamu inginkan, florist akan membantu menyusunnya di papan bunga." },
      { pertanyaan: "Bisa kirim ke kantor sebagai kejutan?", jawaban: "Bisa, sertakan alamat kantor dan waktu pengiriman yang kamu inginkan supaya kejutannya pas momennya." },
      { pertanyaan: "Berapa lama sebelum hari-H sebaiknya pesan?", jawaban: "Sarankan H-2 sampai H-3 sebelum hari-H, mengingat ukurannya yang besar butuh waktu persiapan lebih dari buket biasa." },
    ],
  },

  "bunga-duka-cita": {
    slug: "bunga-duka-cita",
    kelompok: "duka-cita",
    nama: "Bunga Duka Cita",
    metaTitle: "Bunga Duka Cita — Ucapan Belasungkawa yang Layak | Kalamekar",
    metaDescription:
      "Kirim bunga duka cita sebagai ucapan belasungkawa. Florist terverifikasi, proses cepat dan penuh empati.",
    h1: "Bunga Duka Cita",
    intro:
      "Menyampaikan belasungkawa lewat bunga adalah cara yang sudah lama menjadi tradisi untuk menunjukkan rasa hormat dan simpati kepada keluarga yang berduka. Halaman ini menjadi panduan umum kalau kamu belum yakin bentuk rangkaian apa yang paling sesuai dengan kebutuhanmu — mulai dari karangan bunga berukuran menengah sampai papan bunga besar yang dipajang berdiri di lokasi acara. Kami memahami momen ini sering datang mendadak, dan tim florist partner kami siap membantu prosesnya dengan cepat dan penuh empati, termasuk membantu kamu yang belum familiar dengan etika mengirim bunga duka cita.",
    kenapaPilihIni: [
      "Berpengalaman menangani pesanan yang sifatnya mendesak",
      "Bantu arahkan jenis rangkaian sesuai kebutuhan dan lokasi",
      "Proses pemesanan cepat dan penuh empati",
    ],
    jenisRangkaian: [
      { nama: "Karangan Bunga Duka Cita", deskripsi: "Ukuran menengah, lebih fleksibel dibanding papan bunga besar.", linkKategori: "/kategori#papan-bunga" },
      { nama: "Bunga Tangan Belasungkawa", deskripsi: "Rangkaian genggam untuk ucapan belasungkawa yang lebih personal.", linkKategori: "/kategori#buket-bunga" },
    ],
    faq: [
      { pertanyaan: "Apa perbedaan karangan bunga dan papan bunga duka cita?", jawaban: "Karangan bunga ukurannya lebih kecil dan fleksibel, sementara papan bunga duka cita lebih besar dan formal, biasanya berdiri di lokasi acara. Lihat halaman masing-masing untuk detail lebih lanjut.", link: { label: "Lihat Papan Bunga Duka Cita", href: "/papan-bunga-duka-cita" } },
      { pertanyaan: "Berapa lama proses pengirimannya?", jawaban: "Kami memahami kebutuhan ini sering mendesak — hubungi florist langsung via WhatsApp untuk konfirmasi cepat soal estimasi waktu pengiriman." },
      { pertanyaan: "Apa yang sebaiknya dituliskan di kartu ucapan?", jawaban: "Gunakan format sopan seperti \"Turut berduka cita yang sedalam-dalamnya\" diikuti nama pengirim — florist juga bisa membantu kalau kamu butuh saran redaksi." },
      { pertanyaan: "Tersedia untuk semua agama dan kepercayaan?", jawaban: "Florist dapat menyesuaikan desain dan simbol sesuai kepercayaan yang dianut — sampaikan detailnya saat memesan.", link: { label: "Lihat Bunga Salib Duka untuk tradisi Kristiani", href: "/bunga-salib-duka" } },
    ],
  },

  "karangan-bunga-duka-cita": {
    slug: "karangan-bunga-duka-cita",
    kelompok: "duka-cita",
    nama: "Karangan Bunga Duka Cita",
    metaTitle: "Karangan Bunga Duka Cita — Ucapan Belasungkawa yang Tulus | Kalamekar",
    metaDescription:
      "Kirim karangan bunga duka cita sebagai ucapan belasungkawa yang tulus. Florist terverifikasi, proses cepat dan penuh empati.",
    h1: "Karangan Bunga Duka Cita",
    intro:
      "Karangan bunga duka cita menjadi pilihan tengah yang pas kalau kamu ingin menyampaikan belasungkawa dengan bentuk yang lebih personal dibanding papan bunga besar, tapi tetap terlihat pantas untuk dikirim ke rumah duka. Bentuknya biasanya bundar atau oval menyerupai wreath, dengan ukuran yang jauh lebih fleksibel disesuaikan kebutuhan dan budget. Florist partner Kalamekar memahami standar karangan bunga duka cita untuk berbagai kepercayaan, dan siap membantu proses pemesanan dengan cepat mengingat sifat kebutuhan ini yang sering mendesak.",
    kenapaPilihIni: [
      "Ukuran lebih fleksibel dibanding papan bunga duka cita besar",
      "Cocok dikirim langsung ke rumah duka",
      "Proses pemesanan cepat mengingat sifat kebutuhan yang mendesak",
    ],
    jenisRangkaian: [
      { nama: "Karangan Bunga Duka Cita Standard", deskripsi: "Bentuk bundar/oval klasik dengan ukuran yang bisa disesuaikan.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Apa beda karangan bunga dengan papan bunga duka cita?", jawaban: "Karangan bunga bentuknya bundar atau oval dan ukurannya lebih fleksibel, sementara papan bunga duka cita jauh lebih besar dan berdiri di lokasi acara.", link: { label: "Lihat Papan Bunga Duka Cita", href: "/papan-bunga-duka-cita" } },
      { pertanyaan: "Berapa lama proses pengirimannya?", jawaban: "Kami memahami sifatnya yang mendesak — koordinasikan langsung dengan florist via WhatsApp untuk kepastian waktu pengiriman tercepat." },
      { pertanyaan: "Apa yang perlu disiapkan saat memesan?", jawaban: "Siapkan nama pengirim, teks ucapan, dan alamat lengkap rumah duka." },
      { pertanyaan: "Tersedia untuk berbagai kepercayaan?", jawaban: "Ya, desain dan simbolnya bisa disesuaikan — sampaikan preferensimu saat memesan. Kalau kamu belum yakin bentuk mana yang paling sesuai, lihat juga panduan umum bunga duka cita.", link: { label: "Lihat Bunga Duka Cita", href: "/bunga-duka-cita" } },
    ],
  },

  "bunga-salib-duka": {
    slug: "bunga-salib-duka",
    kelompok: "duka-cita",
    nama: "Bunga Salib Duka",
    metaTitle: "Bunga Salib Duka — Karangan Bunga untuk Ibadah Kristiani | Kalamekar",
    metaDescription:
      "Kirim bunga salib duka sebagai bentuk penghormatan terakhir dalam tradisi Kristiani. Florist terverifikasi, proses cepat.",
    h1: "Bunga Salib Duka",
    intro:
      "Dalam tradisi Kristiani dan Katolik, karangan bunga berbentuk salib sering digunakan sebagai simbol penghormatan terakhir kepada mereka yang telah berpulang. Bunga salib duka biasanya dikirim ke tempat ibadah atau rumah duka sebagai bagian dari prosesi berkabung, dan florist partner Kalamekar memahami standar bentuk serta ukuran yang umum digunakan dalam tradisi ini. Kami memahami kebutuhan seperti ini sering datang dengan waktu yang terbatas, sehingga tim kami berupaya membantu proses pemesanan secepat dan sekhidmat mungkin.",
    kenapaPilihIni: [
      "Paham standar bentuk dan ukuran salib duka dalam tradisi Kristiani",
      "Proses cepat untuk kebutuhan yang sifatnya mendesak",
      "Bantu pengiriman langsung ke tempat ibadah atau rumah duka",
    ],
    jenisRangkaian: [
      { nama: "Bunga Salib Duka Standard", deskripsi: "Karangan berbentuk salib dengan ukuran yang bisa disesuaikan.", linkKategori: "/kategori#papan-bunga" },
    ],
    faq: [
      { pertanyaan: "Apa itu bunga salib duka?", jawaban: "Karangan bunga berbentuk salib yang umum digunakan dalam tradisi Kristiani dan Katolik sebagai simbol penghormatan terakhir." },
      { pertanyaan: "Berapa lama proses pengiriman untuk kebutuhan mendesak?", jawaban: "Hubungi florist langsung via WhatsApp untuk konfirmasi cepat soal estimasi waktu pengiriman tercepat di kotamu." },
      { pertanyaan: "Apa yang perlu disiapkan saat memesan?", jawaban: "Siapkan nama pengirim, teks ucapan, dan alamat lengkap tempat ibadah atau rumah duka." },
      { pertanyaan: "Apakah ukurannya bisa disesuaikan?", jawaban: "Bisa, tanyakan pilihan ukuran yang tersedia ke florist sesuai kebutuhan dan budget. Untuk kepercayaan lain di luar tradisi Kristiani, lihat juga pilihan bunga duka cita kami yang lebih umum.", link: { label: "Lihat Bunga Duka Cita", href: "/bunga-duka-cita" } },
    ],
  },

  "bunga-kantor": {
    slug: "bunga-kantor",
    kelompok: "korporat",
    nama: "Bunga Kantor",
    metaTitle: "Bunga Kantor — Dekorasi Bunga untuk Ruang Kerja | Kalamekar",
    metaDescription:
      "Percantik ruang kerja dengan bunga kantor segar atau tahan lama. Cocok untuk meja kerja hingga lobi kantor. Pesan lewat WhatsApp.",
    h1: "Bunga Kantor",
    intro:
      "Berbeda dari momen sekali seperti perayaan atau ucapan, bunga kantor lebih ke kebutuhan dekoratif yang sifatnya berkala — mempercantik lobi, meja resepsionis, atau ruang meeting supaya suasana kerja terasa lebih segar. Kamu bisa memilih antara bunga segar untuk kesan yang lebih hidup, atau bunga artificial yang tahan lama dan minim perawatan untuk penempatan jangka panjang. Kalau kantor kamu butuh pengadaan bunga secara rutin dan berkelanjutan, hubungi tim kami langsung untuk mendiskusikan kebutuhannya — kami akan bantu carikan solusi yang paling sesuai.",
    kenapaPilihIni: [
      "Pilihan bunga tahan lama untuk kebutuhan dekorasi jangka panjang",
      "Cocok untuk lobi, meja resepsionis, sampai ruang meeting",
      "Bisa custom sesuai tema interior kantor",
    ],
    jenisRangkaian: [
      { nama: "Bunga Meja Kantor", deskripsi: "Rangkaian vas untuk meja kerja atau meja resepsionis.", linkKategori: "/kategori#bunga-meja" },
      { nama: "Bunga Artificial Kantor", deskripsi: "Opsi tahan lama dengan perawatan minim untuk dekorasi jangka panjang.", linkKategori: "/kategori#bunga-artificial" },
    ],
    faq: [
      { pertanyaan: "Bisa pesan bunga secara rutin/berkala untuk kantor?", jawaban: "Untuk kebutuhan pengadaan rutin, silakan hubungi tim Kalamekar langsung untuk mendiskusikan kebutuhan spesifikmu — kami belum punya fitur langganan otomatis di platform, tapi tim kami bisa membantu koordinasi manual." },
      { pertanyaan: "Bunga apa yang cocok untuk ruang kerja?", jawaban: "Bunga tahan lama atau artificial jadi pilihan populer karena perawatannya minim, tapi bunga segar tetap bisa jadi opsi kalau kamu ingin suasana yang lebih hidup." },
      { pertanyaan: "Bisa custom sesuai tema interior kantor?", jawaban: "Bisa, diskusikan warna dan gaya rangkaian yang kamu inginkan langsung dengan florist." },
      { pertanyaan: "Ada opsi perawatan seperti ganti air rutin?", jawaban: "Ini tergantung kesepakatan yang kamu buat langsung dengan florist, bukan layanan default — tanyakan opsi ini kalau kamu butuh." },
    ],
  },

  "bunga-perusahaan": {
    slug: "bunga-perusahaan",
    kelompok: "korporat",
    nama: "Bunga Perusahaan",
    metaTitle: "Bunga Perusahaan — Solusi Bunga untuk Kebutuhan Korporat | Kalamekar",
    metaDescription:
      "Kalamekar melayani kebutuhan bunga perusahaan untuk berbagai acara korporat. Florist terverifikasi, proses cepat dan profesional.",
    h1: "Bunga Perusahaan",
    intro:
      "Kebutuhan bunga perusahaan biasanya lebih luas dari sekadar dekorasi kantor — mencakup berbagai momen korporat seperti pembukaan cabang baru, hari jadi perusahaan, ucapan atas pencapaian bisnis, sampai dekorasi acara resmi lainnya. Alih-alih jadi satu produk spesifik, halaman ini berfungsi sebagai titik awal untuk mengarahkanmu ke pilihan yang paling sesuai dengan kebutuhan korporatmu. Kalamekar menjadi satu titik kontak untuk berbagai kebutuhan bunga bisnis, dengan florist partner yang memahami standar dan etika formal bisnis Indonesia.",
    kenapaPilihIni: [
      "Satu titik kontak untuk berbagai kebutuhan bunga korporat",
      "Florist paham standar dan etika formal bisnis",
      "Proses profesional dari pemesanan sampai pengiriman ke lokasi acara",
    ],
    jenisRangkaian: [],
    miniHubLinks: [
      { nama: "Papan Bunga Grand Opening", href: "/papan-bunga-grand-opening" },
      { nama: "Papan Bunga Anniversary Perusahaan", href: "/papan-bunga-anniversary-perusahaan" },
      { nama: "Papan Bunga Selamat & Sukses", href: "/papan-bunga-selamat-sukses" },
      { nama: "Bunga Kantor", href: "/bunga-kantor" },
    ],
    faq: [
      { pertanyaan: "Apa bedanya dengan bunga kantor?", jawaban: "Bunga kantor fokus pada dekorasi rutin ruang kerja, sementara bunga perusahaan mencakup kebutuhan acara korporat yang lebih luas seperti pembukaan cabang, anniversary, atau ucapan sukses.", link: { label: "Lihat Bunga Kantor", href: "/bunga-kantor" } },
      { pertanyaan: "Acara apa saja yang termasuk kebutuhan bunga perusahaan?", jawaban: "Termasuk grand opening, anniversary perusahaan, ucapan selamat & sukses, sampai dekorasi acara korporat lainnya." },
      { pertanyaan: "Ada kerja sama khusus untuk kebutuhan berkala?", jawaban: "Bisa didiskusikan langsung dengan tim Kalamekar sesuai kebutuhan spesifik perusahaanmu." },
      { pertanyaan: "Bagaimana cara mulai pemesanan?", jawaban: "Hubungi tim kami lewat WhatsApp untuk mendiskusikan kebutuhanmu, atau langsung kunjungi halaman momen korporat spesifik yang paling sesuai." },
    ],
  },
};

export const MOMEN_LIST = MOMEN_SLUGS.map((slug) => MOMEN_DATA[slug]);

// Pengelompokan tampilan (dipakai hub /momen dan dropdown navbar) — beda dari
// field `kelompok` di atas yang jadi kategori data resmi (dipakai sitemap, dst).
// papan-bunga-ulang-tahun & papan-bunga-duka-cita sengaja digeser berdekatan
// dengan pasangannya meski `kelompok` datanya "formal".
export const MOMEN_DISPLAY_GROUPS = [
  {
    label: "Momen Personal",
    slugs: [
      "bunga-wisuda", "bunga-ulang-tahun", "papan-bunga-ulang-tahun", "bunga-anniversary",
      "bunga-valentine", "bunga-hari-ibu", "bunga-ucapan-selamat", "bunga-cepat-sembuh",
      "bunga-permintaan-maaf",
    ],
  },
  {
    label: "Acara & Formal",
    slugs: ["papan-bunga-grand-opening", "papan-bunga-pernikahan", "papan-bunga-selamat-sukses", "papan-bunga-anniversary-perusahaan"],
  },
  {
    label: "Duka Cita & Religi",
    slugs: ["bunga-duka-cita", "karangan-bunga-duka-cita", "papan-bunga-duka-cita", "bunga-salib-duka"],
  },
  {
    label: "Korporat",
    slugs: ["bunga-kantor", "bunga-perusahaan"],
  },
];

export function momenMetadata(slug) {
  const data = MOMEN_DATA[slug];
  return {
    title: { absolute: data.metaTitle },
    description: data.metaDescription,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `${BASE_URL}/${slug}`,
      type: "website",
    },
  };
}
