import type { MouseEvent } from 'react'
import type { NavigateFn, Page } from '../App'
import { images } from '../content/assets'
import { publicCapabilityNavItems } from '../content/capabilities'
import { description } from '../content/company'
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

const socialLinks: { title: string; href: string; icon: string }[] = [
  {
    title: 'Facebook',
    href: 'https://www.facebook.com/people/Igniting-Minds-Aerospace-Private-Limited/100064074880086/',
    icon: 'M13.5 9H15.5V6H13.5C11.57 6 10 7.57 10 9.5V11H8V14H10V20H13V14H15L15.5 11H13V9.5C13 9.22 13.22 9 13.5 9Z',
  },
  {
    title: 'Instagram',
    icon: 'M12 8.3A3.7 3.7 0 1 0 12 15.7A3.7 3.7 0 1 0 12 8.3ZM12 13.7A1.7 1.7 0 1 1 12 10.3A1.7 1.7 0 1 1 12 13.7ZM16 4H8A4 4 0 0 0 4 8V16A4 4 0 0 0 8 20H16A4 4 0 0 0 20 16V8A4 4 0 0 0 16 4ZM18 16A2 2 0 0 1 16 18H8A2 2 0 0 1 6 16V8A2 2 0 0 1 8 6H16A2 2 0 0 1 18 8V16ZM16.5 7.5A1 1 0 1 0 16.5 9.5A1 1 0 1 0 16.5 7.5Z',
    href: 'https://www.instagram.com/ignitingmindsaerospace',
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ignitingmindsaerospaceprivatelimited/',
    icon: 'M6.94 8.5H4.56V19H6.94V8.5ZM5.75 7.1c.83 0 1.5-.68 1.5-1.5S6.58 4.1 5.75 4.1a1.5 1.5 0 0 0 0 3ZM19.5 19h-2.38v-5.34c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V19H10.9V8.5h2.28v1.43h.03c.32-.6 1.1-1.24 2.27-1.24 2.43 0 2.88 1.6 2.88 3.68V19Z',
  },
  {
    title: 'X (Twitter)',
    href: 'https://www.x.com/AerospaceM80368',
    icon: 'M13.62 10.7 19.9 4h-1.49l-5.45 5.82L8.6 4H4l6.58 9.32L4 20.4h1.49l5.75-6.14 4.6 6.14H20l-6.38-9.7Zm-2.04 2.17-.67-.93L6.1 5.1h2.28l4.26 5.9.67.94 5.54 7.67h-2.28l-4.99-6.74Z',
  },
  {
    title: 'YouTube',
    href: 'https://www.youtube.com/@ignitingmindsaerospace',
    icon: 'M21.6 8.2a3.02 3.02 0 0 0-2.12-2.14C17.68 5.6 12 5.6 12 5.6s-5.68 0-7.48.46A3.02 3.02 0 0 0 2.4 8.2 31.6 31.6 0 0 0 1.95 12a31.6 31.6 0 0 0 .45 3.8 3.02 3.02 0 0 0 2.12 2.14c1.8.46 7.48.46 7.48.46s5.68 0 7.48-.46a3.02 3.02 0 0 0 2.12-2.14c.3-1.26.45-2.53.45-3.8a31.6 31.6 0 0 0-.45-3.8ZM9.95 14.75V9.25L14.9 12l-4.95 2.75Z',
  },
]

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

        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          <div>
            <a href={hrefFor('home')} onClick={go('home')} className={`flex items-center mb-7 ${linkFocus}`}>
              <img
                src={images.brandLogo}
                alt={images.brandLogoAlt}
                className="h-20 lg:h-24 w-auto max-w-[280px] object-contain object-left"
              />
            </a>
            <p className="text-steel text-sm leading-relaxed max-w-xs mb-8">
              {description.value}
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(s => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.title}
                  title={s.title}
                  className={`btn-chamfer w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-white/90 hover:bg-orange hover:border-orange hover:text-white transition-colors ${linkFocus}`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
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

          <div className="lg:pl-6">
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
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-steel uppercase tracking-[0.22em] mb-5">Get In Touch</div>
            <div className="space-y-5 text-sm">
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
              className="btn-chamfer mt-6 w-full border border-orange/60 text-orange font-mono text-xs uppercase tracking-widest py-3.5 hover:bg-orange/10 hover:border-orange transition-colors block text-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
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
