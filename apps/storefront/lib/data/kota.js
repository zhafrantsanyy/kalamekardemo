// Konten per halaman kota & sub-area Jakarta di /toko-bunga/[slug].
// Data dipisah dari komponen supaya nambah kota baru cukup nambah entry di sini.
//
// areaCakupan: daftar kecamatan/wilayah per kota TIDAK BOLEH dikarang. Selama belum
// ada data terverifikasi dari tim, biarkan array kosong ([]) — komponen halaman akan
// menampilkan pesan "sedang dilengkapi" alih-alih data fiktif. Pengecualian: Jakarta,
// karena 5 wilayah administratifnya (Selatan/Barat/Timur/Utara/Pusat) resmi dan publik.

export const JAKARTA_SUBAREA_SLUGS = [
  "jakarta-selatan",
  "jakarta-barat",
  "jakarta-timur",
  "jakarta-utara",
  "jakarta-pusat",
];

export const KOTA_SLUGS = [
  "jakarta",
  "surabaya",
  "bandung",
  "medan",
  "bekasi",
  "yogyakarta",
  ...JAKARTA_SUBAREA_SLUGS,
];

const kotaFaq = (nama) => [
  {
    pertanyaan: `Wilayah mana saja di ${nama} yang sudah terjangkau?`,
    jawaban: `Daftar area cakupan florist Kalamekar di ${nama} masih kami lengkapi dan verifikasi bersama tim lapangan. Untuk sementara, tanyakan langsung ke florist pilihanmu apakah alamat tujuan pengirimanmu termasuk area layanan mereka.`,
  },
  {
    pertanyaan: `Berapa lama waktu pengiriman bunga di ${nama}?`,
    jawaban: `Secara umum, pesanan yang masuk sebelum jam 3 sore bisa dikirim di hari yang sama — angka ini masih perlu dikonfirmasi tim ops kami untuk tiap area, karena jarak florist ke lokasi tujuan bisa berbeda-beda.`,
  },
  {
    pertanyaan: `Apakah florist di ${nama} sudah terverifikasi?`,
    jawaban: `Ya. Setiap florist yang tayang di halaman ini melewati proses kurasi tim Kalamekar — alamat toko yang jelas dan galeri produk asli — sebelum etalasenya bisa dilihat pembeli.`,
  },
  {
    pertanyaan: `Bagaimana cara memesan bunga di ${nama}?`,
    jawaban: `Pilih florist yang kamu suka dari daftar di halaman ini, lalu klik tombol chat WhatsApp untuk mendiskusikan detail rangkaian, warna, kartu ucapan, dan waktu pengiriman langsung dengan floristnya.`,
  },
];

export const KOTA_DATA = {
  jakarta: {
    slug: "jakarta",
    nama: "Jakarta",
    tipe: "kota",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta — Kirim Bunga Hari Ini | Kalamekar",
    metaDescription:
      "Temukan florist terverifikasi di Jakarta, dari Jakarta Selatan sampai Jakarta Utara. Pesan lewat WhatsApp, bunga sampai hari ini juga.",
    h1: "Toko Bunga Jakarta",
    intro:
      "Jakarta adalah kota dengan cakupan florist terluas dan paling sibuk di jaringan Kalamekar. Supaya kamu lebih cepat menemukan florist terdekat dari lokasi pengiriman, halaman Toko Bunga Jakarta ini kami bagi menjadi lima wilayah administratif — Jakarta Selatan, Barat, Timur, Utara, dan Pusat. Setiap wilayah punya halamannya sendiri dengan daftar florist, kategori populer, dan estimasi pengiriman yang lebih spesifik untuk area tersebut. Baik untuk hand bouquet wisuda di kawasan kampus, papan bunga duka cita, hingga dekorasi pernikahan skala besar, kamu bisa langsung memilih wilayah terdekat dari alamat tujuan lalu chat florist pilihanmu via WhatsApp untuk konfirmasi pesanan.",
    areaCakupan: ["Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", "Jakarta Pusat"],
    subAreaSlugs: JAKARTA_SUBAREA_SLUGS,
    faq: [
      {
        pertanyaan: "Apakah semua wilayah Jakarta terjangkau?",
        jawaban:
          "Iya, cakupan florist Kalamekar di Jakarta meliputi lima wilayah administratif — Jakarta Selatan, Jakarta Barat, Jakarta Timur, Jakarta Utara, dan Jakarta Pusat. Waktu pengiriman bisa berbeda-beda tergantung jarak florist ke lokasi tujuan di masing-masing wilayah.",
      },
      {
        pertanyaan: "Berapa lama waktu pengiriman bunga di Jakarta?",
        jawaban:
          "Secara umum, pesanan yang masuk sebelum jam 3 sore bisa dikirim di hari yang sama. Angka ini masih perlu dikonfirmasi tim ops untuk tiap wilayah, karena kepadatan lalu lintas Jakarta bisa memengaruhi waktu tempuh kurir.",
      },
      {
        pertanyaan: "Bagaimana cara memilih florist di wilayah saya?",
        jawaban:
          "Buka halaman wilayah Jakarta yang paling dekat dengan alamat tujuan pengiriman — Jakarta Selatan, Barat, Timur, Utara, atau Pusat — lalu bandingkan florist yang tersedia di sana sebelum chat langsung via WhatsApp.",
      },
      {
        pertanyaan: "Apakah bisa kirim ke luar Jakarta (Bodetabek)?",
        jawaban:
          "Untuk saat ini, wilayah Bodetabek yang sudah punya jaringan florist tersendiri di Kalamekar adalah Bekasi, yang berdiri sebagai halaman kota terpisah. Kota Bodetabek lainnya akan menyusul seiring perluasan jaringan florist kami.",
      },
    ],
  },
  surabaya: {
    slug: "surabaya",
    nama: "Surabaya",
    tipe: "kota",
    provinsi: "Jawa Timur",
    metaTitle: "Toko Bunga Surabaya — Florist Terpercaya | Kalamekar",
    metaDescription:
      "Cari florist terverifikasi di Surabaya untuk berbagai momen. Pesan mudah lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Surabaya",
    intro:
      "Surabaya adalah kota metropolitan terbesar kedua di Indonesia dan pusat florist utama Jawa Timur. Sebagai kota dengan kombinasi kawasan bisnis, industri, dan permukiman padat, kebutuhan pengiriman bunga di Surabaya cukup beragam — mulai dari rangkaian ucapan untuk kantor di kawasan pusat kota, hingga hand bouquet untuk acara keluarga di area perumahan. Kalamekar menghubungkanmu dengan florist lokal terverifikasi di Surabaya yang memahami rute pengiriman kota ini, sehingga bunga bisa sampai tepat waktu. Pilih kategori yang kamu butuhkan, lalu chat florist pilihanmu langsung via WhatsApp untuk detail rangkaian dan konfirmasi pesanan.",
    areaCakupan: [], // TODO: isi daftar kecamatan/wilayah terverifikasi
    faq: kotaFaq("Surabaya"),
  },
  bandung: {
    slug: "bandung",
    nama: "Bandung",
    tipe: "kota",
    provinsi: "Jawa Barat",
    metaTitle: "Toko Bunga Bandung — Florist Terpercaya | Kalamekar",
    metaDescription:
      "Temukan florist terverifikasi di Bandung. Pesan lewat WhatsApp, cocok untuk wisuda, ulang tahun, hingga acara formal.",
    h1: "Toko Bunga Bandung",
    intro:
      "Bandung adalah kota dengan banyak kampus dan komunitas kreatif, menjadikannya salah satu pusat permintaan bunga wisuda paling ramai di Jawa Barat. Selain momen kelulusan, florist di Bandung juga terbiasa menangani rangkaian untuk ulang tahun, lamaran, hingga acara formal kantor. Kalamekar menghubungkanmu dengan florist lokal terverifikasi di Bandung yang memahami karakter tiap acara — dari buket personal yang hangat sampai standing flower untuk acara resmi. Pilih florist yang kamu suka, lalu chat langsung via WhatsApp untuk mendiskusikan detail rangkaian dan waktu pengiriman.",
    areaCakupan: [], // TODO: isi daftar kecamatan/wilayah terverifikasi
    faq: kotaFaq("Bandung"),
  },
  medan: {
    slug: "medan",
    nama: "Medan",
    tipe: "kota",
    provinsi: "Sumatera Utara",
    metaTitle: "Toko Bunga Medan — Florist Terpercaya | Kalamekar",
    metaDescription:
      "Cari florist terverifikasi di Medan untuk berbagai kebutuhan bunga. Pesan mudah lewat WhatsApp.",
    h1: "Toko Bunga Medan",
    intro:
      "Sebagai kota terbesar di Sumatra, Medan punya jaringan florist yang terus berkembang mengikuti kebutuhan warganya — dari papan bunga duka cita, ucapan selamat, hingga rangkaian untuk acara adat dan pernikahan. Kalamekar menghadirkan florist lokal terverifikasi di Medan yang memahami karakter tiap acara dan bisa memberi rekomendasi rangkaian yang sesuai. Cakupan area pengiriman di Medan akan terus kami perluas seiring bertambahnya florist partner yang bergabung. Temukan florist terdekat dari lokasi tujuanmu, lalu selesaikan pemesanan langsung lewat WhatsApp untuk konfirmasi detail dan waktu kirim.",
    areaCakupan: [], // TODO: isi daftar kecamatan/wilayah terverifikasi
    faq: kotaFaq("Medan"),
  },
  bekasi: {
    slug: "bekasi",
    nama: "Bekasi",
    tipe: "kota",
    provinsi: "Jawa Barat",
    metaTitle: "Toko Bunga Bekasi — Florist Terpercaya | Kalamekar",
    metaDescription:
      "Temukan florist terverifikasi di Bekasi. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Bekasi",
    intro:
      "Bekasi tumbuh pesat sebagai kota penyangga Jakarta dengan kebutuhan bunga yang datang dari dua sisi — kawasan residensial yang terus berkembang dan kawasan industri serta perkantoran yang padat. Florist partner Kalamekar di Bekasi memahami karakter keduanya, siap melayani mulai dari rangkaian ucapan untuk acara korporat sampai buket personal untuk keluarga. Meski letaknya berdekatan dengan Jakarta, Bekasi berdiri sebagai kota tersendiri di jaringan Kalamekar dengan florist dan halaman direktorinya sendiri. Cari florist terdekat dari lokasi tujuanmu di Bekasi dan hubungi langsung via WhatsApp.",
    areaCakupan: [], // TODO: isi daftar kecamatan/wilayah terverifikasi
    faq: [
      ...kotaFaq("Bekasi"),
      {
        pertanyaan: "Apakah Bekasi terpisah dari layanan Jakarta?",
        jawaban:
          "Iya, Bekasi dan Jakarta adalah dua kota terpisah di jaringan Kalamekar, masing-masing dengan florist dan halaman direktorinya sendiri — tapi keduanya sama-sama sudah terjangkau dan siap menerima pesananmu.",
      },
    ],
  },
  yogyakarta: {
    slug: "yogyakarta",
    nama: "Yogyakarta",
    tipe: "kota",
    provinsi: "DI Yogyakarta",
    metaTitle: "Toko Bunga Yogyakarta — Florist Terpercaya | Kalamekar",
    metaDescription:
      "Cari florist terverifikasi di Yogyakarta untuk pernikahan adat hingga bunga wisuda. Pesan mudah lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Yogyakarta",
    intro:
      "Yogyakarta memadukan suasana kota pelajar dengan kekayaan tradisi Jawa, menjadikannya kota dengan karakter florist yang khas — kuat di rangkaian pernikahan adat maupun acara formal, sekaligus ramai permintaan bunga wisuda dari kalangan mahasiswa. Florist partner Kalamekar di Yogyakarta memahami detail budaya lokal yang sering jadi bagian dari rangkaian pernikahan maupun upacara adat. Baik untuk momen personal maupun acara resmi, kamu bisa menemukan florist terverifikasi terdekat dari lokasi tujuanmu dan menghubunginya langsung lewat WhatsApp untuk mendiskusikan detail rangkaian.",
    areaCakupan: [], // TODO: isi daftar kecamatan/wilayah terverifikasi
    faq: [
      ...kotaFaq("Yogyakarta").slice(0, 3),
      {
        pertanyaan: "Bisakah florist di Yogyakarta membantu rangkaian pernikahan adat?",
        jawaban:
          "Bisa. Banyak florist partner di Yogyakarta berpengalaman menangani rangkaian pernikahan bernuansa adat Jawa — diskusikan detail dan referensi yang kamu inginkan langsung via WhatsApp.",
      },
    ],
  },

  "jakarta-selatan": {
    slug: "jakarta-selatan",
    nama: "Jakarta Selatan",
    tipe: "sub-area",
    kotaIndukSlug: "jakarta",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta Selatan — Kirim Hari Ini | Kalamekar",
    metaDescription:
      "Florist terverifikasi di Jakarta Selatan. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Jakarta Selatan",
    intro:
      "Kawasan Jakarta Selatan dikenal sebagai pusat perkantoran modern dan kawasan tempat tinggal kelas menengah atas, mulai dari Kebayoran sampai kawasan bisnis Kuningan. Florist di wilayah ini terbiasa melayani pengiriman untuk kebutuhan korporat maupun personal, dari hand bouquet hingga rangkaian ucapan kantor. Kalamekar menghubungkanmu dengan florist terverifikasi terdekat dari alamat tujuan di Jakarta Selatan, siap dipesan langsung via WhatsApp.",
    areaCakupan: [], // TODO: isi daftar kecamatan terverifikasi
    faq: [
      {
        pertanyaan: "Area mana saja yang termasuk Jakarta Selatan?",
        jawaban:
          "Daftar kecamatan yang termasuk wilayah Jakarta Selatan sedang kami lengkapi bersama tim lapangan supaya datanya akurat — lihat bagian Area Cakupan di atas untuk pembaruan terbaru, atau tanyakan langsung ke florist pilihanmu.",
      },
      {
        pertanyaan: "Berapa lama pengiriman ke Jakarta Selatan?",
        jawaban:
          "Estimasi waktu pengiriman ke Jakarta Selatan bervariasi tergantung lokasi florist dan tujuan persisnya — umumnya same-day untuk pesanan sebelum jam 3 sore, namun angka ini masih perlu dikonfirmasi tim ops kami.",
      },
      {
        pertanyaan: "Bagaimana cara memesan florist di Jakarta Selatan?",
        jawaban:
          "Pilih florist dari daftar di halaman ini, lalu chat langsung lewat WhatsApp untuk mendiskusikan detail rangkaian, warna, dan waktu pengiriman ke Jakarta Selatan.",
      },
    ],
  },
  "jakarta-barat": {
    slug: "jakarta-barat",
    nama: "Jakarta Barat",
    tipe: "sub-area",
    kotaIndukSlug: "jakarta",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta Barat — Kirim Hari Ini | Kalamekar",
    metaDescription:
      "Florist terverifikasi di Jakarta Barat. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Jakarta Barat",
    intro:
      "Dari kawasan pertokoan lama di Jakarta Barat sampai kompleks perumahan yang terus berkembang, wilayah ini punya karakter florist yang beragam. Kalamekar menghadirkan florist lokal terverifikasi yang sudah terbiasa mengantar ke berbagai penjuru Jakarta Barat, cocok untuk kebutuhan bunga sehari-hari maupun momen spesial. Pilih florist yang paling dekat dengan lokasi tujuanmu, lalu selesaikan pemesanan langsung lewat WhatsApp.",
    areaCakupan: [], // TODO: isi daftar kecamatan terverifikasi
    faq: [
      {
        pertanyaan: "Area mana saja yang termasuk Jakarta Barat?",
        jawaban:
          "Daftar kecamatan yang termasuk wilayah Jakarta Barat sedang kami lengkapi bersama tim lapangan supaya datanya akurat — lihat bagian Area Cakupan di atas untuk pembaruan terbaru, atau tanyakan langsung ke florist pilihanmu.",
      },
      {
        pertanyaan: "Berapa lama pengiriman ke Jakarta Barat?",
        jawaban:
          "Estimasi waktu pengiriman ke Jakarta Barat bervariasi tergantung lokasi florist dan tujuan persisnya — umumnya same-day untuk pesanan sebelum jam 3 sore, namun angka ini masih perlu dikonfirmasi tim ops kami.",
      },
      {
        pertanyaan: "Bagaimana cara memesan florist di Jakarta Barat?",
        jawaban:
          "Pilih florist dari daftar di halaman ini, lalu chat langsung lewat WhatsApp untuk mendiskusikan detail rangkaian, warna, dan waktu pengiriman ke Jakarta Barat.",
      },
    ],
  },
  "jakarta-timur": {
    slug: "jakarta-timur",
    nama: "Jakarta Timur",
    tipe: "sub-area",
    kotaIndukSlug: "jakarta",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta Timur — Kirim Hari Ini | Kalamekar",
    metaDescription:
      "Florist terverifikasi di Jakarta Timur. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Jakarta Timur",
    intro:
      "Jakarta Timur membentang luas dengan kombinasi kawasan industri, perumahan, dan pendidikan. Florist yang tergabung di Kalamekar untuk wilayah ini memahami jarak tempuh yang bervariasi antar kecamatan, sehingga bisa memberi estimasi pengiriman yang lebih akurat. Baik untuk acara keluarga, kantor, maupun institusi pendidikan di Jakarta Timur, kamu bisa langsung menghubungi florist pilihanmu via WhatsApp untuk mendiskusikan detail rangkaian.",
    areaCakupan: [], // TODO: isi daftar kecamatan terverifikasi
    faq: [
      {
        pertanyaan: "Area mana saja yang termasuk Jakarta Timur?",
        jawaban:
          "Daftar kecamatan yang termasuk wilayah Jakarta Timur sedang kami lengkapi bersama tim lapangan supaya datanya akurat — lihat bagian Area Cakupan di atas untuk pembaruan terbaru, atau tanyakan langsung ke florist pilihanmu.",
      },
      {
        pertanyaan: "Berapa lama pengiriman ke Jakarta Timur?",
        jawaban:
          "Estimasi waktu pengiriman ke Jakarta Timur bervariasi tergantung lokasi florist dan tujuan persisnya — umumnya same-day untuk pesanan sebelum jam 3 sore, namun angka ini masih perlu dikonfirmasi tim ops kami.",
      },
      {
        pertanyaan: "Bagaimana cara memesan florist di Jakarta Timur?",
        jawaban:
          "Pilih florist dari daftar di halaman ini, lalu chat langsung lewat WhatsApp untuk mendiskusikan detail rangkaian, warna, dan waktu pengiriman ke Jakarta Timur.",
      },
    ],
  },
  "jakarta-utara": {
    slug: "jakarta-utara",
    nama: "Jakarta Utara",
    tipe: "sub-area",
    kotaIndukSlug: "jakarta",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta Utara — Kirim Hari Ini | Kalamekar",
    metaDescription:
      "Florist terverifikasi di Jakarta Utara. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Jakarta Utara",
    intro:
      "Sebagai kawasan pesisir dengan perpaduan kawasan industri, pelabuhan, dan hunian modern, Jakarta Utara punya kebutuhan pengiriman bunga yang cukup spesifik. Florist partner Kalamekar di wilayah ini siap membantu, mulai dari ucapan untuk perusahaan pelayaran hingga rangkaian personal untuk keluarga. Cari florist terdekat dari alamat tujuanmu di Jakarta Utara dan hubungi langsung lewat WhatsApp untuk konfirmasi pesanan.",
    areaCakupan: [], // TODO: isi daftar kecamatan terverifikasi
    faq: [
      {
        pertanyaan: "Area mana saja yang termasuk Jakarta Utara?",
        jawaban:
          "Daftar kecamatan yang termasuk wilayah Jakarta Utara sedang kami lengkapi bersama tim lapangan supaya datanya akurat — lihat bagian Area Cakupan di atas untuk pembaruan terbaru, atau tanyakan langsung ke florist pilihanmu.",
      },
      {
        pertanyaan: "Berapa lama pengiriman ke Jakarta Utara?",
        jawaban:
          "Estimasi waktu pengiriman ke Jakarta Utara bervariasi tergantung lokasi florist dan tujuan persisnya — umumnya same-day untuk pesanan sebelum jam 3 sore, namun angka ini masih perlu dikonfirmasi tim ops kami.",
      },
      {
        pertanyaan: "Bagaimana cara memesan florist di Jakarta Utara?",
        jawaban:
          "Pilih florist dari daftar di halaman ini, lalu chat langsung lewat WhatsApp untuk mendiskusikan detail rangkaian, warna, dan waktu pengiriman ke Jakarta Utara.",
      },
    ],
  },
  "jakarta-pusat": {
    slug: "jakarta-pusat",
    nama: "Jakarta Pusat",
    tipe: "sub-area",
    kotaIndukSlug: "jakarta",
    provinsi: "DKI Jakarta",
    metaTitle: "Toko Bunga Jakarta Pusat — Kirim Hari Ini | Kalamekar",
    metaDescription:
      "Florist terverifikasi di Jakarta Pusat. Pesan lewat WhatsApp, kirim bunga hari ini juga.",
    h1: "Toko Bunga Jakarta Pusat",
    intro:
      "Berdenyut sebagai jantung pemerintahan dan bisnis ibu kota, Jakarta Pusat punya permintaan tinggi untuk rangkaian bunga formal maupun personal. Florist di kawasan ini terbiasa melayani pengiriman cepat ke gedung perkantoran maupun pemukiman padat penduduk. Melalui Kalamekar, kamu bisa menemukan florist terverifikasi terdekat dengan lokasi tujuan di Jakarta Pusat, lalu memesan langsung lewat WhatsApp.",
    areaCakupan: [], // TODO: isi daftar kecamatan terverifikasi
    faq: [
      {
        pertanyaan: "Area mana saja yang termasuk Jakarta Pusat?",
        jawaban:
          "Daftar kecamatan yang termasuk wilayah Jakarta Pusat sedang kami lengkapi bersama tim lapangan supaya datanya akurat — lihat bagian Area Cakupan di atas untuk pembaruan terbaru, atau tanyakan langsung ke florist pilihanmu.",
      },
      {
        pertanyaan: "Berapa lama pengiriman ke Jakarta Pusat?",
        jawaban:
          "Estimasi waktu pengiriman ke Jakarta Pusat bervariasi tergantung lokasi florist dan tujuan persisnya — umumnya same-day untuk pesanan sebelum jam 3 sore, namun angka ini masih perlu dikonfirmasi tim ops kami.",
      },
      {
        pertanyaan: "Bagaimana cara memesan florist di Jakarta Pusat?",
        jawaban:
          "Pilih florist dari daftar di halaman ini, lalu chat langsung lewat WhatsApp untuk mendiskusikan detail rangkaian, warna, dan waktu pengiriman ke Jakarta Pusat.",
      },
    ],
  },
};

export const KOTA_LIST = KOTA_SLUGS.map((slug) => KOTA_DATA[slug]);

// 6 kota utama yang sudah live (dipakai hub, footer, homepage) — beda dengan
// KOTA_SLUGS yang juga memuat 5 sub-area Jakarta.
export const LIVE_KOTA_SLUGS = ["jakarta", "surabaya", "bandung", "medan", "bekasi", "yogyakarta"];

export const OCCASION_LINKS = [
  { nama: "Bunga Wisuda", href: "/bunga-wisuda" },
  { nama: "Papan Bunga Grand Opening", href: "/papan-bunga-grand-opening" },
  { nama: "Bunga Duka Cita", href: "/bunga-duka-cita" },
  { nama: "Papan Bunga Pernikahan", href: "/papan-bunga-pernikahan" },
  { nama: "Bunga Ulang Tahun", href: "/bunga-ulang-tahun" },
];
