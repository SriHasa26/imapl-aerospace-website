# PROJECT UNDERSTANDING — Igniting Minds Aerospace

## 1. Overview

**Project Name:** Igniting Minds Aerospace (IMAPL)
**Type:** Corporate website for an aerospace engineering & manufacturing company
**Status:** Prototype — many data points are sourced from a legacy website and marked as OWNER_VERIFICATION_REQUIRED or HIGH_RISK. Not production-ready.

**Core Purpose:**
- Public-facing website showcasing the company's manufacturing capabilities, products, industries, quality, facilities, careers, and resources
- Contact form for general enquiries
- Request for Quote (RFQ) multi-step form for manufacturing requirements (with drawing upload)
- Admin dashboard (behind `/admin`) for staff to manage contact submissions and RFQ submissions

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (with StrictMode) |
| **Build Tool** | Vite 8 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| **Backend** | Supabase (PostgreSQL + Edge Functions + Auth + Storage) |
| **Package Manager** | pnpm (with npm lockfile also present) |
| **Formatting** | oxfmt |

---

## 3. Project Structure

```
.
├── index.html                    # Vite HTML shell, mounts #root
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite config: React + Tailwind + @ alias
├── tsconfig.json                 # TypeScript config
├── .env.local                    # Supabase URL & publishable key
├── .mise.toml                    # Toolchain versions (Node, pnpm)
├── AGENTS.md                     # AI agent instructions
├── supabase/
│   ├── config.toml               # Edge Function JWT config
│   ├── functions/                # Supabase Edge Functions
│   │   ├── _shared/              # Shared utilities
│   │   ├── submit-contact/       # Contact form submission
│   │   ├── submit-rfq/           # RFQ form submission
│   │   ├── complete-rfq-upload/  # Finalize drawing upload
│   │   └── admin-download-attachment/ # Staff file download
│   └── migrations/               # SQL migrations (P2.2–P2.6)
├── public/
│   └── images/                   # Static images by category
├── docs/                         # Setup & security documentation
├── scripts/                      # Validation check scripts
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Router + layout
    ├── index.css                 # Tailwind imports + theme + animations
    ├── vite-env.d.ts             # Vite type declarations
    ├── nav.ts                    # SPA navigation helpers
    ├── form.ts                   # Form validation utilities
    ├── components/
    │   ├── Navigation.tsx        # Top nav with mega-menus + mobile drawer
    │   ├── Footer.tsx            # Site-wide footer
    │   ├── LegalReviewBanner.tsx # Legal review banner
    │   └── UnconfirmedNote.tsx   # "Unverified data" notice component
    ├── pages/
    │   ├── Home.tsx              # Landing page (~900 lines)
    │   ├── About.tsx             # Company story, leadership, milestones
    │   ├── Capabilities.tsx      # Manufacturing capabilities (6 sections)
    │   ├── Products.tsx          # Product families
    │   ├── Industries.tsx        # Industries served
    │   ├── Quality.tsx           # Quality assurance & certifications
    │   ├── Facilities.tsx        # Manufacturing facilities
    │   ├── Resources.tsx         # News, case studies, downloads
    │   ├── Careers.tsx           # Job listings & culture
    │   ├── Contact.tsx           # Contact form + office details
    │   ├── RequestQuote.tsx      # 4-step RFQ form with file upload
    │   ├── Privacy.tsx           # Privacy policy
    │   ├── Terms.tsx             # Terms of service
    │   └── NotFound.tsx          # 404 page
    ├── admin/
    │   ├── AdminBranch.tsx       # Entry: wraps AdminRoot in SessionProvider
    │   ├── AdminRoot.tsx         # Admin router (login/dashboard/contact/rfq)
    │   ├── routes.ts             # URL parsing for /admin/* routes
    │   ├── session.tsx           # Supabase Auth context for admin session
    │   ├── Login.tsx             # Admin login page
    │   ├── Dashboard.tsx         # Admin dashboard (counts + recent items)
    │   ├── ContactList.tsx       # Paginated contact submission list
    │   ├── ContactDetail.tsx     # Single contact detail view
    │   ├── RfqList.tsx           # Paginated RFQ submission list
    │   ├── RfqDetail.tsx         # Single RFQ detail + attachments
    │   ├── api.ts                # Supabase query helpers for admin
    │   └── ui.tsx                # Shared admin UI components
    ├── content/
    │   ├── types.ts              # SourceMeta, VerificationStatus, MaybeConflicting
    │   ├── assets.ts             # Central image registry (all image paths)
    │   ├── company.ts            # Company identity (name, values, leadership, milestones)
    │   ├── contact.ts            # Contact details, offices, social links
    │   ├── capabilities.ts       # Capability records + page sections
    │   ├── products.ts           # Product families + specs
    │   ├── industries.ts         # Industry records
    │   ├── quality.ts            # Quality certifications, processes, metrics
    │   ├── facilities.ts         # Facility details
    │   ├── careers.ts            # Job postings
    │   ├── resources.ts          # News / articles
    │   └── legacy-inventory.ts   # Legacy site content inventory
    ├── lib/
    │   ├── supabase.ts           # Supabase client initialization (with security checks)
    │   └── submit.ts             # Contact & RFQ submission functions + file upload
    └── imports/                  # Empty directory
```

---

## 4. Routing

The app uses a **custom client-side router** — no React Router library.

### Public Routes

| URL Path | Page | Lazy? |
|---|---|---|
| `/` | Home | No |
| `/about` | About | No |
| `/capabilities` | Capabilities | No |
| `/products` | Products | No |
| `/industries` | Industries | No |
| `/quality` | Quality | No |
| `/facilities` | Facilities | No |
| `/resources` | Resources | No |
| `/careers` | Careers | No |
| `/contact` | Contact | Yes |
| `/quote` | RequestQuote | Yes |
| `/privacy` | Privacy | No |
| `/terms` | Terms | No |
| `/*` | NotFound | No |

### Admin Routes

| URL Path | Section |
|---|---|
| `/admin` | Dashboard |
| `/admin/login` | Login |
| `/admin/contact` | Contact list |
| `/admin/contact/:uuid` | Contact detail |
| `/admin/rfq` | RFQ list |
| `/admin/rfq/:uuid` | RFQ detail |

**Routing mechanism:**
- `App.tsx` reads `window.location.pathname` and maps it to a page
- `navigate()` uses `history.pushState()` for SPA transitions
- `popstate` event listener handles browser back/forward
- Hash fragments are used for scroll-to-section within pages
- Pages receive a `navigate` prop for internal linking

---

## 5. Design System

### Color Palette (defined in `index.css` via Tailwind v4 `@theme`)

| Token | Value | Usage |
|---|---|---|
| `navy` | `#070D1C` | Primary background |
| `navy-mid` | `#0D1629` | Card/section backgrounds |
| `navy-light` | `#101D35` | Hover states |
| `blue` | `#003580` | CTA buttons, accents |
| `blue-light` | `#0050B3` | Button hover |
| `cyan` | `#00B4D8` | Highlights, links, accents |
| `steel` | `#8A9BB5` | Secondary text |
| `off` | `#F2F4F8` | Light section backgrounds |
| `border-dark` | `#1A2440` | Dark borders/dividers |
| `border-light` | `#D4DAE8` | Light borders |

### Typography

| Token | Font |
|---|---|
| `font-display` | Barlow Condensed (headings, hero text) |
| `font-sans` | Inter (body text) |
| `font-mono` | JetBrains Mono (labels, technical text) |

### UI Patterns
- **Blueprint grid overlay** — cyan-tinted CSS grid lines for aerospace aesthetic
- **Corner brackets** — decorative border elements on hero cards
- **Scroll reveal** — IntersectionObserver-driven fade-up animations
- **HUD decorations** — monospace text overlays with company data
- **Mega-menus** — dropdown panels for Capabilities and Products in the nav
- **Mobile drawer** — full-width mobile navigation with sub-menus

---

## 6. Content Architecture (src/content/)

### Verification System

Every piece of content has metadata tracking its source and verification status:

```typescript
type VerificationStatus =
  | "VERIFIED"
  | "SOURCE_SUPPORTED"
  | "OWNER_VERIFICATION_REQUIRED"
  | "CONFLICTING"
  | "HIGH_RISK"
  | "LEGACY"
  | "PROTOTYPE"
  | "MISSING"
```

**Key rules:**
- Only `VERIFIED` and `SOURCE_SUPPORTED` content is published on public pages
- `CONFLICTING` fields keep both source values (e.g., founding year: 2017 vs 2018)
- `HIGH_RISK` and `PROTOTYPE` content is retained in the data model but NOT rendered publicly
- `isPublishable()` function filters content for display

### Conflicting Data

Several company facts have unresolved conflicts between the legacy website (imapl.co.in) and prototype content:

| Field | Legacy Value | Prototype Value | Status |
|---|---|---|---|
| Founding Year | 2017 | 2018 | CONFLICTING |
| Staff Count | 120+ | 500+ | CONFLICTING |
| Years of Experience | 9+ | 6 | CONFLICTING |
| Headquarters | Bengaluru offices | Hyderabad TSIIC campus | CONFLICTING |
| Values | 5 values (Integrity, etc.) | 5 different values | CONFLICTING |
| Leadership | 3 real people | 6 fictional names | CONFLICTING |

### Content Files

| File | Contents |
|---|---|
| `types.ts` | SourceMeta, VerificationStatus, isPublishable(), legacy site URLs |
| `assets.ts` | Central image path registry (~30 images) |
| `company.ts` | Official name, short name, founding year, description, values, mission, vision, leadership, milestones, hero stats |
| `contact.ts` | Phone, email, website, hours, 3 office addresses, social links |
| `capabilities.ts` | 14 capability records (CNC machining, tooling, inspection, etc.) + 6 page sections + prototype-only sections |
| `products.ts` | Product families (precision components, aero engine tooling, etc.) |
| `industries.ts` | Industry records (commercial aviation, defense, space, etc.) |
| `quality.ts` | Certification cards, inspection processes, quality metrics |
| `facilities.ts` | Facility area and details |
| `careers.ts` | Job postings |
| `resources.ts` | News articles and resources |

---

## 7. Forms & Data Flow

### Contact Form (`/contact`)

**Fields:** Name, Company, Email, Phone (optional), Subject (dropdown), Message, Consent checkbox

**Flow:**
1. Client-side validation via `src/form.ts` utilities
2. Calls `submitContact()` → Supabase Edge Function `submit-contact`
3. Edge Function inserts into `contact_submissions` table + optional email notification
4. Success shows confirmation; notification failure is non-blocking

### Request for Quote (`/quote`)

**4-Step Wizard:**
1. **Contact Details** — Name, Title, Company, Country, Email, Phone
2. **Program Requirements** — Industry, Program, Platform, Delivery Date, Quantity, Export Control, Notes
3. **Part Information** — Part Number, Part Name, Material, Process, Tolerance, Finish, Quantity, Drawing upload
4. **Review & Prepare** — Summary + Consent

**File Upload Flow:**
1. Form submission calls `submitRfq()` → Edge Function `submit-rfq`
2. Edge Function returns a signed upload URL (`SignedUpload`)
3. Browser uploads file directly to Supabase Storage via `uploadToSignedPath()`
4. Calls `completeRfqUpload()` → Edge Function `complete-rfq-upload` finalizes the record

**Accepted File Types:** `.pdf`, `.step`, `.stp`, `.dxf`, `.iges`, `.igs` (max 50 MB)

---

## 8. Backend (Supabase)

### Edge Functions

| Function | Auth Required | Purpose |
|---|---|---|
| `submit-contact` | No (publishable key) | Insert contact enquiry, optional email notification |
| `submit-rfq` | No (publishable key) | Insert RFQ, return signed upload URL for drawing |
| `complete-rfq-upload` | No (publishable key) | Confirm upload completed, update RFQ record |
| `admin-download-attachment` | Yes (Auth JWT) | Generate 60-second signed download URL for admin |

### Database Tables

```
admin_users           → Staff membership (role = 'ADMIN')
contact_submissions   → Contact form data + workflow status
rfq_submissions       → RFQ form data + workflow status
rfq_attachments       → Drawing file metadata (actual files in Storage)
submission_rate_events → Rate limiting (SHA-256 client keys)
```

### Status Workflows

**Contact:** `NEW` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`
**RFQ:** `NEW` → `REVIEWING` → `QUOTING` → `COMPLETED` → `CLOSED`

### Security Model
- **RLS enabled** on all tables
- Anonymous users have NO table access (writes go through Edge Functions + service_role)
- Authenticated non-admin users can only SELECT their own `admin_users` row (empty if not admin)
- Admin users can SELECT submissions and UPDATE status only
- `admin_users` rows are inserted manually (no self-registration)
- Publishable browser key is validated to reject service_role keys at startup

---

## 9. Admin Dashboard (`/admin`)

### Authentication
- Supabase Auth (email + password)
- Session persisted in browser (Supabase client `persistSession: true`)
- After sign-in, checks `admin_users` table for `role = 'ADMIN'`
- Non-admin users are signed out immediately

### Pages

**Dashboard (`/admin`):**
- New contact count, open RFQ count, reviewing RFQ count
- 5 most recent contacts and 5 most recent RFQs

**Contact List (`/admin/contact`):**
- Paginated (25 per page)
- Filter by status, search by name/company/email/subject
- Click to view detail

**Contact Detail (`/admin/contact/:id`):**
- Full submission details
- Status dropdown to update workflow state

**RFQ List (`/admin/rfq`):**
- Paginated (25 per page)
- Filter by status, search by name/company/email/part name/program
- Shows attachment count

**RFQ Detail (`/admin/rfq/:id`):**
- Full 4-step submission details
- Attachment list with download buttons (60-second signed URLs)
- Status dropdown to update workflow state

---

## 10. Image Assets

All images are in `public/images/` organized by category:

| Directory | Contents |
|---|---|
| `brand/` | Logo (`imapl-logo.png`), favicon |
| `capabilities/` | Manufacturing, machining, CNC machine images |
| `careers/` | Careers page hero image |
| `facilities/` | Facility photos (3 images) |
| `general/` | Workshop image |
| `industries/` | Industry page images |
| `products/` | Product photos (8+ images) |
| `quality/` | Quality inspection images |

Central registry in `src/content/assets.ts` — never hardcode image paths in components.

---

## 11. Key Scripts

```bash
npm run dev          # Vite dev server (host 0.0.0.0)
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run format       # Format with oxfmt
npm run test:validation  # Run P2.3 + P2.6 validation scripts
```

---

## 12. Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` | Supabase project API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env.local` | Supabase browser-safe publishable key |

**Security:** The app validates at startup that the key is NOT a `sb_secret_` or `service_role` key.

---

## 13. Known Limitations / Prototype Status

- **No real images yet** — using placeholder company photographs
- **Conflicting company data** — founding year, staff count, leadership all unverified
- **Prototype-only content** — mission, vision, milestones, hero stats are fictional
- **No social media links active** — placeholder LI/TW/YT badges in footer
- **No cookie banner** — site is `noindex, nofollow`
- **No sitemap** — deferred until production
- **Legacy contact details** — phone, email, offices sourced from imapl.co.in, marked OWNER_VERIFICATION_REQUIRED
- **Admin AOG number** — hardcoded in Contact.tsx, not from verified source
- **No real job listings** — Careers page uses template content
- **Maps not embedded** — placeholder text "Map link not yet available"

---

## 14. Development Notes

- **No React Router** — custom SPA router via `history.pushState`
- **No state management library** — React useState/useContext only
- **No CSS-in-JS** — pure Tailwind utility classes + minimal global CSS
- **Content is code** — all text/data lives in `src/content/`, not a CMS
- **Accessibility** — skip-to-content link, aria-labels on nav, form error announcements via `role="alert"`, focus-visible styles
- **No comments in code** — project convention is self-documenting code with descriptive variable names

---

## 15. How to Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# → Runs on http://localhost:5173 (or next available port)

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The Vite dev server is already configured with host `0.0.0.0` for network access.
