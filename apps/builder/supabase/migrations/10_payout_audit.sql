-- ============================================================
-- KALAMEKAR — Migrasi Fase 4c: payout tracking & audit log admin
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
-- ============================================================

alter table public.orders
  add column if not exists commission_rate    numeric(5,2) not null default 20.00,
  add column if not exists payout_status      text not null default 'belum_dibayar'
    check (payout_status in ('belum_dibayar', 'dibayar')),
  add column if not exists commission_amount  integer,
  add column if not exists payout_amount      integer,
  add column if not exists payout_paid_at     timestamptz,
  add column if not exists payout_note        text;

create index if not exists orders_payout_status_idx on public.orders (payout_status);

-- ============================================================
-- Audit log lintas-entity untuk aksi admin (order & floris). Beda dari
-- orders.status_log yang cuma catat perubahan status order — tabel ini
-- catat SEMUA mutasi admin (status, assign floris, catatan, payout,
-- verify/toggle/edit floris) supaya ada satu jejak akuntabilitas.
-- ============================================================
create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid references auth.users(id) on delete set null,
  admin_email text not null,
  action      text not null,
  entity_type text not null check (entity_type in ('order', 'florist')),
  entity_id   uuid not null,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_entity_idx  on public.admin_audit_log (entity_type, entity_id);

alter table public.admin_audit_log enable row level security;

drop policy if exists "admin baca audit log" on public.admin_audit_log;
create policy "admin baca audit log"
  on public.admin_audit_log
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Sengaja tidak ada policy insert/update/delete — audit log hanya ditulis
-- lewat Route Handler (service role) via lib/auditLog.ts, sama pola dengan
-- mutasi lain di /admin.
