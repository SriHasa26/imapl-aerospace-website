import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from 'react'
import type { Page } from '../App'
import ContactAnimatedBackground from '../components/ContactAnimatedBackground'
import UnconfirmedNote from '../components/UnconfirmedNote'
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
import { submitContact } from '../lib/submit'
import { hrefFor, shouldSpaNavigate } from '../nav'

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

const hoursRows = [
  ['Monday – Saturday', '09:00 – 17:00 IST'],
  ['Sunday', 'Closed'],
] as const

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.2A7 7 0 1 0 5 9.8C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.2" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 4.5H6.5A1.5 1.5 0 0 0 5 6v1.2c0 7 5.8 12.8 12.8 12.8H19a1.5 1.5 0 0 0 1.5-1.5V17l-3.2-1.6-1.6 1.6c-2.4-1.1-4.4-3.1-5.5-5.5l1.6-1.6L10 6.5V4.5Z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.5" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="contact-arrow w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Contact({ navigate }: Props) {
  const formId = useId()
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
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

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['con-info', 'con-form', 'con-map']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      setRevealed(Object.fromEntries(ids.map((id) => [id, true])))
      return
    }

    const hero = heroRef.current
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true)
          heroObserver.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    if (hero) heroObserver.observe(hero)

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => (prev[entry.target.id] ? prev : { ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) revealObserver.observe(el)
    })

    return () => {
      heroObserver.disconnect()
      revealObserver.disconnect()
    }
  }, [])

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
    className: `${fieldClass} contact-field ${errors[name] ? 'border-red-400' : ''}`,
  })

  const corporateOffice = companyContact.offices[0]
  const additionalOffices = companyContact.offices.slice(1)

  return (
    <div className="contact-page">
      <ContactAnimatedBackground />

      <div className="contact-content">
        <section ref={heroRef} className={`contact-hero ${heroVisible ? 'is-visible' : ''}`}>
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="contact-crumb font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
              <a href={hrefFor('home')} onClick={go('home')} className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:text-cyan">Home</a>
              <span>/</span>
              <span className="text-cyan">Contact</span>
            </div>
            <div className="contact-eyebrow flex items-center gap-3 mb-3">
              <div className="contact-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Contact Us</span>
            </div>
            <h1 className="contact-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
              <span className="contact-heading-line">How to Reach</span>
              <span className="contact-heading-line">the Company</span>
            </h1>
            <p className="contact-lede text-steel max-w-2xl text-lg leading-relaxed mb-8">
              Use the published contact details below, or send an enquiry with the form. For a structured manufacturing requirement, use Request a Quote.
            </p>
            <div className="contact-hero-actions flex flex-wrap items-center gap-5">
              <a
                href={hrefFor('quote')}
                onClick={go('quote')}
                className="contact-cta inline-flex items-center gap-3 bg-orange hover:bg-orange-light text-white font-medium text-sm px-8 py-3.5 min-h-12 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                Request a Quote
                <Arrow />
              </a>
              <div className="contact-status" role="status">
                <span className="contact-status-dot" />
                <span className="font-mono text-[10px] text-steel uppercase tracking-[0.18em]">Enquiries accepted</span>
              </div>
            </div>
          </div>
        </section>

        <div className="contact-divider" aria-hidden="true">
          <span />
        </div>

        <section className="contact-main">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="contact-layout">
              <div id="con-info" className={`contact-info ${revealed['con-info'] ? 'is-visible' : ''}`}>
                <div className="contact-section-head">
                  <div className="font-mono text-xs text-steel uppercase tracking-widest">Contact Information</div>
                  <div className="contact-verify-note">
                    <UnconfirmedNote title="Legacy contact details" />
                  </div>
                </div>

                {corporateOffice && (
                  <article className="contact-card" style={{ '--contact-stagger': '0ms' } as CSSProperties}>
                    <div className="contact-card-line" aria-hidden="true" />
                    <div className="contact-card-head">
                      <div className="contact-icon">
                        <IconPin />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em]">Office</div>
                        <h2 className="font-display font-bold text-white text-xl uppercase mt-1">{corporateOffice.label}</h2>
                      </div>
                    </div>
                    <p className="text-steel text-sm leading-relaxed">
                      {corporateOffice.lines.map((line) => (
                        <span key={line}>{line}<br /></span>
                      ))}
                    </p>
                  </article>
                )}

                {contacts.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="contact-card contact-card--link"
                    style={{ '--contact-stagger': `${(index + 1) * 70}ms` } as CSSProperties}
                  >
                    <div className="contact-card-line" aria-hidden="true" />
                    <div className="contact-card-head">
                      <div className="contact-icon">
                        {item.label === 'Email' ? <IconMail /> : <IconPhone />}
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em]">{item.label}</div>
                        <div className="font-display font-bold text-white text-lg mt-1 break-all">{item.val}</div>
                      </div>
                    </div>
                  </a>
                ))}

                <article className="contact-card" style={{ '--contact-stagger': '210ms' } as CSSProperties}>
                  <div className="contact-card-line" aria-hidden="true" />
                  <div className="contact-card-head">
                    <div className="contact-icon">
                      <IconClock />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em]">Business Hours</div>
                      <h2 className="font-display font-bold text-white text-xl uppercase mt-1">Published Hours</h2>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {hoursRows.map(([day, hrs]) => (
                      <div key={day} className="flex justify-between gap-4 text-sm">
                        <span className="text-steel">{day}</span>
                        <span className="font-mono text-[11px] text-white">{hrs}</span>
                      </div>
                    ))}
                  </div>
                </article>

                {additionalOffices.length > 0 && (
                  <article className="contact-card" style={{ '--contact-stagger': '280ms' } as CSSProperties}>
                    <div className="contact-card-line" aria-hidden="true" />
                    <div className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em] mb-4">Additional Locations</div>
                    <div className="space-y-5">
                      {additionalOffices.map((office) => (
                        <div key={office.label}>
                          <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-1">{office.label}</div>
                          <p className="text-steel text-sm leading-relaxed">
                            {office.lines.map((line) => (
                              <span key={line}>{line}<br /></span>
                            ))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                )}
              </div>

              <div id="con-form" className={`contact-form-col ${revealed['con-form'] ? 'is-visible' : ''}`}>
                {submitted ? (
                  <div className="contact-form-panel contact-success text-center">
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
                        className="contact-cta inline-flex items-center justify-center gap-3 bg-orange hover:bg-orange-light text-white font-medium text-sm px-7 py-3.5 min-h-12 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange"
                      >
                        Return Home
                        <Arrow />
                      </a>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="border border-border-dark text-steel hover:text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange"
                      >
                        Send Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form id="enquiry" noValidate onSubmit={handleSubmit} className="contact-form-panel space-y-6">
                    <div className="contact-form-head">
                      <div className="font-mono text-xs text-cyan uppercase tracking-widest mb-2">Enquiry Channel</div>
                      <h2 className="font-display font-bold text-white text-3xl uppercase mb-2">Send an Enquiry</h2>
                      <p className="text-steel text-sm leading-relaxed">
                        Tell us about your requirement and our team will review your enquiry. Required fields are marked with an asterisk.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="contact-field-wrap">
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
                      <div className="contact-field-wrap">
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
                      <div className="contact-field-wrap">
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
                      <div className="contact-field-wrap">
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
                    <div className="contact-field-wrap">
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
                    <div className="contact-field-wrap">
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
                      className="contact-submit w-full sm:w-auto disabled:opacity-60 text-white font-medium text-sm px-10 py-4 min-h-12 inline-flex items-center justify-center gap-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange"
                    >
                      {submitting ? (
                        <>
                          <span className="contact-loader" aria-hidden="true" />
                          Sending enquiry...
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <Arrow />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="con-map" className={`contact-map ${revealed['con-map'] ? 'is-visible' : ''}`}>
          <div className="contact-map-panel">
            <div className="font-mono text-xs text-steel uppercase tracking-widest mb-2">Bengaluru, Karnataka</div>
            <div className="font-display font-bold text-white text-2xl uppercase">Peenya Industrial Area</div>
            <div className="font-mono text-xs text-steel mt-2 uppercase tracking-widest">Map link not yet available</div>
          </div>
        </section>
      </div>
    </div>
  )
}
