import { useId, useState, type FormEvent, type MouseEvent } from 'react'
import type { Page } from '../App'
import { hrefFor, shouldSpaNavigate } from '../nav'
import { companyContact } from '../content/contact'
import {
  emailFormat,
  errorClass,
  fieldClass,
  firstError,
  labelClass,
  minMax,
  phoneFormat,
  required,
  type FieldErrors,
} from '../form'
import UnconfirmedNote from '../components/UnconfirmedNote'
import { submitContact } from '../lib/submit'

interface Props {
  navigate: (page: Page) => void
}

const SUBJECTS = [
  'General Enquiry',
  'Request for Quotation (RFQ)',
  'Supplier Qualification / Audit',
  'Capability Enquiry',
  'Facility Visit Request',
  'Partnership / Collaboration',
  'Career / Employment',
  'Other',
] as const

const contacts = [
  { label: 'Email', val: companyContact.email, href: companyContact.emailHref },
  { label: 'Phone', val: companyContact.phone, href: companyContact.phoneHref },
]

export default function Contact({ navigate }: Props) {
  const formId = useId()
  const [contactDetails, setContactDetails] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  })
  const [enquiry, setEnquiry] = useState({
    subject: '',
    message: '',
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [notificationWarning, setNotificationWarning] = useState(false)

  const go = (page: Page) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page)
  }

  const fieldId = (name: string) => `${formId}-${name}`
  const errorId = (name: string) => `${fieldId(name)}-error`

  const validate = (): FieldErrors => ({
    name: firstError(required(contactDetails.name, 'Full name'), minMax(contactDetails.name, 'Full name', 2, 80)),
    company: firstError(required(contactDetails.company, 'Company'), minMax(contactDetails.company, 'Company', 2, 120)),
    email: firstError(required(contactDetails.email, 'Email'), emailFormat(contactDetails.email), minMax(contactDetails.email, 'Email', 5, 120)),
    phone: phoneFormat(contactDetails.phone),
    subject: required(enquiry.subject, 'Subject'),
    message: firstError(required(enquiry.message, 'Message'), minMax(enquiry.message, 'Message', 10, 2000)),
    consent: consent ? '' : 'Confirm that we may use this enquiry to respond to you.',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')
    setNotificationWarning(false)
    if (Object.values(nextErrors).some(Boolean)) return

    setSubmitting(true)
    try {
      const result = await submitContact({
        name: contactDetails.name,
        company: contactDetails.company,
        email: contactDetails.email,
        phone: contactDetails.phone,
        subject: enquiry.subject,
        message: enquiry.message,
        consent,
      })
      if (!result.ok) {
        if (result.fields) setErrors((current) => ({ ...current, ...result.fields }))
        setSubmitError(result.message)
        return
      }
      setNotificationWarning(result.notification !== 'sent')
      setSubmitted(true)
    } catch {
      setSubmitError('Your enquiry was not submitted. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError('')
    setErrors({})
    setConsent(false)
    setNotificationWarning(false)
    setContactDetails({ name: '', company: '', email: '', phone: '' })
    setEnquiry({ subject: '', message: '' })
  }

  const inputProps = (name: string) => ({
    id: fieldId(name),
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
    className: `${fieldClass} ${errors[name] ? 'border-red-400' : ''}`,
  })

  return (
    <div>
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <a href={hrefFor('home')} onClick={go('home')} className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:text-cyan">Home</a>
            <span>/</span>
            <span className="text-cyan">Contact</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Contact Us</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            How to Reach<br />the Company
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed mb-8">
            Use the published contact details below, or send an enquiry with the form. For a structured manufacturing requirement, use Request a Quote.
          </p>
          <a
            href={hrefFor('quote')}
            onClick={go('quote')}
            className="inline-flex items-center gap-3 bg-blue hover:bg-blue-light text-white font-medium text-sm px-8 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            Request a Quote
          </a>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-10">
              <div>
                <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-4">Offices</div>
                <UnconfirmedNote title="Legacy contact details" />
                <div className="space-y-6">
                  {companyContact.offices.map((office) => (
                    <div key={office.label} className="border-l border-border-dark pl-5">
                      <div className="font-mono text-[8px] text-cyan uppercase tracking-wider mb-1">{office.label}</div>
                      <p className="text-steel text-sm leading-relaxed">
                        {office.lines.map((line) => (
                          <span key={line}>{line}<br /></span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-4">Direct Contact</div>
                <div className="border-l border-border-dark pl-5 space-y-4">
                  {contacts.map((item) => (
                    <div key={item.label}>
                      <div className="font-mono text-[8px] text-steel/60 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <a href={item.href} className="text-sm text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">
                        {item.val}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-4">Business Hours</div>
                <div className="border-l border-border-dark pl-5 space-y-2">
                  {[
                    ['Monday – Saturday', '09:00 – 17:00 IST'],
                    ['Sunday', 'Closed'],
                  ].map(([day, hrs]) => (
                    <div key={day} className="flex justify-between gap-4 text-sm">
                      <span className="text-steel">{day}</span>
                      <span className="font-mono text-[11px] text-white">{hrs}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-border-dark p-6">
                <div className="font-mono text-[9px] text-cyan uppercase tracking-widest mb-3">AOG / Urgent Enquiries</div>
                <p className="text-steel text-sm mb-3">For Aircraft-on-Ground and urgent supply requirements, call the published 24-hour line.</p>
                <a href="tel:+919849012345" className="font-display font-bold text-white text-xl hover:text-cyan focus-visible:outline-none focus-visible:text-cyan">
                  +91 98490 12345
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              {submitted ? (
                <div className="border border-cyan/30 p-8 sm:p-16 text-center">
                  <div className="w-12 h-12 border border-cyan flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-white text-3xl uppercase mb-3">Enquiry Submitted</h2>
                  <p className="text-steel max-w-md mx-auto leading-relaxed">
                    Your enquiry has been submitted successfully. The company can use it to respond to you.
                  </p>
                  {notificationWarning && (
                    <p className="text-steel max-w-md mx-auto leading-relaxed mt-4">
                      An automatic email notification to the company could not be confirmed. The enquiry is still stored.
                    </p>
                  )}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={hrefFor('home')}
                      onClick={go('home')}
                      className="bg-blue hover:bg-blue-light text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                    >
                      Return Home
                    </a>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="border border-border-dark text-steel hover:text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form id="enquiry" noValidate onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-white text-3xl uppercase mb-2">Send an Enquiry</h2>
                    <p className="text-steel text-sm">Required fields are marked with an asterisk.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={fieldId('name')} className={labelClass}>Full Name *</label>
                      <input
                        {...inputProps('name')}
                        required
                        autoComplete="name"
                        value={contactDetails.name}
                        onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                        type="text"
                        placeholder="Your name"
                      />
                      {errors.name && <p id={errorId('name')} className={errorClass} role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor={fieldId('company')} className={labelClass}>Company / Organization *</label>
                      <input
                        {...inputProps('company')}
                        required
                        autoComplete="organization"
                        value={contactDetails.company}
                        onChange={(e) => setContactDetails({ ...contactDetails, company: e.target.value })}
                        type="text"
                        placeholder="Your organization"
                      />
                      {errors.company && <p id={errorId('company')} className={errorClass} role="alert">{errors.company}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={fieldId('email')} className={labelClass}>Email Address *</label>
                      <input
                        {...inputProps('email')}
                        required
                        autoComplete="email"
                        value={contactDetails.email}
                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                        type="email"
                        placeholder="name@company.com"
                      />
                      {errors.email && <p id={errorId('email')} className={errorClass} role="alert">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor={fieldId('phone')} className={labelClass}>Phone Number</label>
                      <input
                        {...inputProps('phone')}
                        autoComplete="tel"
                        value={contactDetails.phone}
                        onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                        type="tel"
                        placeholder={companyContact.phone}
                      />
                      {errors.phone && <p id={errorId('phone')} className={errorClass} role="alert">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={fieldId('subject')} className={labelClass}>Subject *</label>
                    <select
                      {...inputProps('subject')}
                      required
                      value={enquiry.subject}
                      onChange={(e) => setEnquiry({ ...enquiry, subject: e.target.value })}
                      className={`${inputProps('subject').className} appearance-none`}
                    >
                      <option value="">Select enquiry type...</option>
                      {SUBJECTS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    {errors.subject && <p id={errorId('subject')} className={errorClass} role="alert">{errors.subject}</p>}
                    {enquiry.subject === 'Request for Quotation (RFQ)' && (
                      <p className="mt-2 text-sm text-steel">
                        For a full manufacturing RFQ,{' '}
                        <a href={hrefFor('quote')} onClick={go('quote')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">
                          use the Request a Quote form
                        </a>
                        .
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={fieldId('message')} className={labelClass}>Message *</label>
                    <textarea
                      {...inputProps('message')}
                      required
                      value={enquiry.message}
                      onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                      rows={6}
                      placeholder="Describe your question or requirement."
                      className={`${inputProps('message').className} resize-y min-h-32`}
                    />
                    {errors.message && <p id={errorId('message')} className={errorClass} role="alert">{errors.message}</p>}
                  </div>
                  <div>
                    <div className="flex items-start gap-3">
                      <input
                        id={fieldId('consent')}
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        aria-invalid={Boolean(errors.consent) || undefined}
                        aria-describedby={errors.consent ? errorId('consent') : undefined}
                        className="mt-1 accent-cyan min-w-4 min-h-4"
                      />
                      <label htmlFor={fieldId('consent')} className="text-sm text-steel leading-relaxed">
                        I consent to this enquiry being used to respond to me. See the{' '}
                        <a href={hrefFor('privacy')} onClick={go('privacy')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">
                          Privacy
                        </a>
                        {' '}page.
                      </label>
                    </div>
                    {errors.consent && <p id={errorId('consent')} className={errorClass} role="alert">{errors.consent}</p>}
                  </div>
                  {submitError && (
                    <p className={errorClass} role="alert">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-blue hover:bg-blue-light disabled:opacity-60 text-white font-medium text-sm px-10 py-4 min-h-12 flex items-center justify-center gap-3 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  >
                    {submitting ? 'Submitting…' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-mid border-t border-border-dark h-64 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-2">Bengaluru, Karnataka</div>
            <div className="font-display font-bold text-white text-2xl uppercase">Peenya Industrial Area</div>
            <div className="font-mono text-[10px] text-steel mt-2 uppercase tracking-widest">Map link not yet available</div>
          </div>
        </div>
      </section>
    </div>
  )
}
