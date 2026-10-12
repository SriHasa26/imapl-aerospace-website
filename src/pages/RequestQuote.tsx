import { useId, useState, type DragEvent, type FormEvent, type MouseEvent } from 'react'
import type { Page } from '../App'
import { hrefFor, shouldSpaNavigate } from '../nav'
import {
  ACCEPTED_DRAWING_TYPES,
  drawingFileError,
  emailFormat,
  errorClass,
  fieldClass,
  firstError,
  formatFileSize,
  labelClass,
  minMax,
  phoneFormat,
  required,
  type FieldErrors,
} from '../form'
import { submitRfq, uploadToSignedPath, type SignedUpload } from '../lib/submit'

interface Props {
  navigate: (page: Page) => void
}

type Step = 1 | 2 | 3 | 4

const stepLabels = [
  { n: 1, label: 'Contact Details' },
  { n: 2, label: 'Program Requirements' },
  { n: 3, label: 'Part Information' },
  { n: 4, label: 'Review & Prepare' },
] as const

const countries = ['India', 'United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Singapore', 'UAE', 'Canada', 'Australia', 'Other']
const industries = ['Commercial Aviation', 'Defense & Military', 'Space & Satellites', 'Helicopter & Rotorcraft', 'UAV & Autonomous', 'MRO & Aftermarket', 'Other']
const processes = ['CNC Machining', 'Tooling', 'Jigs & Fixtures', 'Assembly', 'Inspection', 'Load Testing', 'Part Marking', 'Multiple Processes', 'Other']

export default function RequestQuote({ navigate }: Props) {
  const formId = useId()
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [dragOver, setDragOver] = useState(false)

  const [contactDetails, setContactDetails] = useState({
    name: '',
    title: '',
    company: '',
    country: '',
    email: '',
    phone: '',
  })
  const [programRequirements, setProgramRequirements] = useState({
    industry: '',
    program: '',
    platform: '',
    deliveryDate: '',
    quantity: '',
    exportControl: '',
  })
  const [partInformation, setPartInformation] = useState({
    partNumber: '',
    partName: '',
    material: '',
    process: '',
    tolerance: '',
    finish: '',
    qty: '',
  })
  const [additionalRequirements, setAdditionalRequirements] = useState({
    notes: '',
    hasDrawings: 'yes' as 'yes' | 'no',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'submitting' | 'uploading'>('idle')
  const [rfqAccepted, setRfqAccepted] = useState(false)
  const [pendingUpload, setPendingUpload] = useState<SignedUpload | null>(null)
  const [fileUploadStatus, setFileUploadStatus] = useState<'idle' | 'selected' | 'uploading' | 'uploaded' | 'failed'>('idle')
  const [notificationWarning, setNotificationWarning] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)

  const go = (page: Page) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page)
  }

  const fieldId = (name: string) => `${formId}-${name}`
  const errorId = (name: string) => `${fieldId(name)}-error`

  const inputProps = (name: string) => ({
    id: fieldId(name),
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
    className: `${fieldClass} ${errors[name] ? 'border-red-400' : ''}`,
  })

  const validateStep = (current: Step): FieldErrors => {
    if (current === 1) {
      return {
        name: firstError(required(contactDetails.name, 'Full name'), minMax(contactDetails.name, 'Full name', 2, 80)),
        title: firstError(required(contactDetails.title, 'Job title'), minMax(contactDetails.title, 'Job title', 2, 80)),
        company: firstError(required(contactDetails.company, 'Company'), minMax(contactDetails.company, 'Company', 2, 120)),
        country: required(contactDetails.country, 'Country'),
        email: firstError(required(contactDetails.email, 'Email'), emailFormat(contactDetails.email), minMax(contactDetails.email, 'Email', 5, 120)),
        phone: phoneFormat(contactDetails.phone),
      }
    }
    if (current === 2) {
      return {
        industry: required(programRequirements.industry, 'Industry sector'),
        program: firstError(required(programRequirements.program, 'Program name'), minMax(programRequirements.program, 'Program name', 2, 120)),
        platform: minMax(programRequirements.platform, 'Platform', 0, 120),
        quantity: minMax(programRequirements.quantity, 'Annual quantity', 0, 80),
        notes: minMax(additionalRequirements.notes, 'Program notes', 0, 2000),
      }
    }
    if (current === 3) {
      return {
        partName: firstError(required(partInformation.partName, 'Part name'), minMax(partInformation.partName, 'Part name', 2, 160)),
        process: required(partInformation.process, 'Manufacturing process'),
        qty: firstError(required(partInformation.qty, 'Quantity required'), minMax(partInformation.qty, 'Quantity required', 1, 80)),
        partNumber: minMax(partInformation.partNumber, 'Part number', 0, 80),
        material: minMax(partInformation.material, 'Material', 0, 120),
        attachment: drawingFileError(selectedFile),
      }
    }
    return {
      consent: consent ? '' : 'Confirm the information is accurate before submitting this request.',
    }
  }

  const goToStep = (nextStep: Step) => {
    setErrors({})
    setStep(nextStep)
  }

  const handleNext = () => {
    const nextErrors = validateStep(step)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    if (step < 4) setStep(((step + 1) as Step))
  }

  const handlePrev = () => {
    setErrors({})
    if (step > 1) setStep(((step - 1) as Step))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (phase !== 'idle') return
    const nextErrors = validateStep(4)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.values(nextErrors).some(Boolean)) return

    const finishOk = (notification?: string, uploaded?: boolean) => {
      setNotificationWarning(notification !== 'sent')
      setFileUploaded(Boolean(uploaded))
      setFileUploadStatus(uploaded ? 'uploaded' : selectedFile ? 'failed' : 'idle')
      setSubmitted(true)
    }

    let saved = rfqAccepted
    try {
      if (saved && pendingUpload && selectedFile) {
        setPhase('uploading')
        setFileUploadStatus('uploading')
        const uploaded = await uploadToSignedPath(pendingUpload, selectedFile)
        if (!uploaded.ok) {
          setFileUploadStatus('failed')
          setSubmitError(uploaded.message)
          return
        }
        finishOk(uploaded.notification, true)
        return
      }

      setPhase('submitting')
      const result = await submitRfq({
        name: contactDetails.name,
        title: contactDetails.title,
        company: contactDetails.company,
        country: contactDetails.country,
        email: contactDetails.email,
        phone: contactDetails.phone,
        industry: programRequirements.industry,
        program: programRequirements.program,
        platform: programRequirements.platform,
        deliveryDate: programRequirements.deliveryDate,
        quantity: programRequirements.quantity,
        exportControl: programRequirements.exportControl,
        notes: additionalRequirements.notes,
        partNumber: partInformation.partNumber,
        partName: partInformation.partName,
        material: partInformation.material,
        process: partInformation.process,
        tolerance: partInformation.tolerance,
        finish: partInformation.finish,
        qty: partInformation.qty,
        hasDrawings: additionalRequirements.hasDrawings,
        consent,
        attachment: selectedFile
          ? {
              originalFilename: selectedFile.name,
              fileSizeBytes: selectedFile.size,
              mimeType: selectedFile.type,
            }
          : undefined,
      })
      if (!result.ok) {
        if (result.fields) setErrors((current) => ({ ...current, ...result.fields }))
        setSubmitError(result.message)
        return
      }

      saved = true
      setRfqAccepted(true)

      if (result.upload && selectedFile) {
        setPendingUpload(result.upload)
        setPhase('uploading')
        setFileUploadStatus('uploading')
        const uploaded = await uploadToSignedPath(result.upload, selectedFile)
        if (!uploaded.ok) {
          setFileUploadStatus('failed')
          setSubmitError(uploaded.message)
          return
        }
        finishOk(uploaded.notification, true)
        return
      }

      if (result.uploadError && selectedFile) {
        setFileUploadStatus('failed')
        finishOk(result.notification, false)
        return
      }
      finishOk(result.notification, false)
    } catch {
      setSubmitError(saved
        ? 'Your request was saved. The drawing was not uploaded. You can retry the upload.'
        : 'Your request was not submitted. Please try again.')
      if (saved) setFileUploadStatus('failed')
    } finally {
      setPhase('idle')
    }
  }

  const restart = () => {
    setSubmitted(false)
    setSubmitError('')
    setStep(1)
    setErrors({})
    setConsent(false)
    setSelectedFile(null)
    setFileKey((value) => value + 1)
    setPhase('idle')
    setRfqAccepted(false)
    setPendingUpload(null)
    setFileUploadStatus('idle')
    setNotificationWarning(false)
    setFileUploaded(false)
    setContactDetails({ name: '', title: '', company: '', country: '', email: '', phone: '' })
    setProgramRequirements({ industry: '', program: '', platform: '', deliveryDate: '', quantity: '', exportControl: '' })
    setPartInformation({ partNumber: '', partName: '', material: '', process: '', tolerance: '', finish: '', qty: '' })
    setAdditionalRequirements({ notes: '', hasDrawings: 'yes' })
  }

  const applyFile = (file: File | null) => {
    setSelectedFile(file)
    if (!file) setFileKey((value) => value + 1)
    setFileUploadStatus(file ? 'selected' : 'idle')
    setErrors((current) => ({ ...current, attachment: drawingFileError(file) }))
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) applyFile(file)
  }

  const display = (value: string) => value.trim() || '—'

  if (submitted) {
    return (
      <div className="min-h-dvh bg-navy flex items-center justify-center px-6 pt-20 pb-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 border border-cyan flex items-center justify-center mx-auto mb-8">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="font-mono text-xs text-cyan uppercase tracking-widest mb-4">Request Submitted</div>
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl uppercase mb-4">Quote Request Received</h1>
          <p className="text-steel leading-relaxed mb-4">
            Thank you for contacting Igniting Minds Aerospace.
          </p>
          <p className="text-steel leading-relaxed mb-4">
            Your quote request has been submitted successfully. Our team will review your request and get back to you as soon as possible.
          </p>
          {fileUploaded && (
            <p className="text-steel leading-relaxed mb-4">
              Your attachment has been received securely.
            </p>
          )}
          <div className="mb-8" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={hrefFor('home')}
              onClick={go('home')}
              className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Return to Home
            </a>
            <a
              href={hrefFor('capabilities')}
              onClick={go('capabilities')}
              className="border border-border-dark text-steel hover:text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
            >
              Continue Browsing
            </a>
            <button
              type="button"
              onClick={restart}
              className="border border-border-dark text-steel hover:text-white font-medium text-sm px-7 py-3.5 min-h-12 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
            >
              Submit Another RFQ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-navy min-h-dvh">
      <section className="relative pt-32 pb-12 border-b border-border-dark">
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <a href={hrefFor('home')} onClick={go('home')} className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:text-cyan">Home</a>
            <span>/</span>
            <span className="text-cyan">Request a Quote</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-4">Request a Quote</h1>
          <p className="text-steel max-w-xl">
            Complete each step, review the details, then submit. Drawing files are stored privately if the upload confirms.
          </p>
        </div>
      </section>

      <div className="border-b border-border-dark bg-navy-mid" role="navigation" aria-label="RFQ steps">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-stretch overflow-x-auto">
            {stepLabels.map((item) => {
              const complete = item.n < step
              const current = item.n === step
              return (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => { if (complete) goToStep(item.n as Step) }}
                  disabled={!complete && !current}
                  aria-current={current ? 'step' : undefined}
                      className={`flex items-center gap-3 px-4 sm:px-6 py-4 border-r border-border-dark shrink-0 min-h-14 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan ${
                    current ? 'bg-blue' : complete ? 'hover:bg-navy-light cursor-pointer' : 'opacity-40 cursor-default'
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-semibold border ${
                    complete ? 'border-cyan bg-cyan/10 text-cyan' : current ? 'border-white text-white' : 'border-border-dark text-steel'
                  }`}>
                    {complete ? (
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-cyan" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5"/></svg>
                    ) : item.n}
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-wider whitespace-nowrap ${current ? 'text-white' : complete ? 'text-steel' : 'text-steel/50'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <form noValidate onSubmit={handleSubmit} className="max-w-[1440px] mx-auto px-6 xl:px-12 py-12 sm:py-16">
        <div className="max-w-3xl">

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mb-2">Your Contact Information</h2>
              <p className="text-steel text-sm mb-6">Required fields are marked with an asterisk.</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('name')} className={labelClass}>Full Name *</label>
                  <input {...inputProps('name')} required autoComplete="name" value={contactDetails.name} onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })} type="text" placeholder="Your name" />
                  {errors.name && <p id={errorId('name')} className={errorClass} role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('title')} className={labelClass}>Job Title *</label>
                  <input {...inputProps('title')} required autoComplete="organization-title" value={contactDetails.title} onChange={(e) => setContactDetails({ ...contactDetails, title: e.target.value })} type="text" placeholder="Your role" />
                  {errors.title && <p id={errorId('title')} className={errorClass} role="alert">{errors.title}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('company')} className={labelClass}>Company / Organization *</label>
                  <input {...inputProps('company')} required autoComplete="organization" value={contactDetails.company} onChange={(e) => setContactDetails({ ...contactDetails, company: e.target.value })} type="text" placeholder="Your organization" />
                  {errors.company && <p id={errorId('company')} className={errorClass} role="alert">{errors.company}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('country')} className={labelClass}>Country *</label>
                  <select {...inputProps('country')} required value={contactDetails.country} onChange={(e) => setContactDetails({ ...contactDetails, country: e.target.value })} className={`${inputProps('country').className} appearance-none`}>
                    <option value="">Select country...</option>
                    {countries.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.country && <p id={errorId('country')} className={errorClass} role="alert">{errors.country}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('email')} className={labelClass}>Email Address *</label>
                  <input {...inputProps('email')} required autoComplete="email" value={contactDetails.email} onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })} type="email" placeholder="name@company.com" />
                  {errors.email && <p id={errorId('email')} className={errorClass} role="alert">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('phone')} className={labelClass}>Phone (with country code)</label>
                  <input {...inputProps('phone')} autoComplete="tel" value={contactDetails.phone} onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })} type="tel" placeholder="+91 9742239191" />
                  {errors.phone && <p id={errorId('phone')} className={errorClass} role="alert">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mb-2">Program Requirements</h2>
              <p className="text-steel text-sm mb-6">Tell us which program this request supports.</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('industry')} className={labelClass}>Industry Sector *</label>
                  <select {...inputProps('industry')} required value={programRequirements.industry} onChange={(e) => setProgramRequirements({ ...programRequirements, industry: e.target.value })} className={`${inputProps('industry').className} appearance-none`}>
                    <option value="">Select sector...</option>
                    {industries.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.industry && <p id={errorId('industry')} className={errorClass} role="alert">{errors.industry}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('program')} className={labelClass}>Program / Project Name *</label>
                  <input {...inputProps('program')} required value={programRequirements.program} onChange={(e) => setProgramRequirements({ ...programRequirements, program: e.target.value })} type="text" placeholder="Program or project name" />
                  {errors.program && <p id={errorId('program')} className={errorClass} role="alert">{errors.program}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('platform')} className={labelClass}>Platform / Aircraft</label>
                  <input {...inputProps('platform')} value={programRequirements.platform} onChange={(e) => setProgramRequirements({ ...programRequirements, platform: e.target.value })} type="text" placeholder="Optional" />
                  {errors.platform && <p id={errorId('platform')} className={errorClass} role="alert">{errors.platform}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('deliveryDate')} className={labelClass}>Required Delivery Date</label>
                  <input {...inputProps('deliveryDate')} value={programRequirements.deliveryDate} onChange={(e) => setProgramRequirements({ ...programRequirements, deliveryDate: e.target.value })} type="date" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('quantity')} className={labelClass}>Annual Quantity (approx.)</label>
                  <input {...inputProps('quantity')} value={programRequirements.quantity} onChange={(e) => setProgramRequirements({ ...programRequirements, quantity: e.target.value })} type="text" placeholder="e.g. 50 sets / year" />
                  {errors.quantity && <p id={errorId('quantity')} className={errorClass} role="alert">{errors.quantity}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('exportControl')} className={labelClass}>Export Control Classification</label>
                  <select {...inputProps('exportControl')} value={programRequirements.exportControl} onChange={(e) => setProgramRequirements({ ...programRequirements, exportControl: e.target.value })} className={`${inputProps('exportControl').className} appearance-none`}>
                    <option value="">Unknown / Not applicable</option>
                    <option>ITAR Controlled</option>
                    <option>EAR Controlled</option>
                    <option>Dual-use (EU)</option>
                    <option>No export controls</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={fieldId('notes')} className={labelClass}>Additional Program Notes</label>
                <textarea {...inputProps('notes')} value={additionalRequirements.notes} onChange={(e) => setAdditionalRequirements({ ...additionalRequirements, notes: e.target.value })} rows={4} placeholder="Quality standards, specifications, or other notes." className={`${inputProps('notes').className} resize-y min-h-28`} />
                {errors.notes && <p id={errorId('notes')} className={errorClass} role="alert">{errors.notes}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mb-2">Part Information</h2>
              <p className="text-steel text-sm mb-6">Describe the part or assembly. Drawings are uploaded only after you submit, and only if the server confirms the upload.</p>

              <div className="im-card p-5 sm:p-6">
                <fieldset>
                  <legend className="font-mono text-xs text-cyan uppercase tracking-widest mb-3">Drawings</legend>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-steel uppercase tracking-wider">Do you have drawings?</span>
                    <div className="flex gap-2">
                      {(['yes', 'no'] as const).map((value) => (
                        <label key={value} className={`font-mono text-xs px-3 py-2 min-h-10 uppercase tracking-wider border cursor-pointer ${additionalRequirements.hasDrawings === value ? 'border-cyan text-cyan' : 'border-border-dark text-steel'}`}>
                          <input
                            type="radio"
                            name="hasDrawings"
                            value={value}
                            checked={additionalRequirements.hasDrawings === value}
                            onChange={() => {
                              setAdditionalRequirements({ ...additionalRequirements, hasDrawings: value })
                              if (value === 'no') applyFile(null)
                            }}
                            className="sr-only"
                          />
                          {value === 'yes' ? 'Yes, I have drawings' : 'No, describe requirements'}
                        </label>
                      ))}
                    </div>
                  </div>
                </fieldset>

                {additionalRequirements.hasDrawings === 'yes' && (
                  <div>
                    <p className="text-steel text-sm mb-4">
                      Attach a drawing for a more complete request. Accepted: {ACCEPTED_DRAWING_TYPES.join(', ')}. Maximum 50 MB. Files stay on this device until you submit.
                    </p>
                    <label
                      htmlFor={fieldId('attachment')}
                      onDragOver={(event) => { event.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      className={`block border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-cyan' : errors.attachment ? 'border-red-400' : 'border-border-dark hover:border-cyan/50'}`}
                    >
                      <input
                        key={fileKey}
                        id={fieldId('attachment')}
                        type="file"
                        accept={ACCEPTED_DRAWING_TYPES.join(',')}
                        className="sr-only"
                        aria-describedby={errors.attachment ? errorId('attachment') : undefined}
                        aria-invalid={Boolean(errors.attachment) || undefined}
                        onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
                      />
                      <div className="font-mono text-xs text-steel uppercase tracking-widest">Choose or drop a file</div>
                      <div className="font-mono text-xs text-steel/50 mt-1">PDF · STEP · DXF · IGES · up to 50MB</div>
                    </label>
                    {selectedFile && (
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-dark p-3">
                        <div>
                          <div className="text-sm text-white break-all">{selectedFile.name}</div>
                          <div className="font-mono text-xs text-steel mt-1">
                            {formatFileSize(selectedFile.size)}
                            {fileUploadStatus === 'uploading' && ' · uploading'}
                            {fileUploadStatus === 'uploaded' && ' · uploaded'}
                            {fileUploadStatus === 'failed' && ' · upload failed'}
                            {fileUploadStatus === 'selected' && ' · selected on this device'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyFile(null)}
                          className="text-cyan font-mono text-xs uppercase tracking-widest hover:text-white min-h-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                    {errors.attachment && <p id={errorId('attachment')} className={errorClass} role="alert">{errors.attachment}</p>}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('partNumber')} className={labelClass}>Part Number</label>
                  <input {...inputProps('partNumber')} value={partInformation.partNumber} onChange={(e) => setPartInformation({ ...partInformation, partNumber: e.target.value })} type="text" placeholder="Optional" />
                  {errors.partNumber && <p id={errorId('partNumber')} className={errorClass} role="alert">{errors.partNumber}</p>}
                </div>
                <div>
                  <label htmlFor={fieldId('partName')} className={labelClass}>Part Name / Description *</label>
                  <input {...inputProps('partName')} required value={partInformation.partName} onChange={(e) => setPartInformation({ ...partInformation, partName: e.target.value })} type="text" placeholder="Part or assembly name" />
                  {errors.partName && <p id={errorId('partName')} className={errorClass} role="alert">{errors.partName}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={fieldId('material')} className={labelClass}>Material Specification</label>
                  <input {...inputProps('material')} value={partInformation.material} onChange={(e) => setPartInformation({ ...partInformation, material: e.target.value })} type="text" placeholder="Optional" />
                </div>
                <div>
                  <label htmlFor={fieldId('process')} className={labelClass}>Manufacturing Process *</label>
                  <select {...inputProps('process')} required value={partInformation.process} onChange={(e) => setPartInformation({ ...partInformation, process: e.target.value })} className={`${inputProps('process').className} appearance-none`}>
                    <option value="">Select process...</option>
                    {processes.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.process && <p id={errorId('process')} className={errorClass} role="alert">{errors.process}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor={fieldId('tolerance')} className={labelClass}>Critical Tolerance</label>
                  <input {...inputProps('tolerance')} value={partInformation.tolerance} onChange={(e) => setPartInformation({ ...partInformation, tolerance: e.target.value })} type="text" placeholder="Optional" />
                </div>
                <div>
                  <label htmlFor={fieldId('finish')} className={labelClass}>Surface Finish Required</label>
                  <input {...inputProps('finish')} value={partInformation.finish} onChange={(e) => setPartInformation({ ...partInformation, finish: e.target.value })} type="text" placeholder="Optional" />
                </div>
                <div>
                  <label htmlFor={fieldId('qty')} className={labelClass}>Quantity Required *</label>
                  <input {...inputProps('qty')} required value={partInformation.qty} onChange={(e) => setPartInformation({ ...partInformation, qty: e.target.value })} type="text" placeholder="e.g. 12 pcs" />
                  {errors.qty && <p id={errorId('qty')} className={errorClass} role="alert">{errors.qty}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mb-2">Review & Submit</h2>
              <p className="text-steel text-sm">Check each section before submitting this request.</p>

              {[
                {
                  title: 'Contact',
                  step: 1 as Step,
                  data: [
                    ['Name', contactDetails.name],
                    ['Title', contactDetails.title],
                    ['Company', contactDetails.company],
                    ['Country', contactDetails.country],
                    ['Email', contactDetails.email],
                    ['Phone', contactDetails.phone],
                  ],
                },
                {
                  title: 'Program',
                  step: 2 as Step,
                  data: [
                    ['Industry', programRequirements.industry],
                    ['Program', programRequirements.program],
                    ['Platform', programRequirements.platform],
                    ['Delivery', programRequirements.deliveryDate],
                    ['Annual Qty', programRequirements.quantity],
                    ['Export Control', programRequirements.exportControl],
                  ],
                },
                {
                  title: 'Part',
                  step: 3 as Step,
                  data: [
                    ['Part Number', partInformation.partNumber],
                    ['Part Name', partInformation.partName],
                    ['Quantity', partInformation.qty],
                  ],
                },
                {
                  title: 'Manufacturing Requirements',
                  step: 3 as Step,
                  data: [
                    ['Process', partInformation.process],
                    ['Material', partInformation.material],
                    ['Tolerance', partInformation.tolerance],
                    ['Finish', partInformation.finish],
                    ['Drawings available', additionalRequirements.hasDrawings === 'yes' ? 'Yes' : 'No'],
                    ['Attachment', selectedFile ? `${selectedFile.name} (${formatFileSize(selectedFile.size)}) · will upload on submit` : 'None selected'],
                  ],
                },
                {
                  title: 'Additional Notes',
                  step: 2 as Step,
                  data: [['Notes', additionalRequirements.notes]],
                },
              ].map((section) => (
                <div key={section.title} className="im-card overflow-hidden">
                  <div className="bg-navy-mid px-5 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-border-dark">
                    <div className="font-mono text-xs text-steel uppercase tracking-widest">{section.title}</div>
                    <button
                      type="button"
                      onClick={() => goToStep(section.step)}
                      className="font-mono text-xs text-cyan uppercase tracking-widest hover:text-white min-h-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
                    >
                      Edit
                    </button>
                  </div>
                  <div className={`p-5 sm:p-6 grid gap-4 ${section.data.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                    {section.data.map(([key, value]) => (
                      <div key={key}>
                        <div className="font-mono text-[11px] text-steel uppercase tracking-wider mb-0.5">{key}</div>
                        <div className="text-sm text-white break-words">{display(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

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
                  <label htmlFor={fieldId('consent')} className="text-sm text-steel">
                    I confirm this information is accurate and I am submitting it to the company. A selected drawing is uploaded to private storage only after submit confirms. See{' '}
                    <a href={hrefFor('privacy')} onClick={go('privacy')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">Privacy</a>
                    {' '}and{' '}
                    <a href={hrefFor('terms')} onClick={go('terms')} className="text-cyan hover:text-white focus-visible:outline-none focus-visible:text-white">Terms</a>.
                  </label>
                </div>
                {errors.consent && <p id={errorId('consent')} className={errorClass} role="alert">{errors.consent}</p>}
              </div>
              {submitError && (
                <p className={errorClass} role="alert">{submitError}</p>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mt-12 pt-8 border-t border-border-dark">
            <button
              type="button"
              onClick={handlePrev}
              className={`border border-border-dark text-steel hover:text-white hover:border-steel font-medium text-sm px-6 py-3 min-h-12 transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan ${step === 1 ? 'invisible hidden sm:flex sm:invisible' : ''}`}
            >
              Previous
            </button>
            <div className="font-mono text-xs text-steel uppercase tracking-wider text-center">Step {step} of 4</div>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-8 py-3 min-h-12 flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={phase !== 'idle'}
                className="bg-orange hover:bg-orange-light disabled:opacity-60 text-white font-bold text-sm px-8 py-3 min-h-12 flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {phase === 'uploading' ? 'Uploading drawing…' : phase === 'submitting' ? 'Submitting…' : rfqAccepted && fileUploadStatus === 'failed' ? 'Retry upload' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
