import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const namaToko = typeof body?.namaToko === "string" ? body.namaToko.trim() : "";
  const namaPemilik = typeof body?.namaPemilik === "string" ? body.namaPemilik.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const wa = typeof body?.wa === "string" ? body.wa.trim() : "";
  const kota = typeof body?.kota === "string" ? body.kota.trim() : "";
  const kecamatan = typeof body?.kecamatan === "string" ? body.kecamatan.trim() : "";
  const alamat = typeof body?.alamat === "string" ? body.alamat.trim() : "";
  const pengalaman = typeof body?.pengalaman === "string" ? body.pengalaman.trim() : "";
  const instagram = typeof body?.instagram === "string" ? body.instagram.trim() : "";

  if (!namaToko || !namaPemilik || !email || !wa || !kota || !kecamatan || !alamat) {
    return NextResponse.json({ error: "Mohon lengkapi semua kolom wajib." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("florist_applications").insert({
    nama_toko: namaToko,
    nama_pemilik: namaPemilik,
    email,
    wa,
    kota,
    kecamatan,
    alamat,
    pengalaman: pengalaman || null,
    instagram: instagram || null,
  });

  if (error) {
    return NextResponse.json({ error: "Gagal mengirim pendaftaran. Coba lagi sebentar lagi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
