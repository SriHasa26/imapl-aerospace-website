import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { NavigateFn, Page, RouteName } from '../App'
import { images } from '../content/assets'
import { publicCapabilityNavItems } from '../content/capabilities'
import { publicProductNavItems } from '../content/products'
import { hrefFor, shouldSpaNavigate } from '../nav'

interface Props {
  currentPage: RouteName
  navigate: NavigateFn
}

const capabilityItems = publicCapabilityNavItems()

const productItems = publicProductNavItems()

const productLineGridClass =
  productItems.length === 3
    ? 'grid grid-cols-3'
    : productItems.length <= 1
      ? 'grid grid-cols-1'
      : 'grid grid-cols-2'

const mobileLinks: [string, Page][] = [
  ['About', 'about'],
  ['Industries', 'industries'],
  ['Quality', 'quality'],
  ['Facilities', 'facilities'],
  ['Resources', 'resources'],
  ['Careers', 'careers'],
  ['Contact', 'contact'],
]

const linkFocus = 'focus-visible:outline-none focus-visible:text-orange'

export default function Navigation({ currentPage, navigate }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [megaMenu, setMegaMenu] = useState<null | 'capabilities' | 'products'>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<null | 'capabilities' | 'products'>(null)

  const go = (page: Page, hash?: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page, hash)
    setMegaMenu(null)
    setMobileOpen(false)
    setMobileSub(null)
  }

  useEffect(() => {
    const handler = () => {
      const next = window.scrollY > 32
      setScrolled((prev) => (prev === next ? prev : next))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMegaMenu(null)
      setMobileOpen(false)
      setMobileSub(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!megaMenu) return
    const onPointerDown = (event: PointerEvent) => {
      const root = document.getElementById(`mega-${megaMenu}`)
      if (root && !root.contains(event.target as Node)) {
        setMegaMenu(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [megaMenu])

  useEffect(() => {
    setMobileOpen(false)
    setMegaMenu(null)
    setMobileSub(null)
  }, [currentPage])

  const link = (label: string, page: Page) => (
    <a
      key={page}
      href={hrefFor(page)}
      onClick={go(page)}
      aria-current={currentPage === page ? 'page' : undefined}
      className={`text-sm font-medium tracking-wide transition-colors duration-150 whitespace-nowrap ${linkFocus} ${
        currentPage === page ? 'text-orange' : 'text-steel hover:text-white'
      }`}
    >
      {label}
    </a>
  )

  const openMega = (menu: 'capabilities' | 'products') => {
    setMegaMenu(menu)
  }

  const onMegaKeyDown = (menu: 'capabilities' | 'products') => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setMegaMenu(menu)
    }
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-dark shadow-lg shadow-black/20'
            : 'max-lg:glass-dark lg:bg-gradient-to-b lg:from-navy/50 lg:via-navy/18 lg:to-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            <a
              href={hrefFor('home')}
              onClick={go('home')}
              className={`flex items-center shrink-0 ${linkFocus}`}
            >
              <img
                src={images.brandLogo}
                alt={images.brandLogoAlt}
                className="h-8 lg:h-10 w-auto max-w-[168px] object-contain object-left"
              />
            </a>

            <div className="hidden lg:flex items-center gap-7">
              {link('About', 'about')}

              <div
                id="mega-capabilities"
                className="relative"
                onMouseEnter={() => openMega('capabilities')}
                onMouseLeave={() => setMegaMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setMegaMenu(null)
                  }
                }}
              >
                <div className="flex items-center gap-1.5">
                  <a
                    href={hrefFor('capabilities')}
                    onClick={go('capabilities')}
                    onKeyDown={onMegaKeyDown('capabilities')}
                    aria-current={currentPage === 'capabilities' ? 'page' : undefined}
                    className={`text-sm font-medium tracking-wide transition-colors duration-150 ${linkFocus} ${
                      currentPage === 'capabilities' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    Capabilities
                  </a>
                  <button
                    type="button"
                    aria-expanded={megaMenu === 'capabilities'}
                    aria-controls="capabilities-menu"
                    aria-label="Capabilities submenu"
                    onClick={() => setMegaMenu((current) => current === 'capabilities' ? null : 'capabilities')}
                    onKeyDown={onMegaKeyDown('capabilities')}
                    className={`transition-colors duration-150 ${linkFocus} ${
                      currentPage === 'capabilities' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 transition-transform duration-200 ${megaMenu === 'capabilities' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>
                </div>

                {megaMenu === 'capabilities' && (
                  <div id="capabilities-menu" className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] pt-3">
                    <div className="im-card shadow-2xl shadow-black/40">
                      <div className="p-5">
                        <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-4 pb-3 border-b border-border-dark">
                          Manufacturing Capabilities
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-border-dark">
                          {capabilityItems.map(item => (
                            <a
                              key={item.label}
                              href={hrefFor('capabilities', item.hash)}
                              onClick={go('capabilities', item.hash)}
                              className={`bg-card text-left p-3.5 hover:bg-card-hover transition-colors group ${linkFocus}`}
                            >
                              <div className="text-sm font-medium text-white group-hover:text-orange group-focus-visible:text-orange transition-colors leading-tight">
                                {item.label}
                              </div>
                              <div className="font-mono text-xs text-steel mt-1">{item.sub}</div>
                            </a>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-border-dark">
                          <a
                            href={hrefFor('capabilities')}
                            onClick={go('capabilities')}
                            className={`font-mono text-xs text-orange hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 ${linkFocus}`}
                          >
                            View All Capabilities
                            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                id="mega-products"
                className="relative"
                onMouseEnter={() => openMega('products')}
                onMouseLeave={() => setMegaMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setMegaMenu(null)
                  }
                }}
              >
                <div className="flex items-center gap-1.5">
                  <a
                    href={hrefFor('products')}
                    onClick={go('products')}
                    onKeyDown={onMegaKeyDown('products')}
                    aria-current={currentPage === 'products' ? 'page' : undefined}
                    className={`text-sm font-medium tracking-wide transition-colors duration-150 ${linkFocus} ${
                      currentPage === 'products' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    Products
                  </a>
                  <button
                    type="button"
                    aria-expanded={megaMenu === 'products'}
                    aria-controls="products-menu"
                    aria-label="Products submenu"
                    onClick={() => setMegaMenu((current) => current === 'products' ? null : 'products')}
                    onKeyDown={onMegaKeyDown('products')}
                    className={`transition-colors duration-150 ${linkFocus} ${
                      currentPage === 'products' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 transition-transform duration-200 ${megaMenu === 'products' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>
                </div>

                {megaMenu === 'products' && (
                  <div
                    id="products-menu"
                    className={`absolute top-full left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] pt-3 ${
                      productItems.length === 3 ? 'w-[640px]' : 'w-[520px]'
                    }`}
                  >
                    <div className="im-card shadow-2xl shadow-black/40">
                      <div className="p-5">
                        <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-4 pb-3 border-b border-border-dark">
                          Product Lines
                        </div>
                        <div className={`${productLineGridClass} gap-2`}>
                          {productItems.map(item => (
                            <a
                              key={item.label}
                              href={hrefFor('products', item.hash)}
                              onClick={go('products', item.hash)}
                              className={`flex h-full min-h-[6.25rem] flex-col border border-border-dark bg-card p-3.5 text-left transition-colors duration-150 hover:bg-card-hover group ${linkFocus}`}
                            >
                              <div className="text-sm font-medium text-white leading-tight group-hover:text-orange group-focus-visible:text-orange transition-colors">
                                {item.label}
                              </div>
                              <div className="mt-1.5 font-mono text-xs leading-relaxed text-steel">
                                {item.sub}
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-border-dark">
                          <a
                            href={hrefFor('products')}
                            onClick={go('products')}
                            className={`font-mono text-xs text-orange hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 ${linkFocus}`}
                          >
                            View All Products
                            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {link('Industries', 'industries')}
              {link('Quality', 'quality')}
              {link('Facilities', 'facilities')}
              {link('Resources', 'resources')}
              {link('Careers', 'careers')}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={hrefFor('contact')}
                onClick={go('contact')}
                aria-current={currentPage === 'contact' ? 'page' : undefined}
                className={`hidden lg:block text-sm tracking-wide transition-colors ${linkFocus} ${
                  currentPage === 'contact' ? 'text-orange' : 'text-steel hover:text-white'
                }`}
              >
                Contact
              </a>
              <a
                href={hrefFor('quote')}
                onClick={go('quote')}
                aria-current={currentPage === 'quote' ? 'page' : undefined}
                className={`hidden lg:flex items-center gap-2 text-white text-[13px] font-medium px-5 py-2.5 transition-colors duration-150 tracking-wide focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                  currentPage === 'quote' ? 'bg-orange-light' : 'bg-orange hover:bg-orange-light'
                }`}
              >
                Request a Quote
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>

              <button
                type="button"
                className="lg:hidden text-orange p-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
                onClick={() => setMobileOpen(o => !o)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="lg:hidden bg-navy-mid border-t border-white/10">
            <div className="px-6 py-4">
              <a
                href={hrefFor('about')}
                onClick={go('about')}
                aria-current={currentPage === 'about' ? 'page' : undefined}
                className={`flex w-full items-center justify-between py-3.5 text-sm transition-colors border-b border-border-dark ${linkFocus} ${
                  currentPage === 'about' ? 'text-orange' : 'text-steel hover:text-white'
                }`}
              >
                About
              </a>

              <div className="border-b border-border-dark">
                <div className="flex items-center">
                  <a
                    href={hrefFor('capabilities')}
                    onClick={go('capabilities')}
                    aria-current={currentPage === 'capabilities' ? 'page' : undefined}
                    className={`flex-1 py-3.5 text-sm transition-colors ${linkFocus} ${
                      currentPage === 'capabilities' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    Capabilities
                  </a>
                  <button
                    type="button"
                    aria-expanded={mobileSub === 'capabilities'}
                    aria-controls="mobile-capabilities-sub"
                    aria-label="Capabilities submenu"
                    onClick={() => setMobileSub((current) => current === 'capabilities' ? null : 'capabilities')}
                    className="p-2 text-steel hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
                  >
                    <svg viewBox="0 0 16 16" className={`w-3 h-3 transition-transform ${mobileSub === 'capabilities' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 8h6M8 5l3 3-3 3" />
                    </svg>
                  </button>
                </div>
                {mobileSub === 'capabilities' && (
                  <div id="mobile-capabilities-sub" className="pb-3">
                    {capabilityItems.map(item => (
                      <a
                        key={item.label}
                        href={hrefFor('capabilities', item.hash)}
                        onClick={go('capabilities', item.hash)}
                        className={`block py-2 pl-4 text-sm text-steel hover:text-white ${linkFocus}`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-border-dark">
                <div className="flex items-center">
                  <a
                    href={hrefFor('products')}
                    onClick={go('products')}
                    aria-current={currentPage === 'products' ? 'page' : undefined}
                    className={`flex-1 py-3.5 text-sm transition-colors ${linkFocus} ${
                      currentPage === 'products' ? 'text-orange' : 'text-steel hover:text-white'
                    }`}
                  >
                    Products
                  </a>
                  <button
                    type="button"
                    aria-expanded={mobileSub === 'products'}
                    aria-controls="mobile-products-sub"
                    aria-label="Products submenu"
                    onClick={() => setMobileSub((current) => current === 'products' ? null : 'products')}
                    className="p-2 text-steel hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
                  >
                    <svg viewBox="0 0 16 16" className={`w-3 h-3 transition-transform ${mobileSub === 'products' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 8h6M8 5l3 3-3 3" />
                    </svg>
                  </button>
                </div>
                {mobileSub === 'products' && (
                  <div id="mobile-products-sub" className="pb-3">
                    {productItems.map(item => (
                      <a
                        key={item.label}
                        href={hrefFor('products', item.hash)}
                        onClick={go('products', item.hash)}
                        className={`block py-2 pl-4 text-sm text-steel hover:text-white ${linkFocus}`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {mobileLinks.filter(([label]) => label !== 'About').map(([label, page]) => (
                <a
                  key={page}
                  href={hrefFor(page)}
                  onClick={go(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`flex w-full items-center justify-between py-3.5 text-sm transition-colors border-b border-border-dark last:border-0 ${linkFocus} ${
                    currentPage === page ? 'text-orange' : 'text-steel hover:text-white'
                  }`}
                >
                  {label}
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 8h6M8 5l3 3-3 3" />
                  </svg>
                </a>
              ))}
              <a
                href={hrefFor('quote')}
                onClick={go('quote')}
                aria-current={currentPage === 'quote' ? 'page' : undefined}
                className={`mt-5 w-full bg-orange text-white text-sm font-medium py-3.5 tracking-wide text-center block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                  currentPage === 'quote' ? 'bg-orange-light' : 'hover:bg-orange-light'
                }`}
              >
                Request a Quote
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
