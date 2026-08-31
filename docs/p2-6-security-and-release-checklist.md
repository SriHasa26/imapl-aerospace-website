# P2.6 security and release checklist

Statuses used: **PASS** · **FAIL** · **BLOCKED** · **NOT TESTED**

PASS means the item was actually tested (live or local) or is a confirmed build/config fact. Code inspection is labelled in notes and is **not** recorded as PASS unless a test ran.

Until the owner approves public content, `noindex, nofollow` stays on. Do not enable a production sitemap or analytics.

## Security

| Item | Status | Evidence |
| --- | --- | --- |
| Frontend source has no service-role / Resend / notification secrets | PASS | Repo search: privileged names only in Edge Functions, docs, and `src/lib/supabase.ts` rejection logic |
| Production bundle has no secret values | PASS | `npm run build`; no `sb_secret_`, `RESEND_API_KEY`, or notification secrets in `dist/` |
| `.env.local` is gitignored and untracked | PASS | `git check-ignore -v .env.local`; not in `git ls-files` |
| Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are browser env | PASS | `src/vite-env.d.ts`, `src/lib/supabase.ts` |
| Service-role key stays server-side | PASS | Used only in `supabase/functions/_shared/service-client.ts` |
| No `USING (true)` RLS policies | PASS | Migration grep |
| CORS in application code never uses `*` | PASS | `supabase/functions/_shared/cors.ts` |
| Live function CORS (deployed) | BLOCKED | Functions return 404; gateway `*` on missing functions is not this app’s CORS module |
| Production `ALLOWED_ORIGINS` | BLOCKED | Production frontend origin is not configured/known; CLI not logged in |

## Authentication

| Item | Status | Evidence |
| --- | --- | --- |
| Uses Supabase Auth password sign-in (no custom password store) | PASS | Code: `signInWithPassword` only; no `signUp` in `src/` |
| Valid admin login | BLOCKED | No provisioned admin; P2.5 `admin_users` not on live project (`PGRST205`) |
| Invalid password | NOT TESTED | Would hit live Auth; no test account created |
| Logout | NOT TESTED | Requires a session |
| Session refresh / expiry / back-forward | NOT TESTED | Requires a session |
| Direct `/admin` while anonymous | PASS | Code: `AdminRoot` redirects to `/admin/login`. Preview serves `/admin` and `/admin/login` as the SPA shell (200) |
| Public sign-up disabled in Auth dashboard | BLOCKED | CLI not authenticated; dashboard not accessible from this session |

## Authorization

| Item | Status | Evidence |
| --- | --- | --- |
| Visitor ≠ authenticated ≠ admin | PASS | Schema: `admin_users` + `is_admin()` (code/migrations) |
| Non-admin cannot self-insert into `admin_users` | BLOCKED | Table not live (`PGRST205`). Migration has SELECT-own only, no INSERT policy |
| Admin allowed / non-admin denied / anonymous denied (API) | BLOCKED | No Auth test users. Anonymous REST denied where tables exist (see RLS) |

## RLS

| Item | Status | Evidence |
| --- | --- | --- |
| RLS enabled in migrations on submissions, attachments, `admin_users`, rate-limit table | PASS | SQL inspected |
| Anon SELECT contact / RFQ / attachments | PASS | Live: HTTP 401, PostgreSQL `42501` |
| Anon INSERT / UPDATE / DELETE contact | PASS | Live: HTTP 401, `42501` |
| Anon SELECT `admin_users` | BLOCKED | Live: `PGRST205` (P2.5 not applied) |
| Anon SELECT `submission_rate_events` | BLOCKED | Live: `PGRST205` (P2.6 not applied) |
| Authenticated non-admin SELECT submissions | NOT TESTED | No non-admin JWT. Policies require `is_admin()` |
| Admin SELECT / status UPDATE | NOT TESTED | No admin JWT; column grant is `UPDATE (status)` only |

## Storage

| Item | Status | Evidence |
| --- | --- | --- |
| Bucket defined private in P2.4 migration | PASS | `public = false`, no anon/authenticated object policies |
| Live private bucket `rfq-attachments` | BLOCKED | Live: `NoSuchBucket` on public object path |
| Anon list / read / download / delete / overwrite | BLOCKED | Bucket not deployed. Public path did not return a file |
| Non-admin drawing access | NOT TESTED | No Auth user; no objects |
| Signed URL 60s, not stored, no service-role in URL | BLOCKED | `admin-download-attachment` not deployed (404). Code: `SIGNED_SECONDS = 60` |
| Cross-RFQ signed download | BLOCKED | Function not deployed. Code requires both `id` and `rfq_submission_id` |

## Contact

| Item | Status | Evidence |
| --- | --- | --- |
| Frontend validation | PASS | Local: `scripts/p23-validation-check.ts`, `scripts/p26-validation-check.ts` |
| Server validation (bypass frontend) | PASS | Same scripts import Edge `validate.ts` |
| Live `submit-contact` E2E | BLOCKED | Function 404 |
| Email after insert | BLOCKED | Function not deployed; Resend secrets unknown |
| Invalid email / phone / subject / consent / oversized body | PASS | Local validation script. Live function not available |
| Rate limit | BLOCKED | Table and function not live |

## RFQ

| Item | Status | Evidence |
| --- | --- | --- |
| Validation (enums, date, consent, extra fields ignored) | PASS | Local P2.3 + P2.6 scripts |
| File extension / size / filename / path | PASS | Local `files.ts` checks including `.exe`, zip, oversize, null bytes |
| Live RFQ without attachment | BLOCKED | `submit-rfq` 404 |
| Live RFQ with attachment | BLOCKED | Functions + bucket not deployed |
| Orphan object cleanup | BLOCKED | Cannot run. Code: metadata insert failure deletes the Storage object |
| Upload fail → no fake metadata | BLOCKED | Cannot run. Code: metadata inserted only after object exists |

## Email

| Item | Status | Evidence |
| --- | --- | --- |
| Success path | BLOCKED | Not deployed / secrets unknown |
| DB success + email failure still succeeds for customer | BLOCKED | Cannot run. Code: `sendNotification` failure sets `FAILED` and still returns 201/200 |
| Customer does not see Resend errors | PASS | Code: `publicNotificationFlag` only `sent`/`failed`/`skipped`; logs status code only |
| Missing Resend config → `SKIPPED` | PASS | Code: `notify.ts` |

## CORS / abuse

| Item | Status | Evidence |
| --- | --- | --- |
| App CORS never `*` | PASS | `cors.ts` |
| Live OPTIONS for deployed functions | BLOCKED | Functions 404; missing-function gateway sent `*` |
| Rate limiting implemented | PASS | Migration + `rate-limit.ts` wired into four functions. Not live-tested |
| JSON body cap 50 KB | PASS | `readJsonBody` |
| Malformed JSON | PASS | Returns 400 `validation_failed` (code). Live function not available |

## Privacy / legal / SEO / claims

| Item | Status | Evidence |
| --- | --- | --- |
| Privacy describes submissions, private files, admin session, staff access | PASS | `src/pages/Privacy.tsx` (draft, not owner-approved) |
| Terms describe RFQ submit + private upload | PASS | `src/pages/Terms.tsx` (draft) |
| No invented jurisdiction / retention / registration | PASS | Unconfirmed notes remain |
| `noindex, nofollow` | PASS | `index.html` and `dist/index.html` |
| No sitemap / analytics added | PASS | Footer still defers sitemap |
| Public pages still filter `isPublishable`; HIGH_RISK stays in models | PASS | Page imports + `isPublishable` filters. `legacy-inventory` not imported by the app |

## Accessibility / responsive / performance

| Item | Status | Evidence |
| --- | --- | --- |
| Skip link, form labels, Contact `aria-*` | PASS | Inspected; Contact already labelled |
| Admin login error association + table captions | PASS | P2.6 edits |
| Full keyboard / screen-reader pass | NOT TESTED | No browser assistive-tech session |
| Responsive: public + admin | NOT TESTED | Classes include mobile nav, `overflow-x-auto` tables, wrapping admin chrome. No device lab |
| Bundle split (Supabase off homepage) | PASS | Build: main `386 kB`; Contact/Quote/Admin lazy chunks. Previous 668 kB single-chunk warning gone |

## Public site

| Item | Status | Evidence |
| --- | --- | --- |
| Preview HTTP 200 for `/` about capabilities products industries quality facilities resources careers contact quote privacy terms | PASS | `vite preview` port 4176 |
| History API / nav / footer / hash / mobile menu behaviour | NOT TESTED | No interactive browser pass this phase |
| Admin not in public nav source | PASS | No `/admin` in `Navigation.tsx` / `Footer.tsx` |

## Deployment

| Item | Status | Evidence |
| --- | --- | --- |
| P2.2 tables exist (anon denied) | PASS | Live 401 on submission tables |
| P2.3 functions | BLOCKED | 404 |
| P2.4 bucket + functions | BLOCKED | `NoSuchBucket`; functions 404 |
| P2.5 migration + admin download + first admin | BLOCKED | `admin_users` missing; function 404 |
| P2.6 rate-limit migration | BLOCKED | Table missing; CLI `supabase login` required for `db push` |
| Resend + `ALLOWED_ORIGINS` | BLOCKED | Secrets not verifiable without CLI/dashboard |
| `npm install` / `npm run build` / validation scripts | PASS | 0 vulnerabilities; build succeeded; P2.3 and P2.6 scripts passed |

## Rollback considerations

- P2.6 adds an additive migration and function throttling. If functions are deployed before the rate-limit table, throttling fail-opens with a log line (`rate limit table missing`) so Contact/RFQ are not bricked.
- Do not roll back P2.2–P2.5 migrations in place. Do not reset the remote database.
- Frontend-only rollback: revert P2.6 UI/lazy-load commits; public site does not depend on the rate-limit table.

## Production-readiness verdict

**Not production-ready.** Critical backend deploy and Auth provisioning are BLOCKED. Do not enable indexing.
