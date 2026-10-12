# Database schema (P2.2–P2.6)

PostgreSQL tables for Contact and RFQ **application submissions**. They do not store IMAPL company facts (headquarters, certifications, OEM relationships, and similar unresolved P1 items).

The database starts **empty**. No seed rows.

Apply P2.2, P2.4, then P2.5: `supabase/migrations/20260830214200_p2_2_submissions_schema.sql`, `supabase/migrations/20260830233000_p2_4_storage_notifications.sql`, and `supabase/migrations/20260830234800_p2_5_admin_auth.sql` (or `supabase db push`). PostgreSQL 14+ is required. Do not put database passwords in this repo or in Vite.

## Tables

```text
admin_users
contact_submissions
rfq_submissions 1──* rfq_attachments
submission_rate_events
```

### `admin_users` (P2.5)

Staff membership only. No passwords. `user_id` is the Supabase Auth user UUID.

| Column | Purpose |
| --- | --- |
| `user_id` | PK, references `auth.users(id)` on delete cascade |
| `role` | Constrained to `ADMIN` |
| `created_at` | Database clock |

Rows are inserted by the project owner (SQL editor / service role). There is no INSERT policy for `authenticated`, so a signed-in user cannot add themselves.

### `contact_submissions`

Contact form fields from `src/pages/Contact.tsx`:

| Column | Source |
| --- | --- |
| `full_name` | Name |
| `company` | Company |
| `email` | Email |
| `phone` | Phone (optional) |
| `subject` | Enquiry subject (fixed list) |
| `message` | Message |
| `consent_given` | Consent (must be true) |
| `status` | Admin workflow (default `NEW`) |
| `notification_status` | `PENDING` · `SENT` · `FAILED` · `SKIPPED` (P2.4) |
| `notified_at` | Set when a notification email is sent |
| `created_at` / `updated_at` | Database clocks |

### `rfq_submissions`

RFQ four-step prepare flow from `src/pages/RequestQuote.tsx`:

| Column | Source |
| --- | --- |
| `full_name`, `job_title`, `company`, `country`, `email`, `phone` | Step 1 |
| `industry`, `program_name`, `platform`, `delivery_date`, `annual_quantity` | Step 2 |
| `customer_export_control` | Visitor's export-control **selection** (not an IMAPL ITAR/EAR claim) |
| `notes` | Program notes |
| `part_number`, `part_name`, `material`, `process`, `tolerance`, `finish`, `part_quantity` | Step 3 |
| `drawings_available` | “Do you have drawings?” |
| `consent_given` | Step 4 consent (must be true) |
| `status` | Admin workflow (default `NEW`) |
| `notification_status` / `notified_at` | Email notification state (P2.4) |

### `rfq_attachments`

Metadata for a **private** Storage object (P2.4). File bytes are not stored in PostgreSQL.

- `rfq_submission_id` → `rfq_submissions.id` (cascade delete)
- `original_filename`
- `storage_path` (unique; `rfq/{submission_id}/{attachment_id}/{sanitized_filename}`)
- `mime_type`
- `file_size_bytes` (max 50 MiB)

Private bucket: `rfq-attachments` (`public = false`, 50 MiB limit). No anon/authenticated Storage policies. Uploads use a short-lived signed upload token issued by `submit-rfq`. Staff downloads use the `admin-download-attachment` Edge Function, which issues a **60-second** signed URL after verifying Auth + `admin_users` + that the attachment belongs to the requested RFQ. The UI never displays `storage_path`. The browser role is not granted `storage_path`.

Apply P2.4 with `supabase/migrations/20260830233000_p2_4_storage_notifications.sql` after P2.2. Apply P2.5 after P2.4.

## Status values

CHECK-constrained `text` (not a PostgreSQL enum) so later phases can add values with a small migration instead of `ALTER TYPE`.

**Contact:** `NEW` · `IN_PROGRESS` · `RESOLVED` · `CLOSED`

**RFQ:** `NEW` · `REVIEWING` · `QUOTING` · `COMPLETED` · `CLOSED`

Administrators change these values in `/admin`. Do not invent extra workflow states in the UI.

## Constraints

Closed lists match the current frontend selects:

- Contact `subject` — eight enquiry types in `Contact.tsx`
- RFQ `country`, `industry`, `process` — option lists in `RequestQuote.tsx`
- RFQ `customer_export_control` — visitor export-control options, or null
- `consent_given` must be `true`
- Email and optional phone patterns follow `src/form.ts`
- Attachment `file_size_bytes` max 50 MiB

P2.3 must store empty optional strings as `NULL` (the frontend uses `''` for unused fields).

## Indexes

| Index | Why |
| --- | --- |
| `*_created_at_idx` | Newest-first admin lists |
| `*_status_idx` | Filter by workflow status |
| `*_email_idx` | Lookup by submitter email |
| `rfq_attachments_rfq_submission_id_idx` | FK lookup (PostgreSQL does not auto-index FKs) |
| unique `storage_path` | One object key per attachment |

## RLS

RLS is **enabled** on `admin_users`, `contact_submissions`, `rfq_submissions`, `rfq_attachments`, and `submission_rate_events`.

**anon** has no table privileges and no policies. Anonymous visitors cannot read or write submissions, attachment metadata, or admin membership.

**authenticated** (any signed-in Auth user who is **not** in `admin_users`):

- May `SELECT` only their own `admin_users` row (empty if they are not an admin)
- Cannot `INSERT`/`UPDATE`/`DELETE` `admin_users` (no policies; cannot self-promote)
- Cannot read or update submissions: policies require `public.is_admin()`

**authorized admin** (`admin_users.role = 'ADMIN'`):

- `SELECT` on contact and RFQ submissions
- `UPDATE (status)` only on those tables (other columns are not granted)
- `SELECT` on attachment metadata except `storage_path`
- Still cannot insert or delete submission rows from the browser

`public.is_admin()` is `SECURITY DEFINER` and is used only by RLS. It is not a public API.

There is no `USING (true)` policy.

The publishable browser client therefore cannot read submissions unless the current session is an authorized admin.

Visitor writes still use Edge Functions and `service_role` (never `VITE_*`).

`submission_rate_events` is service-role only (no anon/authenticated policies). It stores SHA-256 client keys, not raw IP addresses.

## Why the frontend does not insert rows

Direct browser `INSERT` would require an anonymous write policy. Contact and Request Quote call Edge Functions instead. See [submissions.md](./submissions.md).

## Later phases

- **P2.3** — secure Contact / RFQ submission ([submissions.md](./submissions.md))
- **P2.4** — private Storage + attachment metadata + email notifications ([submissions.md](./submissions.md))
- **P2.5** — Auth + admin dashboard + private signed downloads ([supabase-setup.md](./supabase-setup.md))
- **P2.6** — security hardening, rate limiting, and production-readiness checklist (`docs/p2-6-security-and-release-checklist.md`)

Do not generate TypeScript database types in these phases; they would be hand-maintained and drift from SQL.
