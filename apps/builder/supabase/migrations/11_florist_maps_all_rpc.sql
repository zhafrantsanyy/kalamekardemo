-- ============================================================
-- KALAMEKAR — RPC tambahan untuk peta florist: ambil SEMUA
-- florist aktif berlokasi sekaligus (tanpa filter radius/kota),
-- supaya peta bisa digeser bebas dan tetap menampilkan florist
-- di wilayah lain, bukan cuma yang di dalam radius/kota terpilih.
-- ============================================================

create or replace function public.all_florists(
  p_limit integer default 200
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
    and f.location is not null
  order by f.kota_slug asc, f.rating desc nulls last
  limit greatest(p_limit, 1);
$$;

revoke all on function public.all_florists(integer) from public;
grant execute on function public.all_florists(integer) to anon, authenticated;
