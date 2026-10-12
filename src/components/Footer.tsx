import type { MouseEvent } from 'react'
import type { NavigateFn, Page } from '../App'
import { images } from '../content/assets'
import { publicCapabilityNavItems } from '../content/capabilities'
import { description, publicWorkAreas } from '../content/company'
import { companyContact } from '../content/contact'
import UnconfirmedNote from './UnconfirmedNote'
import { hrefFor, shouldSpaNavigate } from '../nav'

interface Props {
  navigate: NavigateFn
}

const companyLinks: { l: string; p: Page; hash?: string }[] = [
  { l: 'About Us', p: 'about' },
  { l: 'Leadership', p: 'about', hash: '#leadership' },
  { l: 'Our Facilities', p: 'facilities' },
  { l: 'Quality Assurance', p: 'quality' },
  { l: 'Careers', p: 'careers' },
  { l: 'News & Media', p: 'resources' },
]

const capabilityLinks = publicCapabilityNavItems()

const linkFocus = 'focus-visible:outline-none focus-visible:text-orange'

export default function Footer({ navigate }: Props) {
  const go = (page: Page, hash?: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page, hash)
  }

  return (
    <footer className="bg-navy-mid border-t border-border-dark">
      <div className="max-w-[1440px] mx-auto px-6 xl:px-12">

        <div className="py-10 border-b border-border-dark flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-8">
            <span className="font-mono text-xs text-steel uppercase tracking-widest">Work Areas</span>
            {publicWorkAreas.slice(0, 4).map(area => (
              <span key={area} className="font-mono text-xs text-orange border border-orange/30 px-3 py-1.5 tracking-wider">
                {area}
              </span>
            ))}
          </div>
          <a
            href={hrefFor('quote')}
            onClick={go('quote')}
            className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-8 py-3 flex items-center gap-2 transition-colors shrink-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            Request a Quote
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>

        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          <div className="sm:col-span-2 lg:col-span-2">
            <a href={hrefFor('home')} onClick={go('home')} className={`flex items-center mb-6 ${linkFocus}`}>
              <img
                src={images.brandLogo}
                alt={images.brandLogoAlt}
                className="h-10 w-auto max-w-[180px] object-contain object-left"
              />
            </a>
            <p className="text-steel text-sm leading-relaxed max-w-xs mb-8">
              {description.value}
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: 'LI', title: 'LinkedIn' },
                { label: 'TW', title: 'Twitter' },
                { label: 'YT', title: 'YouTube' },
              ].map(s => (
                <span
                  key={s.label}
                  title={`${s.title} URL is not available yet`}
                  aria-disabled="true"
                  className="w-8 h-8 border border-border-dark flex items-center justify-center font-mono text-xs text-steel"
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-5">Company</div>
            <ul className="space-y-3">
              {companyLinks.map(item => (
                <li key={item.l}>
                  <a
                    href={hrefFor(item.p, item.hash)}
                    onClick={go(item.p, item.hash)}
                    className={`text-sm text-steel hover:text-white transition-colors ${linkFocus}`}
                  >
                    {item.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-5">Capabilities</div>
            <ul className="space-y-3">
              {capabilityLinks.map(item => (
                <li key={item.hash}>
                  <a
                    href={hrefFor('capabilities', item.hash)}
                    onClick={go('capabilities', item.hash)}
                    className={`text-sm text-steel hover:text-white transition-colors ${linkFocus}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-5">Contact</div>
            <div className="space-y-5 text-sm">
              <UnconfirmedNote title="Legacy contact details" />
              <div>
                <div className="font-mono text-xs text-steel uppercase tracking-wider mb-1">{companyContact.offices[0].label}</div>
                <p className="text-steel leading-relaxed">
                  {companyContact.offices[0].lines.map((line) => (
                    <span key={line}>{line}<br /></span>
                  ))}
                </p>
              </div>
              <div>
                <div className="font-mono text-xs text-steel uppercase tracking-wider mb-1">Email</div>
                <a href={companyContact.emailHref} className={`text-orange ${linkFocus}`}>
                  {companyContact.email}
                </a>
              </div>
              <div>
                <div className="font-mono text-xs text-steel uppercase tracking-wider mb-1">Phone</div>
                <a href={companyContact.phoneHref} className={`text-steel hover:text-white ${linkFocus}`}>
                  {companyContact.phone}
                </a>
              </div>
            </div>
            <a
              href={hrefFor('contact')}
              onClick={go('contact')}
              className="mt-6 w-full border border-orange/60 text-orange font-mono text-xs uppercase tracking-widest py-3 hover:bg-orange/10 transition-colors block text-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div className="border-t border-border-dark py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-steel tracking-wider">
            © 2024 IGNITING MINDS AEROSPACE PVT. LTD. — ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <a
              href={hrefFor('privacy')}
              onClick={go('privacy')}
              className={`font-mono text-xs text-steel hover:text-white transition-colors tracking-wider ${linkFocus}`}
            >
              Privacy
            </a>
            <a
              href={hrefFor('terms')}
              onClick={go('terms')}
              className={`font-mono text-xs text-steel hover:text-white transition-colors tracking-wider ${linkFocus}`}
            >
              Terms
            </a>
            <span
              title="Not published. This site does not currently set first-party cookies."
              className="font-mono text-xs text-steel/80 tracking-wider"
            >
              Cookies
            </span>
            <span
              title="Not published. A production sitemap is deferred while the site remains noindex."
              className="font-mono text-xs text-steel/80 tracking-wider"
            >
              Sitemap
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
