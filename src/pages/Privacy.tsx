import type { MouseEvent } from 'react'
import type { NavigateFn, Page } from '../App'
import { hrefFor, shouldSpaNavigate } from '../nav'
import LegalReviewBanner from '../components/LegalReviewBanner'
import UnconfirmedNote from '../components/UnconfirmedNote'

interface Props {
  navigate: NavigateFn
}

export default function Privacy({ navigate }: Props) {
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
            <span className="text-cyan">Privacy</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Legal</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Privacy
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            This page describes how this website currently handles information. It is a structural draft for owner and legal review, not an approved privacy policy.
          </p>
        </div>
      </section>

      <section className="bg-navy pb-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="max-w-3xl space-y-12 text-steel leading-relaxed">
            <LegalReviewBanner>
              This document has not been approved by legal counsel. It does not determine applicability of any privacy statute. No data-retention period, legal basis, data-processor list, or jurisdictional rule is stated here because those facts have not been confirmed for this project.
            </LegalReviewBanner>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Introduction</h2>
              <p>
                This website is a public information and enquiry prototype for Igniting Minds Aerospace, as named in the current project. If you complete Contact or Request a Quote, the details you enter are sent to a company submission system so the company can respond. Drawing files on Request a Quote are stored privately only after a confirmed upload.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Information collected</h2>
              <p className="mb-4">If you use the enquiry or quote forms, you may enter:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name, job title, company, country, email, and phone</li>
                <li>Enquiry subject and message</li>
                <li>Program, part, process, and related requirement details</li>
                <li>A drawing or specification file, if you choose to attach one on Request a Quote (uploaded to private storage after submit confirms)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">How information may be used</h2>
              <p>
                If you submit Contact or Request a Quote, the company stores the fields you entered so it can respond to the enquiry. If the owner has configured server-side email, a notification may also be sent to that configured address. How the company will use, share, or retain data beyond responding is not defined on this page.
              </p>
              <UnconfirmedNote title="Use, sharing, and lawful basis" />
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Contact and enquiry information</h2>
              <p>
                The Contact page form sends an enquiry to the company submission system after you confirm. If email notifications are configured on the server, the company may also receive a copy. Frontend field checks are for user experience; the server re-checks values before storage.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">RFQ information</h2>
              <p>
                The Request a Quote flow collects contact, program, part, and notes in the page, then submits those fields after you confirm. The confirmation screen is shown only after the server accepts the request. A visitor export-control selection is stored as the visitor’s selection; it is not an IMAPL certification claim.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">File attachments</h2>
              <p>
                If you select a drawing and submit Request a Quote, the file is uploaded to private company storage after the server issues a short-lived upload token. It is not published as a public URL. If the upload does not confirm, the request text may still be stored and the file remains on your device.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Data retention</h2>
              <UnconfirmedNote title="Retention schedule" />
              <p>
                No retention period is published. Successful Contact and RFQ submissions are stored in the company database. In-progress form fields that have not been submitted, and selected files that were not uploaded, are discarded when you leave or reset the form. Enquiry form state is not written to localStorage or cookies in this build. Staff who sign in to the internal administration area may have an authentication session stored on that device by the sign-in service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Third-party services</h2>
              <p className="mb-4">This build loads:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fonts from Google Fonts (fonts.googleapis.com)</li>
                <li>Local image files served from this website</li>
                <li>Supabase, used to receive and store submitted Contact and RFQ records and private RFQ files</li>
              </ul>
              <p className="mt-4">
                Those providers may process technical data under their own terms. This project does not currently include analytics, advertising pixels, or a tag manager. Transactional email, if configured by the owner, is sent through a server-side email provider. The recipient address is not published on this page.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Cookies</h2>
              <p>
                This application does not set first-party cookies and does not use localStorage or sessionStorage for enquiry data. Staff administration sign-in uses the authentication provider’s session storage on this device; it is not a public account area. A cookie-policy route is not published because no first-party cookie or tracking consent mechanism is in use. If analytics are added later, consent requirements must be reviewed before those tools go live.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Security</h2>
              <p>
                Frontend validation only checks format and required fields. It is not the security boundary. Contact and Request a Quote are submitted through a server-side function that re-validates values before they are stored. The public website cannot read stored submissions. Only provisioned administrators can open them after signing in. Authorized staff may open a private RFQ drawing through a short-lived download link issued after that check. That link is not a public URL.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">User rights</h2>
              <UnconfirmedNote title="Applicable privacy law and request process" />
              <p>
                No statement is made here about GDPR, CCPA, or any other regime. How access, correction, or deletion requests will be handled has not been confirmed.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-3xl uppercase mb-4">Contact information</h2>
              <UnconfirmedNote title="Published contact details" />
              <p className="mb-4">
                The following details appear elsewhere on this website. They have not been independently verified for this legal page and must be confirmed by the owner before production use.
              </p>
              <p>
                Email shown on the site: info@imapl.co.in<br />
                Phone shown on the site: +91 9742239191
              </p>
              <p className="mt-4">
                You can also use the{' '}
                <a href={hrefFor('contact')} onClick={go('contact')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">
                  Contact
                </a>
                {' '}page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
