-- P2.6 — hashed client rate-limit events for public Edge Functions
-- Additive. Does not rewrite P2.2/P2.4/P2.5. No seed data. No USING (true).

create table public.submission_rate_events (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  client_key text not null,
  created_at timestamptz not null default now(),
  constraint submission_rate_events_scope_allowed
    check (scope in (
      'submit-contact',
      'submit-rfq',
      'complete-rfq-upload',
      'admin-download-attachment'
    )),
  constraint submission_rate_events_key_len
    check (char_length(client_key) = 64)
);

comment on table public.submission_rate_events is
  'Hashed client keys for abuse throttling. Raw IP addresses are not stored.';

create index submission_rate_events_lookup_idx
  on public.submission_rate_events (scope, client_key, created_at desc);

alter table public.submission_rate_events enable row level security;

revoke all on table public.submission_rate_events from public, anon, authenticated;
grant all on table public.submission_rate_events to service_role;
