-- P2.4 — private RFQ Storage + notification status
-- Does not modify P2.2 objects except additive columns.
-- No seed data. Bucket is private. No public Storage policies.

-- ---------------------------------------------------------------------------
-- Notification status on submissions
-- ---------------------------------------------------------------------------
alter table public.contact_submissions
  add column if not exists notification_status text not null default 'PENDING',
  add column if not exists notified_at timestamptz;

alter table public.rfq_submissions
  add column if not exists notification_status text not null default 'PENDING',
  add column if not exists notified_at timestamptz;

alter table public.contact_submissions
  drop constraint if exists contact_submissions_notification_status_allowed;
alter table public.contact_submissions
  add constraint contact_submissions_notification_status_allowed
  check (notification_status in ('PENDING', 'SENT', 'FAILED', 'SKIPPED'));

alter table public.rfq_submissions
  drop constraint if exists rfq_submissions_notification_status_allowed;
alter table public.rfq_submissions
  add constraint rfq_submissions_notification_status_allowed
  check (notification_status in ('PENDING', 'SENT', 'FAILED', 'SKIPPED'));

comment on column public.contact_submissions.notification_status is
  'Internal email-notification state. SKIPPED means the mail provider was not configured. Customer success does not depend on this.';
comment on column public.rfq_submissions.notification_status is
  'Internal email-notification state. PENDING until submit (no file) or complete-rfq-upload (with file).';

-- ---------------------------------------------------------------------------
-- Private Storage bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('rfq-attachments', 'rfq-attachments', false, 52428800)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit;

-- RLS stays enabled on storage.objects (Supabase default).
-- Do not create SELECT/INSERT/UPDATE/DELETE policies for anon or authenticated
-- on bucket rfq-attachments. P2.5 may add admin-only policies.
drop policy if exists "Public read rfq-attachments" on storage.objects;
drop policy if exists "Public upload rfq-attachments" on storage.objects;
drop policy if exists "Anon read rfq-attachments" on storage.objects;
drop policy if exists "Anon upload rfq-attachments" on storage.objects;
drop policy if exists "Authenticated read rfq-attachments" on storage.objects;
drop policy if exists "Authenticated upload rfq-attachments" on storage.objects;
