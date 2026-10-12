import type { MouseEvent } from 'react'
import type { NavigateFn, Page } from '../App'
import { hrefFor, shouldSpaNavigate } from '../nav'
import LegalReviewBanner from '../components/LegalReviewBanner'
import UnconfirmedNote from '../components/UnconfirmedNote'

interface Props {
  navigate: NavigateFn
}

export default function Terms({ navigate }: Props) {
  const go = (page: Page) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page)
  }

  return (
    <div>
      <section className="relative pt-32 pb-16 bg-navy overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-22" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <a href={hrefFor('home')} onClick={go('home')} className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:text-cyan">Home</a>
            <span>/</span>
            <span className="text-cyan">Terms</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Legal</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Terms of Use
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            These notes describe how this website is intended to be used. They are a structural draft for owner and legal review, not an approved contract.
          </p>
        </div>
      </section>

      <section className="bg-navy pb-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="max-w-3xl space-y-12 text-steel leading-relaxed">
            <LegalReviewBanner>
              This page is not a legally binding terms of service. No governing law, jurisdiction, company registration, or limitation-of-liability wording is provided here because those items have not been confirmed for this project.
            </LegalReviewBanner>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Website use</h2>
              <p>
                This site is provided as a public prototype for browsing company-related content and preparing enquiries. You may use the pages and forms for that purpose. Do not attempt to disrupt the service or submit information you are not authorized to share.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Intellectual property</h2>
              <UnconfirmedNote title="Ownership of marks, copy, and images" />
              <p>
                Branding, layout, and text on this website are presented as project materials. Ownership, licence terms, and permitted reuse have not been confirmed here. Photographs currently used on the site are local project assets and are not represented as independently licensed stock photography.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Website information</h2>
              <p>
                Content on this website is for general information. It has not been verified as a complete or current statement of the company&apos;s legal status, capabilities, or commercial offers.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Product and capability information</h2>
              <p>
                Capability, product, facility, quality, and program descriptions on other pages are prototype copy. They should not be treated as certified, approved, or contractual representations until the owner confirms them. Named customers, programs, and certifications elsewhere on the site require owner verification.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">RFQ enquiries</h2>
              <p>
                Completing Request a Quote submits an enquiry to the company. A selected drawing, if any, is uploaded to private company storage after submit confirms. Completing the form does not create a purchase order, quotation, or binding offer.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Accuracy of information</h2>
              <p>
                We do not warrant that information on this prototype is complete, current, or error-free. Statistics, dates, names, and contact details shown on marketing pages must be checked before any production or commercial use.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">External links</h2>
              <p>
                Some pages load third-party fonts from Google Fonts. Photographs on this site are local project assets. Social profile URLs and a map link are not published because they are not available in this project. This site is not responsible for third-party services.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Limitation of liability</h2>
              <UnconfirmedNote title="Liability terms" />
              <p>
                No limitation, exclusion, or indemnity language is stated here. Any such terms require legal drafting and owner approval.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Governing law</h2>
              <UnconfirmedNote title="Governing law and venue" />
              <p>
                No governing law or dispute forum is named on this page.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Contact</h2>
              <UnconfirmedNote title="Published contact details" />
              <p className="mb-4">
                Contact details currently shown on the website (for owner verification before production):
              </p>
              <p>
                Email shown on the site: info@imapl.co.in<br />
                Phone shown on the site: +91 9742239191
              </p>
              <p className="mt-4">
                Related pages:{' '}
                <a href={hrefFor('contact')} onClick={go('contact')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">Contact</a>
                {' · '}
                <a href={hrefFor('privacy')} onClick={go('privacy')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">Privacy</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
