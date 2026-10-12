-- P2.2 — Contact / RFQ submission schema + Row Level Security
-- Reproducible on a fresh Supabase (PostgreSQL) project.
-- No seed data. No Storage. No Auth. No public policies.

-- ---------------------------------------------------------------------------
-- updated_at helper (minimal)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Sets NEW.updated_at to now() on row update. Used only by submission tables.';

revoke all on function public.set_updated_at() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- contact_submissions
-- Fields match src/pages/Contact.tsx (name, company, email, phone, subject,
-- message, consent). Status is for a future admin workflow (P2.5).
-- ---------------------------------------------------------------------------
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  consent_given boolean not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_submissions_full_name_len
    check (char_length(btrim(full_name)) between 2 and 80),
  constraint contact_submissions_company_len
    check (char_length(btrim(company)) between 2 and 120),
  constraint contact_submissions_email_len
    check (char_length(btrim(email)) between 5 and 120),
  constraint contact_submissions_email_format
    check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  constraint contact_submissions_phone_format
    check (phone is null or btrim(phone) ~ '^\+?[\d\s().-]{7,20}$'),
  constraint contact_submissions_subject_allowed
    check (subject in (
      'General Enquiry',
      'Request for Quotation (RFQ)',
      'Supplier Qualification / Audit',
      'Capability Enquiry',
      'Facility Visit Request',
      'Partnership / Collaboration',
      'Career / Employment',
      'Other'
    )),
  constraint contact_submissions_message_len
    check (char_length(btrim(message)) between 10 and 2000),
  constraint contact_submissions_consent_true
    check (consent_given = true),
  constraint contact_submissions_status_allowed
    check (status in ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

comment on table public.contact_submissions is
  'Contact form enquiries. Empty at deploy. Not IMAPL company facts.';
comment on column public.contact_submissions.consent_given is
  'Visitor confirmed the enquiry may be used to respond. Must be true.';
comment on column public.contact_submissions.status is
  'Admin workflow: NEW, IN_PROGRESS, RESOLVED, CLOSED. CHECK-constrained text (easier to extend than a PG enum).';

create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index contact_submissions_status_idx
  on public.contact_submissions (status);
create index contact_submissions_email_idx
  on public.contact_submissions (email);

comment on index public.contact_submissions_created_at_idx is
  'Admin list sort by newest first.';
comment on index public.contact_submissions_status_idx is
  'Admin filter by workflow status.';
comment on index public.contact_submissions_email_idx is
  'Staff lookup by submitter email.';

create trigger contact_submissions_set_updated_at
  before update on public.contact_submissions
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- rfq_submissions
-- Fields match src/pages/RequestQuote.tsx four-step prepare flow.
-- customer_export_control is the visitor's selection, not an IMAPL claim.
-- ---------------------------------------------------------------------------
create table public.rfq_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  job_title text not null,
  company text not null,
  country text not null,
  email text not null,
  phone text,
  industry text not null,
  program_name text not null,
  platform text,
  delivery_date date,
  annual_quantity text,
  customer_export_control text,
  notes text,
  part_number text,
  part_name text not null,
  material text,
  process text not null,
  tolerance text,
  finish text,
  part_quantity text not null,
  drawings_available boolean not null default false,
  consent_given boolean not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rfq_submissions_full_name_len
    check (char_length(btrim(full_name)) between 2 and 80),
  constraint rfq_submissions_job_title_len
    check (char_length(btrim(job_title)) between 2 and 80),
  constraint rfq_submissions_company_len
    check (char_length(btrim(company)) between 2 and 120),
  constraint rfq_submissions_country_allowed
    check (country in (
      'India',
      'United States',
      'United Kingdom',
      'France',
      'Germany',
      'Japan',
      'Singapore',
      'UAE',
      'Canada',
      'Australia',
      'Other'
    )),
  constraint rfq_submissions_email_len
    check (char_length(btrim(email)) between 5 and 120),
  constraint rfq_submissions_email_format
    check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  constraint rfq_submissions_phone_format
    check (phone is null or btrim(phone) ~ '^\+?[\d\s().-]{7,20}$'),
  constraint rfq_submissions_industry_allowed
    check (industry in (
      'Commercial Aviation',
      'Defense & Military',
      'Space & Satellites',
      'Helicopter & Rotorcraft',
      'UAV & Autonomous',
      'MRO & Aftermarket',
      'Other'
    )),
  constraint rfq_submissions_program_name_len
    check (char_length(btrim(program_name)) between 2 and 120),
  constraint rfq_submissions_platform_len
    check (platform is null or char_length(btrim(platform)) <= 120),
  constraint rfq_submissions_annual_quantity_len
    check (annual_quantity is null or char_length(btrim(annual_quantity)) <= 80),
  constraint rfq_submissions_customer_export_control_allowed
    check (
      customer_export_control is null
      or customer_export_control in (
        'ITAR Controlled',
        'EAR Controlled',
        'Dual-use (EU)',
        'No export controls'
      )
    ),
  constraint rfq_submissions_notes_len
    check (notes is null or char_length(btrim(notes)) <= 2000),
  constraint rfq_submissions_part_number_len
    check (part_number is null or char_length(btrim(part_number)) <= 80),
  constraint rfq_submissions_part_name_len
    check (char_length(btrim(part_name)) between 2 and 160),
  constraint rfq_submissions_material_len
    check (material is null or char_length(btrim(material)) <= 120),
  constraint rfq_submissions_process_allowed
    check (process in (
      'CNC Machining',
      'Tooling',
      'Jigs & Fixtures',
      'Assembly',
      'Inspection',
      'Load Testing',
      'Part Marking',
      'Multiple Processes',
      'Other'
    )),
  constraint rfq_submissions_tolerance_len
    check (tolerance is null or char_length(btrim(tolerance)) <= 120),
  constraint rfq_submissions_finish_len
    check (finish is null or char_length(btrim(finish)) <= 120),
  constraint rfq_submissions_part_quantity_len
    check (char_length(btrim(part_quantity)) between 1 and 80),
  constraint rfq_submissions_consent_true
    check (consent_given = true),
  constraint rfq_submissions_status_allowed
    check (status in ('NEW', 'REVIEWING', 'QUOTING', 'COMPLETED', 'CLOSED'))
);

comment on table public.rfq_submissions is
  'RFQ prepare-flow submissions. Empty at deploy. Not IMAPL company facts.';
comment on column public.rfq_submissions.country is
  'Visitor country from the RFQ contact-step select list. Not an IMAPL facility location.';
comment on column public.rfq_submissions.industry is
  'Visitor industry selection from the RFQ form. Not an IMAPL market-claim record.';
comment on column public.rfq_submissions.customer_export_control is
  'Visitor-selected classification of their requirement (ITAR/EAR/etc). Not an IMAPL certification or ITAR-ready claim.';
comment on column public.rfq_submissions.process is
  'Visitor manufacturing-process selection from the RFQ form. Not an IMAPL capability claim.';
comment on column public.rfq_submissions.annual_quantity is
  'Optional free-text annual quantity from the RFQ program step.';
comment on column public.rfq_submissions.part_quantity is
  'Required free-text quantity from the RFQ part step.';
comment on column public.rfq_submissions.drawings_available is
  'Whether the visitor indicated drawings exist. File bytes are not stored here.';
comment on column public.rfq_submissions.status is
  'Admin workflow: NEW, REVIEWING, QUOTING, COMPLETED, CLOSED. CHECK-constrained text.';

create index rfq_submissions_created_at_idx
  on public.rfq_submissions (created_at desc);
create index rfq_submissions_status_idx
  on public.rfq_submissions (status);
create index rfq_submissions_email_idx
  on public.rfq_submissions (email);

comment on index public.rfq_submissions_created_at_idx is
  'Admin list sort by newest first.';
comment on index public.rfq_submissions_status_idx is
  'Admin filter by workflow status.';
comment on index public.rfq_submissions_email_idx is
  'Staff lookup by submitter email.';

create trigger rfq_submissions_set_updated_at
  before update on public.rfq_submissions
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- rfq_attachments
-- Metadata only. No Storage bucket, no bytea. storage_path is a future
-- private object key (P2.4). PostgreSQL does not auto-index FKs.
-- ---------------------------------------------------------------------------
create table public.rfq_attachments (
  id uuid primary key default gen_random_uuid(),
  rfq_submission_id uuid not null
    references public.rfq_submissions (id)
    on delete cascade,
  original_filename text not null,
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rfq_attachments_filename_len
    check (char_length(btrim(original_filename)) between 1 and 260),
  constraint rfq_attachments_storage_path_len
    check (char_length(btrim(storage_path)) between 1 and 1024),
  constraint rfq_attachments_storage_path_unique
    unique (storage_path),
  constraint rfq_attachments_file_size_range
    check (
      file_size_bytes is null
      or (file_size_bytes >= 0 and file_size_bytes <= 52428800)
    )
);

comment on table public.rfq_attachments is
  'RFQ drawing metadata only. Files go to private Storage in P2.4. Not public.';
comment on column public.rfq_attachments.storage_path is
  'Future private Storage object key, e.g. rfq/{submission_id}/{attachment_id}/{filename}. No public URLs.';
comment on column public.rfq_attachments.file_size_bytes is
  'Matches frontend MAX_DRAWING_BYTES (50 MiB).';

create index rfq_attachments_rfq_submission_id_idx
  on public.rfq_attachments (rfq_submission_id);

comment on index public.rfq_attachments_rfq_submission_id_idx is
  'Lookup attachments for one RFQ. PostgreSQL does not index foreign keys automatically.';

create trigger rfq_attachments_set_updated_at
  before update on public.rfq_attachments
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- No policies: anon and authenticated cannot SELECT/INSERT/UPDATE/DELETE.
-- service_role bypasses RLS (P2.3 Edge Functions / server path).
-- P2.5 will add authenticated admin policies.
-- ---------------------------------------------------------------------------
alter table public.contact_submissions enable row level security;
alter table public.rfq_submissions enable row level security;
alter table public.rfq_attachments enable row level security;

revoke all on table public.contact_submissions from public, anon, authenticated;
revoke all on table public.rfq_submissions from public, anon, authenticated;
revoke all on table public.rfq_attachments from public, anon, authenticated;

grant all on table public.contact_submissions to service_role;
grant all on table public.rfq_submissions to service_role;
grant all on table public.rfq_attachments to service_role;
