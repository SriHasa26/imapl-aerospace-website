# Contact and RFQ submission (P2.3–P2.4)

Secure server-side submission for Contact and Request a Quote. The browser does **not** insert into `contact_submissions`, `rfq_submissions`, or `rfq_attachments`. Privileged database and Storage writes happen only inside Edge Functions (or via a path-scoped signed upload token those functions issue).

Schema and RLS: [database.md](./database.md). Browser client: [supabase-setup.md](./supabase-setup.md).

## Architecture

```text
Visitor
  → React (publishable key only)
  → submit-contact | submit-rfq
  → validate + empty-string → NULL
  → PostgreSQL via service_role
  → optional signed upload to private bucket rfq-attachments
  → complete-rfq-upload (verify object, insert metadata)
  → Resend notification (if configured)
  → 201/200 { ok: true, notification }
```

50 MiB drawings are **not** sent through the Edge Function body. Supabase function payloads are far smaller than that limit, so P2.4 uses a **short-lived signed upload** scoped to one object path.

## Functions

| Function | Path | JWT |
| --- | --- | --- |
| `submit-contact` | `supabase/functions/submit-contact/` | Off (anonymous visitors) |
| `submit-rfq` | `supabase/functions/submit-rfq/` | Off |
| `complete-rfq-upload` | `supabase/functions/complete-rfq-upload/` | Off |
| `admin-download-attachment` | `supabase/functions/admin-download-attachment/` | **On** (admin session required) |

JWT verification is **off** (anonymous visitors, no Auth session). The gateway still expects the project `apikey`. CORS is origin-allowlisted (never `*`).

## Storage

| Item | Value |
| --- | --- |
| Bucket | `rfq-attachments` |
| Public | **No** |
| Size limit | 50 MiB |
| Path | `rfq/{submission_id}/{attachment_id}/{sanitized_filename}` |
| Policies | None for `anon` / `authenticated` |

The browser never receives a service-role key. It only receives `{ bucket, path, token, completionToken }` after the RFQ row exists. `token` is a Storage signed-upload token for that path only. `completionToken` is an HMAC grant (30 minutes) used by `complete-rfq-upload`.

Allowed extensions (server-enforced): `.pdf` `.step` `.stp` `.dxf` `.iges` `.igs`. Extension is authoritative; MIME is checked when the browser sends one. Executables are rejected by the allowlist.

Filenames are sanitized (no path segments, no `..`). The original name is stored in `rfq_attachments.original_filename`.

## Orphan / failure behaviour

| Failure | Result |
| --- | --- |
| RFQ validation fails | No row, no file, no email |
| RFQ insert fails | No file, customer sees submission error |
| Signed URL cannot be created | RFQ row remains; email sent with attachment count 0; customer is told the drawing was not uploaded |
| File upload fails | RFQ row remains; no metadata; customer can **Retry upload**; not told the file was uploaded |
| Object uploaded, metadata insert fails | Object is deleted; customer can retry |
| Email fails | Row (and file, if confirmed) remain; `notification_status` = `FAILED`; customer is **not** told the submission failed |

The database is the source of truth. Email is best-effort.

The current UI still attaches **one** file. The `rfq_attachments` table is 1:N for later use.

## Email

Provider: [Resend](https://resend.com) (`POST https://api.resend.com/emails`).

Server secrets (never `VITE_*`, never Git):

| Secret | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Provider API key |
| `NOTIFICATION_EMAIL` | Owner-confirmed recipient. Do **not** invent an IMAPL address in code. |
| `NOTIFICATION_FROM` | Verified From address at the provider |
| `ALLOWED_ORIGINS` | Production frontend origin(s) |
| `UPLOAD_TOKEN_SECRET` | Optional HMAC secret; otherwise the function uses `SUPABASE_SERVICE_ROLE_KEY` |

If `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, or `NOTIFICATION_FROM` is missing, `notification_status` is `SKIPPED`. The customer still sees success.

Emails are plain text. They include submission fields and a real UUID reference. They do **not** attach drawings, include public Storage URLs, or make IMAPL certification/OEM/ITAR claims. Visitor export-control is labelled as the submitter’s selection.

Contact email is sent from `submit-contact` after insert. RFQ email is sent from `submit-rfq` when there is no file, or from `complete-rfq-upload` after a confirmed file (so the attachment count is accurate).

P2.5 lets authorized admins open private files through `admin-download-attachment`. That function:

1. Requires a valid Auth JWT (`verify_jwt = true`).
2. Checks `admin_users` for that user (`role = ADMIN`).
3. Loads the attachment only when `id` **and** `rfq_submission_id` both match the request (an admin cannot fetch RFQ B’s file while viewing RFQ A).
4. Creates a Storage signed URL that expires in **60 seconds**.
5. Returns `{ url, expiresIn, filename }` only. It does not return `storage_path` and does not store the signed URL.

The bucket stays private. There is no public object URL and no `authenticated` Storage SELECT policy.

## Rate limiting (P2.6)

Public functions count hashed client keys in `submission_rate_events` (raw IPs are not stored).

| Function | Limit | Window |
| --- | --- | --- |
| `submit-contact` | 8 | 10 minutes |
| `submit-rfq` | 8 | 10 minutes |
| `complete-rfq-upload` | 20 | 10 minutes |
| `admin-download-attachment` | 40 | 10 minutes |

Over-limit responses are HTTP **429** `{ "ok": false, "error": "rate_limited" }` with `Retry-After: 600`. Email uniqueness is not used as a throttle; a legitimate sender may submit more than one enquiry.

If the rate-limit table is not deployed yet, the function logs `rate limit table missing` and continues (fail-open) so P2.3 is not bricked. Apply `20260831001500_p2_6_rate_limit.sql` in production.

## Request / response

Success (no upload): HTTP **201** `{ "ok": true, "notification": "sent"|"failed"|"skipped" }`

Success (file selected): HTTP **201** `{ "ok": true, "upload": { "bucket", "path", "token", "completionToken" } }` then the client uploads and calls `complete-rfq-upload` → HTTP **200** `{ "ok": true, "notification": ... }`

Validation: HTTP **400**. Upload object missing: HTTP **409** `upload_incomplete`. Server error: HTTP **500** without SQL or secrets.

## Frontend

`src/lib/submit.ts` invokes functions and `uploadToSignedUrl`. Success copy distinguishes stored request vs confirmed file vs unconfirmed email. Retry upload does not create a second RFQ.

## Deploy

1. Apply P2.2, P2.4, P2.5, and P2.6 migrations.
2. `npx supabase functions deploy submit-contact submit-rfq complete-rfq-upload admin-download-attachment`
3. Set secrets: `NOTIFICATION_EMAIL`, `NOTIFICATION_FROM`, `RESEND_API_KEY`, and `ALLOWED_ORIGINS` for production.
4. In Storage settings, allow the frontend origin for CORS if signed uploads are blocked in the browser.
5. Do not make `rfq-attachments` public.
