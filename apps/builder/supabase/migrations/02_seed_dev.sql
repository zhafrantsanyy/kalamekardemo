-- ============================================================
-- KALAMEKAR — Seed DEV-ONLY untuk verifikasi Fase 2 (dashboard mitra)
-- JANGAN dijalankan di project production.
--
-- Membuat:
--   1. User auth floris dummy — email: floris.dev@kalamekar.test
--                                password: floris123dev
--   2. Baris florists untuk user tsb
--   3. Satu order contoh berstatus 'matching' yang sudah di-assign ke
--      floris ini, supaya alur terima -> update status -> upload foto
--      bisa dicoba end-to-end dari /mitra.
--
-- Jalankan SETELAH 01_phase2_auth.sql, di SQL Editor Supabase.
-- Aman dijalankan berulang kali (idempotent).
-- ============================================================

do $$
declare
  v_user_id   uuid;
  v_floris_id uuid;
begin
  select id into v_user_id from auth.users where email = 'floris.dev@kalamekar.test';

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      'floris.dev@kalamekar.test', crypt('floris123dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}', '{}', '', ''
    );

    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id::text, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'floris.dev@kalamekar.test'),
      'email', now(), now(), now()
    );
  end if;

  insert into public.florists (user_id, nama, area, wa, aktif)
  values (v_user_id, 'Floris Dev (Seed)', 'Kemang, Jakarta Selatan', '6281200000000', true)
  on conflict (user_id) do update set nama = excluded.nama
  returning id into v_floris_id;

  if not exists (select 1 from public.orders where kode = 'KM-DEV1') then
    insert into public.orders (
      kode, nama, wa, alamat, tanggal, waktu, mode, ukuran, wrapping,
      items, subtotal, ongkir, total, status, floris_id
    ) values (
      'KM-DEV1', 'Salsabila Putri', '6281300000000',
      'Jl. Kemang Raya No. 12, RT 03/RW 05, Kel. Bangka, Kec. Mampang Prapatan, Jakarta Selatan',
      current_date + 1, '10:00 – 12:00', 'bouquet', 'M', 'kraft',
      '[{"type":"mawar_merah","x":50,"y":30,"size":16,"rot":0},
        {"type":"peony","x":38,"y":45,"size":18,"rot":-8},
        {"type":"eucalyptus","x":62,"y":48,"size":20,"rot":10}]'::jsonb,
      180000, 15000, 195000, 'matching', v_floris_id
    );
  end if;
end $$;
