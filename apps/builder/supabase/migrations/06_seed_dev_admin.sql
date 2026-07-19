-- ============================================================
-- KALAMEKAR — Seed DEV-ONLY untuk verifikasi Fase 4 (dashboard admin)
-- JANGAN dijalankan di project production.
--
-- Membuat user auth admin dummy — email: admin.dev@kalamekar.test
--                                  password: admin123dev
-- dengan app_metadata.role = 'admin' supaya bisa masuk ke /admin.
--
-- Cara membuat admin SUNGGUHAN (bukan dev seed): buat/pilih user lewat
-- Supabase Dashboard -> Authentication, lalu edit user tsb -> App
-- Metadata -> tambahkan {"role": "admin"}.
--
-- Jalankan di SQL Editor Supabase. Aman dijalankan berulang (idempotent).
-- ============================================================

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = 'admin.dev@kalamekar.test';

  if v_user_id is not null then
    update auth.users
    set email_change = coalesce(email_change, ''),
        email_change_token_new = coalesce(email_change_token_new, ''),
        raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
    where id = v_user_id;
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
      'admin.dev@kalamekar.test', crypt('admin123dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"],"role":"admin"}', '{}', '', '',
      '', ''
    );

    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id::text, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'admin.dev@kalamekar.test'),
      'email', now(), now(), now()
    );
  end if;
end $$;
