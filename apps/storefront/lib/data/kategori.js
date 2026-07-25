import { Flower2, Heart, Sparkles, Leaf, ShoppingBag, Gem } from "lucide-react";

// Data kategori produk — dipakai oleh /kategori dan dropdown navbar, satu sumber
// supaya daftar kategori tidak drift antara halaman dan menu.
//
// dbSlugs: slug di tabel florist_product_categories yang termasuk kategori
// marketing ini. Taksonomi DB (buket, papan-bunga, karangan-duka-cita, hampers,
// dekorasi-pernikahan) tidak 1:1 dengan daftar kategori marketing di bawah, jadi
// mapping ini dipakai /kategori/[slug] untuk query florist_products. Kategori
// tanpa dbSlugs (array kosong) berarti belum ada taksonomi DB yang cocok --
// halamannya tetap tayang tapi menampilkan pesan "produk sedang dilengkapi".
export const KATEGORI_LIST = [
  {
    id: "buket-bunga",
    nama: "Buket Bunga",
    icon: Flower2,
    desc: "Rangkaian genggam untuk hadiah personal — ulang tahun, anniversary, hingga permintaan maaf. Tersedia dari buket mini satu genggam sampai buket besar dengan bunga premium seperti mawar dan lily, jadi bisa disesuaikan dengan budget dan momennya.",
    links: [],
    dbSlugs: ["buket"],
  },
  {
    id: "papan-bunga",
    nama: "Papan Bunga",
    icon: Heart,
    desc: "Standing besar untuk acara formal — grand opening, pernikahan, hingga duka cita. Ukurannya mencolok dan biasanya dipajang di lokasi acara, dengan papan ucapan yang bisa ditulis sesuai kebutuhan pengirim.",
    links: [
      { nama: "Grand Opening", href: "/papan-bunga-grand-opening" },
      { nama: "Pernikahan", href: "/papan-bunga-pernikahan" },
      { nama: "Duka Cita", href: "/bunga-duka-cita" },
    ],
    dbSlugs: ["papan-bunga", "karangan-duka-cita", "dekorasi-pernikahan"],
  },
  {
    id: "standing-flower",
    nama: "Standing Flower",
    icon: Sparkles,
    desc: "Mirip papan bunga, tapi framingnya lebih ke dekorasi acara atau booth — cocok untuk mempercantik area resepsi, panggung, atau titik foto di acara kamu. Bentuknya lebih fleksibel dan sering dipadukan dengan elemen dekorasi lain.",
    links: [],
    dbSlugs: ["dekorasi-pernikahan"],
  },
  {
    id: "bunga-meja",
    nama: "Bunga Meja",
    icon: Leaf,
    desc: "Rangkaian dalam vas untuk kantor, meja resepsi, atau acara indoor. Ukurannya ringkas, dirancang supaya tetap terlihat rapi di ruangan tanpa memakan banyak tempat, dan cocok untuk penggunaan jangka pendek maupun dekorasi rutin.",
    links: [],
    dbSlugs: [],
  },
  {
    id: "parcel-bunga",
    nama: "Parcel Bunga",
    icon: ShoppingBag,
    desc: "Kombinasi bunga dengan hampers atau hadiah lain seperti cokelat, kue, atau perawatan diri. Pilihan pas untuk hari raya, ucapan terima kasih, atau kado yang terasa lebih lengkap dibanding buket biasa.",
    links: [],
    dbSlugs: ["hampers"],
  },
  {
    id: "bunga-artificial",
    nama: "Bunga Artificial",
    icon: Gem,
    desc: "Opsi bunga tahan lama untuk dekorasi permanen — cocok untuk interior rumah, kantor, atau etalase toko yang ingin tampil segar tanpa perlu perawatan dan penggantian rutin seperti bunga segar.",
    links: [],
    dbSlugs: [],
  },
];
