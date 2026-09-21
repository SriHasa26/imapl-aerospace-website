import { lazy, Suspense, useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { hrefFor } from './nav'
import { parseAdminLocation, type AdminRoute } from './admin/routes'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Capabilities = lazy(() => import('./pages/Capabilities'))
const Products = lazy(() => import('./pages/Products'))
const Industries = lazy(() => import('./pages/Industries'))
const Quality = lazy(() => import('./pages/Quality'))
const Facilities = lazy(() => import('./pages/Facilities'))
const Resources = lazy(() => import('./pages/Resources'))
const Careers = lazy(() => import('./pages/Careers'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Contact = lazy(() => import('./pages/Contact'))
const RequestQuote = lazy(() => import('./pages/RequestQuote'))
const AdminBranch = lazy(() => import('./admin/AdminBranch'))

export type Page =
  | 'home'
  | 'about'
  | 'capabilities'
  | 'products'
  | 'industries'
  | 'quality'
  | 'facilities'
  | 'resources'
  | 'careers'
  | 'contact'
  | 'quote'
  | 'privacy'
  | 'terms'

export type RouteName = Page | 'not-found'

export type NavigateFn = (page: Page, hash?: string) => void

const validPages: Page[] = [
  'home',
  'about',
  'capabilities',
  'products',
  'industries',
  'quality',
  'facilities',
  'resources',
  'careers',
  'contact',
  'quote',
  'privacy',
  'terms',
]

type AppView =
  | { kind: 'admin'; route: AdminRoute }
  | { kind: 'public'; page: RouteName }

function getView(): AppView {
  const admin = parseAdminLocation(window.location.pathname)
  if (admin.kind === 'admin') return { kind: 'admin', route: admin.route }
  if (admin.kind === 'admin-not-found') return { kind: 'public', page: 'not-found' }
  return { kind: 'public', page: getPageFromUrl() }
}

function getPageFromUrl(): RouteName {
  const path = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()

  if (path === '') {
    return 'home'
  }

  if (validPages.includes(path as Page)) {
    return path as Page
  }

  return 'not-found'
}

function scrollToCurrentTarget() {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    const target = document.getElementById(hash)
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
      return
    }
  }

  window.scrollTo({
    top: 0,
    behavior: 'instant',
  })
}

export default function App() {
  const [view, setView] = useState<AppView>(getView)
  const [routeKey, setRouteKey] = useState(() => window.location.pathname + window.location.hash)

  const syncFromUrl = () => {
    setView(getView())
    setRouteKey(window.location.pathname + window.location.hash)
  }

  const navigate: NavigateFn = (page, hash) => {
    const path = hrefFor(page, hash)
    window.history.pushState({ page }, '', path)
    setView({ kind: 'public', page })
    setRouteKey(path)
  }

  useEffect(() => {
    const handlePopState = () => {
      syncFromUrl()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(scrollToCurrentTarget, 0)
    return () => window.clearTimeout(timer)
  }, [routeKey])

  const renderPage = () => {
    if (view.kind !== 'public') return null
    const currentPage = view.page
    const hash = window.location.hash

    switch (currentPage) {
      case 'home':
        return <Home navigate={navigate} />

      case 'about':
        return <About navigate={navigate} />

      case 'capabilities':
        return <Capabilities navigate={navigate} />

      case 'products':
        return <Products navigate={navigate} hash={hash} />

      case 'industries':
        return <Industries navigate={navigate} />

      case 'quality':
        return <Quality navigate={navigate} />

      case 'facilities':
        return <Facilities navigate={navigate} />

      case 'resources':
        return <Resources navigate={navigate} />

      case 'careers':
        return <Careers navigate={navigate} />

      case 'contact':
        return <Contact navigate={navigate} />

      case 'quote':
        return <RequestQuote navigate={navigate} />

      case 'privacy':
        return <Privacy navigate={navigate} />

      case 'terms':
        return <Terms navigate={navigate} />

      case 'not-found':
        return <NotFound navigate={navigate} />

      default:
        return <NotFound navigate={navigate} />
    }
  }

  if (view.kind === 'admin') {
    return (
      <div className="min-h-dvh bg-navy">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-cyan focus:text-navy focus:px-4 focus:py-2 focus:font-medium"
        >
          Skip to content
        </a>
        <Suspense fallback={<p className="text-steel text-sm p-8">Loading…</p>}>
          <AdminBranch route={view.route} />
        </Suspense>
      </div>
    )
  }

  const currentPage = view.page

  return (
    <div className="min-h-dvh bg-navy">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-cyan focus:text-navy focus:px-4 focus:py-2 focus:font-medium"
      >
        Skip to content
      </a>
      <Navigation
        currentPage={currentPage}
        navigate={navigate}
      />

      <main id="main-content">
        <Suspense fallback={<p className="text-steel text-sm p-8">Loading…</p>}>
          {renderPage()}
        </Suspense>
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}
