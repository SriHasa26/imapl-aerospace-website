import type { MouseEvent, ReactNode, SVGProps } from 'react'
import type { NavigateFn, Page } from '../App'
import { images } from '../content/assets'
import { publicCapabilityNavItems } from '../content/capabilities'
import { description, publicWorkAreas } from '../content/company'
import { companyContact, socialLinks as publishedSocialLinks } from '../content/contact'
import UnconfirmedNote from './UnconfirmedNote'
import { hrefFor, shouldSpaNavigate } from '../nav'

interface Props {
  navigate: NavigateFn
}

function publishedSocialHref(network: string): string | undefined {
  return publishedSocialLinks.find((item) => item.value.network === network)?.value.url
}

function SocialGlyph({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

const footerSocialLinks: Array<{
  name: string
  href: string | undefined
  ariaLabel: string
  icon: ReactNode
}> = [
  {
    name: 'Facebook',
    href: publishedSocialHref('Facebook'),
    ariaLabel: 'Official IMAPL Facebook',
    icon: (
      <SocialGlyph fill="currentColor">
        <path d="M14.5 8.25V6.6c0-.86.5-1.35 1.45-1.35H17.5V3h-2.55C12.4 3 11 4.45 11 6.7v1.55H8.75v2.6H11V21h3.1v-8.15h2.45l.5-2.6H14.1V8.25h.4Z" />
      </SocialGlyph>
    ),
  },
  {
    name: 'Instagram',
    href: publishedSocialHref('Instagram'),
    ariaLabel: 'Official IMAPL Instagram',
    icon: (
      <SocialGlyph fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
      </SocialGlyph>
    ),
  },
  {
    name: 'LinkedIn',
    href: publishedSocialHref('LinkedIn'),
    ariaLabel: 'Official IMAPL LinkedIn',
    icon: (
      <SocialGlyph fill="currentColor">
        <path d="M6.4 9.4H4V20h2.4V9.4ZM5.2 4A1.45 1.45 0 1 0 5.2 6.9 1.45 1.45 0 0 0 5.2 4ZM20 20h-2.45v-5.5c0-1.85-.65-3.1-2.3-3.1-1.25 0-2 .85-2.3 1.65-.1.28-.15.68-.15 1.08V20H10.4s.05-9.15 0-10.1h2.45v1.45c.35-.55 1.85-1.85 4.35-1.85 3.05 0 5.3 2 5.3 6.3V20H20Z" />
      </SocialGlyph>
    ),
  },
  {
    name: 'X',
    href: publishedSocialHref('X'),
    ariaLabel: 'Official IMAPL X',
    icon: (
      <SocialGlyph fill="currentColor">
        <path d="M17.2 3h2.95l-6.45 7.35L21.5 21h-5.7l-4.45-5.85L6.2 21H3.2l6.9-7.9L2.5 3h5.85l4.05 5.35L17.2 3Zm-1.05 16.15h1.65L7.95 4.75H6.2l9.95 14.4Z" />
      </SocialGlyph>
    ),
  },
  {
    name: 'YouTube',
    href: publishedSocialHref('YouTube'),
    ariaLabel: 'Official IMAPL YouTube',
    icon: (
      <SocialGlyph fill="currentColor">
        <path d="M21.5 7.35a2.7 2.7 0 0 0-1.9-1.92C18.05 5.05 12 5.05 12 5.05s-6.05 0-7.6.38A2.7 2.7 0 0 0 2.5 7.35 27.6 27.6 0 0 0 2.1 12a27.6 27.6 0 0 0 .4 4.65 2.7 2.7 0 0 0 1.9 1.92c1.55.38 7.6.38 7.6.38s6.05 0 7.6-.38a2.7 2.7 0 0 0 1.9-1.92A27.6 27.6 0 0 0 21.9 12a27.6 27.6 0 0 0-.4-4.65ZM10.15 15.2V8.8l6.05 3.2-6.05 3.2Z" />
      </SocialGlyph>
    ),
  },
]

function socialHref(name: string, href: string | undefined): { url: string; isPlaceholder: boolean } {
  if (!href) {
    return { url: `#placeholder-official-imapl-${name.toLowerCase()}`, isPlaceholder: true }
  }
  return { url: href, isPlaceholder: false }
}

const socialButtonClass =
  'w-8 h-8 border border-border-dark flex items-center justify-center text-steel cursor-pointer transition-all duration-200 ease-out hover:scale-[1.08] hover:text-white hover:border-steel/50 hover:opacity-90 focus-visible:outline-none focus-visible:text-orange focus-visible:border-orange'

function FooterSocialLinks({ className = '', landmark = true }: { className?: string; landmark?: boolean }) {
  const links = footerSocialLinks.map((item) => {
    const { url, isPlaceholder } = socialHref(item.name, item.href)
    return (
      <a
        key={item.name}
        href={url}
        {...(isPlaceholder
          ? {
              onClick: (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault(),
              'aria-disabled': true,
              title: `${item.name} official URL pending`,
            }
          : {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
        aria-label={isPlaceholder ? `${item.ariaLabel} (official URL pending)` : item.ariaLabel}
        className={socialButtonClass}
      >
        {item.icon}
      </a>
    )
  })

  const classes = `flex items-center gap-3 flex-wrap ${className}`.trim()

  if (landmark) {
    return (
      <nav aria-label="Official IMAPL social media" className={classes}>
        {links}
      </nav>
    )
  }

  return <div className={classes}>{links}</div>
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
                loading="lazy"
                decoding="async"
              />
            </a>
            <p className="text-steel text-sm leading-relaxed max-w-xs mb-8">
              {description.value}
            </p>
            <FooterSocialLinks />
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
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6 flex-wrap">
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
            <FooterSocialLinks className="justify-center" landmark={false} />
          </div>
        </div>
      </div>
    </footer>
  )
}
