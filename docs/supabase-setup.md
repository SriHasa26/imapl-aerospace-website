# Supabase setup (P2.1)

This frontend initializes a **browser-safe** Supabase client. Contact and Request Quote submit through Edge Functions. The browser does not hold a service-role key. Visitors cannot read submission tables. Administrators sign in with Supabase Auth; only rows in `admin_users` can use `/admin`.

## 1. Create a Supabase project

A Supabase project is required. Create one in the [Supabase dashboard](https://supabase.com/dashboard).

## 2. Project API URL

In the dashboard, open **Project Settings → API** or the **Connect** panel.

Copy the project URL. It looks like:

```text
https://<project-ref>.supabase.co
```

Do **not** append `/rest/v1/` or other API paths. The JavaScript client adds those internally.

## 3. Publishable key

From the same API / Connect panel, copy the **publishable** key (browser / client key).

This is the public, client-safe credential. It is **not** the secret / service-role key.

## 4. Local environment file

Create `.env.local` in the repository root (same folder as `package.json`):

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

Vite only exposes variables prefixed with `VITE_` to the browser bundle.

Restart the Vite dev server after changing `.env.local`.

## 5. Never commit `.env.local`

`.env.local` is gitignored. Do not force-add it. Do not paste real keys into git, chat logs, or this documentation.

## 6. Credential boundary

| Allowed in the React/Vite client | Never in frontend / never `VITE_*` |
| --- | --- |
| Project URL (`VITE_SUPABASE_URL`) | Secret / service-role key |
| Publishable key (`VITE_SUPABASE_PUBLISHABLE_KEY`) | Database password |
| | Email provider API keys (`RESEND_API_KEY`) |
| | Notification recipient (`NOTIFICATION_EMAIL`) |
| | Notification From address (`NOTIFICATION_FROM`) |
| | Database password |
| | Any privileged server credential |

`src/lib/supabase.ts` will refuse to start if a secret or service-role key is placed in `VITE_SUPABASE_PUBLISHABLE_KEY`.

## 7. Phase status

- **P2.1** — browser client + env configuration (this file, `src/lib/supabase.ts`)
- **P2.2** — PostgreSQL schema + RLS (`supabase/migrations/`, `docs/database.md`)
- **P2.3** — Contact / RFQ server-side submission (`docs/submissions.md`)
- **P2.4** — private Storage + email notifications (`docs/submissions.md`)
- **P2.5** — admin authentication and dashboard (this file, `src/admin/`, `supabase/migrations/20260830234800_p2_5_admin_auth.sql`)
- **P2.6** — security hardening, rate limiting, and release checklist (`docs/p2-6-security-and-release-checklist.md`)

Contact and Request Quote submit through Edge Functions. RFQ drawings use a private bucket and a signed upload. Email is sent only when server secrets are configured. Staff use `/admin/login` (not listed in public navigation).

Schema details: [database.md](./database.md). Submission details: [submissions.md](./submissions.md).

## 8. Client module

The app reads env vars and creates one client in `src/lib/supabase.ts`. Do not instantiate additional clients in page components.

`persistSession` is enabled so an administrator stays signed in on that device. That stores the **Auth session** (not the password, not the service-role key). Enquiry form fields are still not written to localStorage by this app.

## 9. Admin authentication (P2.5)

Use **Supabase Auth** email + password (`signInWithPassword`). Do not store passwords in PostgreSQL or in custom localStorage.

There is **no public sign-up** in the website. Do not add a “Create account” page.

In the Supabase dashboard:

1. **Authentication → Providers → Email** — enable email/password for staff.
2. **Authentication → Providers → Email** — turn **off** “Allow new users to sign up” (or equivalent) so visitors cannot register.
3. Create each administrator under **Authentication → Users** (Add user). Confirm the email if the project requires it.
4. Copy that user’s UUID.
5. In the SQL editor, provision membership (this is the only bootstrap path; the app cannot self-promote):

```sql
insert into public.admin_users (user_id)
values ('<auth-user-uuid>');
```

Do not put real UUIDs or passwords in git.

Authorization is **not** “any signed-in user”. Three levels:

| Actor | Access |
| --- | --- |
| Visitor (anon) | Public website only. No submission read. |
| Authenticated non-admin | Signed in, but RLS denies submissions. `/admin` signs them out. |
| Authorized admin | Row in `admin_users` with `role = ADMIN`. Can list/view submissions, update `status`, request a 60-second signed download. |

## 10. Admin routes

Not linked from public navigation or the footer.

| Path | Purpose |
| --- | --- |
| `/admin/login` | Email/password sign-in |
| `/admin` | Dashboard counts from the live tables |
| `/admin/contact` | Contact list (search, status filter, pagination) |
| `/admin/contact/<uuid>` | Contact detail + status |
| `/admin/rfq` | RFQ list |
| `/admin/rfq/<uuid>` | RFQ detail, status, attachment download |

Invalid `/admin/...` paths render the public 404 page.

## 11. Required secrets (server)

Unchanged from P2.3/P2.4, plus Auth users created in the dashboard (not env vars):

| Secret | Where |
| --- | --- |
| `VITE_SUPABASE_URL` | Frontend `.env.local` only |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend `.env.local` only |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions runtime only (never `VITE_*`) |
| `ALLOWED_ORIGINS` | Functions (production frontend origin) |
| `RESEND_API_KEY` / `NOTIFICATION_EMAIL` / `NOTIFICATION_FROM` | Functions, if email is used |
| `UPLOAD_TOKEN_SECRET` | Optional for RFQ upload completion HMAC |

`admin-download-attachment` uses the function runtime `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` already provided by Supabase. It does not need extra secrets.

## 12. Deploy P2.5

1. Apply migrations including `20260830234800_p2_5_admin_auth.sql`.
2. Deploy `admin-download-attachment` (and P2.3/P2.4 functions if they are not live yet).
3. Disable public sign-up. Create the first Auth user. Insert `admin_users`.
4. Confirm the Storage bucket `rfq-attachments` remains **private**.
5. Do not put the service-role key in Vite.

## 13. P2.6 production hardening

- Apply `supabase/migrations/20260831001500_p2_6_rate_limit.sql`.
- Set `ALLOWED_ORIGINS` to the real production frontend origin (never `*`). Localhost is allowed only when that secret is empty.
- Keep Email sign-up disabled.
- Keep `rfq-attachments` private.
- Keep `noindex, nofollow` until the owner approves public content.
- Release evidence: [p2-6-security-and-release-checklist.md](./p2-6-security-and-release-checklist.md).
