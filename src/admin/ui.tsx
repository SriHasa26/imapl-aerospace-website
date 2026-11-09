import type { MouseEvent, ReactNode } from 'react'
import { images } from '../content/assets'
import ThemeToggle from '../components/ThemeToggle'
import { fieldClass, labelClass } from '../form'
import { shouldSpaNavigate } from '../nav'
import { adminHref, goAdmin, type AdminRoute } from './routes'
import { useAdminSession } from './session'

export function AdminLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    goAdmin(href)
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

export function formatWhen(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export function display(value: string | null | undefined) {
  const text = value?.trim()
  return text ? text : '—'
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-widest text-cyan border border-cyan/30 px-2 py-1">
      {value.replace('_', ' ')}
    </span>
  )
}

export function AdminShell({
  route,
  children,
}: {
  route: AdminRoute
  children: ReactNode
}) {
  const { email, signOut } = useAdminSession()

  const item = (section: AdminRoute['section'], label: string, href: string) => {
    const active = route.section === section
    return (
      <AdminLink
        href={href}
        className={`font-mono text-[10px] uppercase tracking-widest min-h-10 flex items-center px-3 ${active ? 'text-cyan' : 'text-steel hover:text-white'} focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan`}
      >
        {label}
      </AdminLink>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-white">
      <header className="border-b border-border-dark bg-canvas-mid">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-12 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
          <AdminLink href={adminHref('dashboard')} className="flex items-center gap-3 shrink-0">
            <img src={images.brandLogo} alt={images.brandLogoAlt} className="h-8 w-auto" />
            <span className="font-mono text-[9px] text-cyan uppercase tracking-widest">Internal</span>
          </AdminLink>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Administration">
            {item('dashboard', 'Dashboard', adminHref('dashboard'))}
            {item('contact', 'Contact', adminHref('contact'))}
            {item('rfq', 'RFQ', adminHref('rfq'))}
          </nav>
          <div className="lg:ml-auto flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-steel break-all">{email}</span>
            <button
              type="button"
              onClick={() => {
                void signOut().then(() => goAdmin(adminHref('login'), true))
              }}
              className="border border-border-dark text-steel hover:text-white font-mono text-[10px] uppercase tracking-widest px-4 min-h-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-12 py-8 sm:py-12">
        {children}
      </main>
    </div>
  )
}

export function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[8px] text-steel/70 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm text-white break-words whitespace-pre-wrap">{children}</div>
    </div>
  )
}

export { fieldClass, labelClass }

export function AdminPager({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number
  total: number
  pageSize: number
  onPage: (next: number) => void
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onPage(page - 1)}
        className="border border-border-dark text-steel disabled:opacity-40 hover:text-white font-mono text-[10px] uppercase tracking-widest px-4 min-h-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
      >
        Previous
      </button>
      <p className="font-mono text-[10px] text-steel uppercase tracking-widest">
        Page {page + 1} of {pages}
      </p>
      <button
        type="button"
        disabled={page + 1 >= pages}
        onClick={() => onPage(page + 1)}
        className="border border-border-dark text-steel disabled:opacity-40 hover:text-white font-mono text-[10px] uppercase tracking-widest px-4 min-h-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
      >
        Next
      </button>
    </div>
  )
}
