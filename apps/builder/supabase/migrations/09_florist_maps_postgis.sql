-- ============================================================
-- KALAMEKAR — Fase peta florist terdekat (demo/prototype)
-- Enable PostGIS, tambah kolom lokasi geografis + kota_slug di
-- florists, index spasial, dan RPC untuk query florist terdekat
-- / florist per kota (fallback non-geolocation).
-- ============================================================

create extension if not exists postgis with schema extensions;

-- Kolom baru di florists. Tidak ada kolom lama yang dihapus.
alter table public.florists
  add column if not exists location geography(Point, 4326),
  add column if not exists kota_slug text,
  add column if not exists deskripsi text;

alter table public.florists
  drop constraint if exists florists_kota_slug_check;

alter table public.florists
  add constraint florists_kota_slug_check
  check (
    kota_slug is null or kota_slug in (
      'jakarta-selatan',
      'jakarta-barat',
      'jakarta-timur',
      'jakarta-utara',
      'jakarta-pusat',
      'bekasi'
    )
  );

create index if not exists florists_location_idx
  on public.florists using gist (location);

-- ------------------------------------------------------------
-- RPC: nearby_florists — florist aktif dalam radius tertentu
-- dari titik user, terurut dari terdekat. SECURITY DEFINER agar
-- bisa membaca florists lewat index spasial tanpa bergantung ke
-- role pemanggil, tapi hanya expose kolom publik yang aman
-- (tidak ada user_id florist lain).
-- ------------------------------------------------------------
create or replace function public.nearby_florists(
  p_lat double precision,
  p_lng double precision,
  p_radius_m integer default 10000,
  p_limit integer default 20
)
returns table (
  id uuid,
  nama text,
  area text,
  deskripsi text,
  wa text,
  rating numeric,
  kota_slug text,
  lat double precision,
  lng double precision,
  distance_m double precision
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    f.id,
    f.nama,
    f.area,
    f.deskripsi,
    f.wa,
    f.rating,
    f.kota_slug,
    extensions.ST_Y(f.location::extensions.geometry) as lat,
    extensions.ST_X(f.location::extensions.geometry) as lng,
    extensions.ST_Distance(f.location, extensions.ST_MakePoint(p_lng, p_lat)::extensions.geography) as distance_m
  from public.florists f
  where f.aktif = true
    and f.location is not null
    and extensions.ST_DWithin(
      f.location,
      extensions.ST_MakePoint(p_lng, p_lat)::extensions.geography,
      greatest(p_radius_m, 0)
    )
  order by distance_m asc
  limit greatest(p_limit, 1);
$$;

revoke all on function public.nearby_florists(double precision, double precision, integer, integer) from public;
grant execute on function public.nearby_florists(double precision, double precision, integer, integer) to anon, authenticated;

-- ------------------------------------------------------------
-- RPC: florists_by_kota — fallback tanpa geolocation, florist
-- aktif di satu wilayah (kota_slug), tanpa perlu radius geo.
-- ------------------------------------------------------------
create or replace function public.florists_by_kota(
  p_kota_slug text,
  p_limit integer default 20
)
returns table (
  id uuid,
  nama text,
  area text,
  deskripsi text,
  wa text,
  rating numeric,
  kota_slug text,
  lat double precision,
  lng double precision
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    f.id,
    f.nama,
    f.area,
    f.deskripsi,
    f.wa,
    f.rating,
    f.kota_slug,
    extensions.ST_Y(f.location::extensions.geometry) as lat,
    extensions.ST_X(f.location::extensions.geometry) as lng
  from public.florists f
  where f.aktif = true
    and f.kota_slug = p_kota_slug
  order by f.rating desc nulls last, f.created_at asc
  limit greatest(p_limit, 1);
$$;

revoke all on function public.florists_by_kota(text, integer) from public;
grant execute on function public.florists_by_kota(text, integer) to anon, authenticated;
