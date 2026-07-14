export const FLOWERS = [
  { id: "mawar_merah", nama: "Mawar Merah", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/1820567/pexels-photo-1820567.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "mawar_putih", nama: "Mawar Putih", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/8634917/pexels-photo-8634917.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "mawar_pink", nama: "Mawar Pink", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "peony", nama: "Peony", harga: 35000, kat: "bunga", img: "https://images.pexels.com/photos/8051675/pexels-photo-8051675.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "lily", nama: "Lily Putih", harga: 22000, kat: "bunga", img: "https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "tulip", nama: "Tulip", harga: 25000, kat: "bunga", img: "https://images.pexels.com/photos/2480072/pexels-photo-2480072.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "matahari", nama: "Bunga Matahari", harga: 18000, kat: "bunga", img: "https://images.pexels.com/photos/18503542/pexels-photo-18503542.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "anggrek", nama: "Anggrek Bulan", harga: 30000, kat: "bunga", img: "https://images.pexels.com/photos/14100860/pexels-photo-14100860.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "krisan", nama: "Krisan Kuning", harga: 8000, kat: "bunga", img: "https://images.pexels.com/photos/2179204/pexels-photo-2179204.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "anyelir", nama: "Anyelir", harga: 10000, kat: "bunga", img: "https://images.pexels.com/photos/3392718/pexels-photo-3392718.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "daisy", nama: "Daisy", harga: 9000, kat: "bunga", img: "https://images.pexels.com/photos/8974827/pexels-photo-8974827.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "lavender", nama: "Lavender", harga: 12000, kat: "bunga", img: "https://images.pexels.com/photos/4984547/pexels-photo-4984547.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "hydrangea", nama: "Hortensia", harga: 28000, kat: "bunga", img: "https://images.pexels.com/photos/53135/hydrangea-blossom-bloom-flower-53135.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "babys", nama: "Baby's Breath", harga: 7000, kat: "filler", img: "https://images.pexels.com/photos/296678/pexels-photo-296678.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "eucalyptus", nama: "Eukaliptus", harga: 8000, kat: "filler", img: "https://images.pexels.com/photos/6068432/pexels-photo-6068432.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "pakis", nama: "Daun Pakis", harga: 6000, kat: "filler", img: "https://images.pexels.com/photos/1226302/pexels-photo-1226302.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "monstera", nama: "Monstera", harga: 12000, kat: "filler", img: "https://images.pexels.com/photos/7354633/pexels-photo-7354633.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
];
export const FMAP = Object.fromEntries(FLOWERS.map((f) => [f.id, f]));

export const SIZES = [
  { id: "S", nama: "S", fee: 0, saran: "6–10 tangkai", r: 22 },
  { id: "M", nama: "M", fee: 20000, saran: "10–18 tangkai", r: 28 },
  { id: "L", nama: "L", fee: 40000, saran: "18–30 tangkai", r: 34 },
];

export const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
