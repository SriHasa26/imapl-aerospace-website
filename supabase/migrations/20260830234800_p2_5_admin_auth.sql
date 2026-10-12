-- P2.5 — admin membership + RLS for authorized admins only
-- Additive. Does not rewrite P2.2/P2.4 migrations.
-- No seed admin rows. No public signup. No USING (true).

-- ---------------------------------------------------------------------------
-- admin_users: Auth user_id membership only. No passwords.
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'ADMIN',
  created_at timestamptz not null default now(),
  constraint admin_users_role_allowed check (role = 'ADMIN')
);

comment on table public.admin_users is
  'Staff who may use /admin. Provisioned by the project owner, not by self-signup.';

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from public, anon, authenticated;
grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;

-- Authenticated users may read only their own membership row (empty if not admin).
-- No INSERT/UPDATE/DELETE policies: cannot self-promote.
create policy admin_users_select_own
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- is_admin(): used by submission RLS. SECURITY DEFINER avoids policy recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'ADMIN'
  );
$$;

comment on function public.is_admin() is
  'True when the current Auth user is in admin_users. Used by RLS. Not a public API.';

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Submission access: authenticated + is_admin() only.
-- Column-level UPDATE so admins can change status, not message/email/etc.
-- anon remains revoked. No INSERT/DELETE for authenticated.
-- ---------------------------------------------------------------------------
grant select on table public.contact_submissions to authenticated;
grant update (status) on table public.contact_submissions to authenticated;

grant select on table public.rfq_submissions to authenticated;
grant update (status) on table public.rfq_submissions to authenticated;

-- Attachment metadata only. storage_path is not granted to the browser role.
grant select (
  id,
  rfq_submission_id,
  original_filename,
  mime_type,
  file_size_bytes,
  created_at
) on table public.rfq_attachments to authenticated;

create policy contact_submissions_admin_select
  on public.contact_submissions
  for select
  to authenticated
  using (public.is_admin());

create policy contact_submissions_admin_update_status
  on public.contact_submissions
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy rfq_submissions_admin_select
  on public.rfq_submissions
  for select
  to authenticated
  using (public.is_admin());

create policy rfq_submissions_admin_update_status
  on public.rfq_submissions
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy rfq_attachments_admin_select
  on public.rfq_attachments
  for select
  to authenticated
  using (public.is_admin());
