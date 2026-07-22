import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FLORIST_MAP_KOTA_SLUGS } from "@/lib/data/floristMapKota";

const DEFAULT_RADIUS_M = 10000;
const DEFAULT_LIMIT = 20;
const DEFAULT_ALL_LIMIT = 200;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kota = searchParams.get("kota");
  const hasLat = searchParams.has("lat");
  const hasLng = searchParams.has("lng");
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : DEFAULT_LIMIT;

  const supabase = await createClient();

  // Tanpa kota & tanpa koordinat: kembalikan semua florist aktif
  // supaya peta bisa digeser bebas dan tetap menampilkan florist
  // di wilayah lain, bukan cuma yang difilter kota/radius tertentu.
  if (!kota && !hasLat && !hasLng) {
    const allLimitParam = Number(searchParams.get("limit"));
    const allLimit = Number.isFinite(allLimitParam) && allLimitParam > 0 ? Math.min(allLimitParam, 200) : DEFAULT_ALL_LIMIT;

    const { data, error } = await supabase.rpc("all_florists", { p_limit: allLimit });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data florist." }, { status: 500 });
    }

    return NextResponse.json({ mode: "all", florists: data ?? [] });
  }

  if (kota) {
    if (!FLORIST_MAP_KOTA_SLUGS.includes(kota)) {
      return NextResponse.json({ error: "Kota tidak dikenali." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("florists_by_kota", {
      p_kota_slug: kota,
      p_limit: limit,
    });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data florist." }, { status: 500 });
    }

    return NextResponse.json({ mode: "kota", kota, florists: data ?? [] });
  }

  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radiusParam = Number(searchParams.get("radius"));
  const radius = Number.isFinite(radiusParam) && radiusParam > 0 ? radiusParam : DEFAULT_RADIUS_M;

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Parameter lat/lng tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("nearby_florists", {
    p_lat: lat,
    p_lng: lng,
    p_radius_m: Math.round(radius),
    p_limit: limit,
  });

  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data florist." }, { status: 500 });
  }

  return NextResponse.json({ mode: "radius", lat, lng, radius, florists: data ?? [] });
}
