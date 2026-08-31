const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type AdminSection = 'login' | 'dashboard' | 'contact' | 'rfq'

export type AdminRoute = {
  section: AdminSection
  id?: string
}

export type ParsedAdmin =
  | { kind: 'admin'; route: AdminRoute }
  | { kind: 'admin-not-found' }
  | { kind: 'public' }

export function parseAdminLocation(pathname: string): ParsedAdmin {
  const parts = pathname.replace(/^\/+|\/+$/g, '').toLowerCase().split('/').filter(Boolean)
  if (parts[0] !== 'admin') return { kind: 'public' }
  if (parts.length === 1) return { kind: 'admin', route: { section: 'dashboard' } }
  if (parts[1] === 'login' && parts.length === 2) return { kind: 'admin', route: { section: 'login' } }
  if (parts[1] === 'contact' && parts.length === 2) return { kind: 'admin', route: { section: 'contact' } }
  if (parts[1] === 'contact' && parts.length === 3 && UUID_RE.test(parts[2])) {
    return { kind: 'admin', route: { section: 'contact', id: parts[2] } }
  }
  if (parts[1] === 'rfq' && parts.length === 2) return { kind: 'admin', route: { section: 'rfq' } }
  if (parts[1] === 'rfq' && parts.length === 3 && UUID_RE.test(parts[2])) {
    return { kind: 'admin', route: { section: 'rfq', id: parts[2] } }
  }
  return { kind: 'admin-not-found' }
}

export function adminHref(section: AdminSection, id?: string) {
  if (section === 'dashboard') return '/admin'
  if (section === 'login') return '/admin/login'
  if (id) return `/admin/${section}/${id}`
  return `/admin/${section}`
}

export function goAdmin(href: string, replace = false) {
  if (replace) window.history.replaceState({}, '', href)
  else window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
