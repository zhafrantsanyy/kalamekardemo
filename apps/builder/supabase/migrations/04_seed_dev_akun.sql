-- ============================================================
-- KALAMEKAR — Seed DEV-ONLY untuk verifikasi Fase 3 (dashboard pembeli)
-- JANGAN dijalankan di project production.
--
-- Membuat:
--   1. User auth pembeli dummy — email: pembeli.dev@kalamekar.test
--                                 password: pembeli123dev
--   2. Satu order guest contoh (user_id NULL, kode KM-DEV2) dengan
--      nomor WA yang diketahui, untuk mencoba alur klaim order guest
--      dari /akun/klaim.
--
-- Jalankan SETELAH 03_phase3_akun.sql, di SQL Editor Supabase.
-- Aman dijalankan berulang kali (idempotent).
-- ============================================================

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = 'pembeli.dev@kalamekar.test';

  if v_user_id is not null then
    update auth.users
    set email_change = coalesce(email_change, ''),
        email_change_token_new = coalesce(email_change_token_new, '')
    where id = v_user_id
      and (email_change is null or email_change_token_new is null);
  end if;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token,
      email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      'pembeli.dev@kalamekar.test', crypt('pembeli123dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}', '{}', '', '',
      '', ''
    );

    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id::text, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'pembeli.dev@kalamekar.test'),
      'email', now(), now(), now()
    );
  end if;

  if not exists (select 1 from public.orders where kode = 'KM-DEV2') then
    insert into public.orders (
      kode, nama, wa, alamat, tanggal, waktu, mode, ukuran, wrapping,
      items, subtotal, ongkir, total, status
    ) values (
      'KM-DEV2', 'Budi Santoso', '6281400000000',
      'Jl. Melati No. 5, Kel. Cipete, Kec. Cilandak, Jakarta Selatan',
      current_date + 2, '13:00 – 15:00', 'bouquet', 'S', 'kraft',
      '[{"type":"tulip","x":45,"y":35,"size":18,"rot":5},
        {"type":"babys","x":58,"y":42,"size":16,"rot":-6}]'::jsonb,
      95000, 15000, 110000, 'baru'
    );
  end if;
end $$;
