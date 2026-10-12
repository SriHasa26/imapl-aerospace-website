import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Page } from '../App'
import HeroBackdrop from '../components/HeroBackdrop'
import LocationsMap from '../components/LocationsMap'
import PrismaticBurst from '../components/PrismaticBurst'
import SitePhoto from '../components/SitePhoto'
import { images } from '../content/assets'
import { catalogFillClass, imageFrame, isTechnicalPhoto, photoClass, productFrameStyle, productWellClass } from '../content/imagePresentation'
import {
  capabilities as capabilityRecords,
  capabilityPageSections,
  type CapabilityRecord,
} from '../content/capabilities'
import {
  description,
  foundingYear,
  headquarters,
  officialName,
  publicWorkAreas,
  shortName,
  staffCount,
  yearsOfExperience,
} from '../content/company'
import { facilityArea } from '../content/facilities'
import { industries as industryRecords } from '../content/industries'
import {
  productFamilies,
  productImageSrc,
  publicProductSpecs,
} from '../content/products'
import {
  inspectionProcesses,
  loadTesting,
  partMarking,
  publishedCertifications,
  qualityMetricsPrototype,
} from '../content/quality'
import { isConflicting, isPublishable, type MaybeConflicting } from '../content/types'

interface Props {
  navigate: (page: Page) => void
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function SectionLabel({ text, className = "text-sm" }: { text: string; className?: string }) {
  return (
    <p className={`flex gap-3 mb-3 min-w-0 w-full max-w-full font-mono ${className} text-orange uppercase tracking-[0.12em] sm:tracking-[0.16em] leading-snug`}>
      <span className="mt-[0.55em] w-7 h-px bg-orange shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">{text}</span>
    </p>
  )
}

function publishedValue<T>(field: MaybeConflicting<T>): T | undefined {
  if (isConflicting(field)) return undefined
  if (!isPublishable(field.verificationStatus)) return undefined
  return field.value
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function composeSection(capabilityIds: string[]) {
  const records = capabilityIds
    .map((id) => capabilityRecords.find((capability) => capability.id === id))
    .filter((capability): capability is CapabilityRecord => {
      if (!capability) return false
      return isPublishable(capability.verificationStatus)
    })

  const primary = records[0]
  if (!primary) return undefined

  const materials = unique(records.flatMap((record) => record.materials))
  const details = unique(records.flatMap((record) => record.technicalDetails))

  return {
    title: primary.title,
    desc: primary.description,
    items: details.slice(0, 3),
    materials,
  }
}

const capabilityIcons: Record<string, ReactNode> = {
  '01': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="20" width="24" height="4" rx="0.5" />
      <path d="M16 20V8M10 14l6-6 6 6" />
      <circle cx="16" cy="8" r="2" />
    </svg>
  ),
  '02': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 10h24M4 16h24M4 22h24" />
      <path d="M8 10V22M16 10V22M24 10V22" strokeDasharray="2 2" />
    </svg>
  ),
  '03': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 16 L16 8 L28 16 L16 24 Z" />
      <path d="M4 16 L28 16M16 8 L16 24" strokeDasharray="2 2" />
    </svg>
  ),
  '04': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="10" height="10" />
      <rect x="18" y="4" width="10" height="10" />
      <rect x="11" y="18" width="10" height="10" />
      <path d="M9 14v4h14v-4" />
    </svg>
  ),
  '05': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse cx="16" cy="16" rx="12" ry="12" />
      <ellipse cx="16" cy="16" rx="8" ry="8" />
      <ellipse cx="16" cy="16" rx="3" ry="3" />
    </svg>
  ),
  '06': (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 28L14 18l4 4L28 8" />
      <circle cx="26" cy="10" r="4" />
      <path d="M26 6v4h4" strokeWidth="0.8" />
    </svg>
  ),
}

const publicFoundingYear = publishedValue(foundingYear)
const publicHeadquarters = publishedValue(headquarters)
const publicStaffCount = publishedValue(staffCount)
const publicYears = publishedValue(yearsOfExperience)
const publicFacilityArea = publishedValue(facilityArea)

const identityBand = [
  { val: shortName.value, label: 'Aerospace Manufacturing' },
  { val: 'MRO', label: 'Tooling Solutions' },
  { val: 'CNC', label: 'Precision Machining' },
  { val: 'GSE', label: 'Ground Support Equipment' },
]

const overviewOverlay = [
  publicFacilityArea
    ? { val: publicFacilityArea, unit: 'AREA', label: 'Facility' }
    : { val: shortName.value, unit: 'AEROSPACE', label: 'Manufacturing' },
  publicStaffCount
    ? { val: publicStaffCount, unit: 'STAFF', label: 'Workforce' }
    : { val: 'MRO', unit: 'TOOLING', label: 'Solutions' },
  publicFoundingYear
    ? { val: publicFoundingYear, unit: 'EST.', label: 'Founded' }
    : { val: 'CNC', unit: 'MACHINING', label: 'Precision' },
]

const overviewList = publicWorkAreas.slice(0, 4)

const homeCapabilities = capabilityPageSections
  .map((section) => {
    const composed = composeSection(section.capabilityIds)
    if (!composed) return undefined
    return {
      num: section.id,
      title: composed.title,
      desc: composed.desc,
      items: composed.items.length > 0 ? composed.items : [composed.title],
      icon: capabilityIcons[section.id],
    }
  })
  .filter((section): section is NonNullable<typeof section> => Boolean(section))

const publicIndustries = industryRecords.filter((industry) => isPublishable(industry.verificationStatus))

const publicFamilies = productFamilies.filter((family) => isPublishable(family.verificationStatus))
const featuredProducts = [
  ...publicFamilies.filter((family) => productImageSrc(family.image)),
  ...publicFamilies.filter((family) => !productImageSrc(family.image)),
].slice(0, 3)

const workflow = homeCapabilities.map((cap) => ({
  step: cap.num,
  title: cap.title,
  desc: cap.desc,
  items: cap.items,
  icon: cap.icon,
}))

const publicInspection = isPublishable(inspectionProcesses.verificationStatus) ? inspectionProcesses.methods : []
const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []
const publicCerts = publishedCertifications.filter((cert) => isPublishable(cert.verificationStatus))
const publicMetrics = isPublishable(qualityMetricsPrototype.verificationStatus) ? qualityMetricsPrototype.items : []

const qualityCards = publicCerts.length > 0
  ? publicCerts.map((cert) => ({ cert: cert.code, desc: cert.name }))
  : [
    publicInspection[0] ? { cert: 'Inspection', desc: publicInspection[0] } : undefined,
    publicInspection[1] ? { cert: 'Geometry', desc: publicInspection[1] } : undefined,
    publicLoadTesting[0] ? { cert: 'Load Testing', desc: publicLoadTesting[0] } : undefined,
    publicPartMarking[0] ? { cert: 'Part Marking', desc: publicPartMarking[0] } : undefined,
  ].filter((card): card is { cert: string; desc: string } => Boolean(card))

const qualityOverlay = publicMetrics.length > 0
  ? publicMetrics.slice(0, 3).map((item) => {
    const [val, ...rest] = item.split(' ')
    return { val, label: rest.join(' ') || item }
  })
  : [
    { val: 'Inspect', label: publicInspection[0] ?? 'Dimensional inspection' },
    { val: 'Load', label: publicLoadTesting[0] ?? 'Load testing' },
    { val: 'Mark', label: publicPartMarking[2] ?? publicPartMarking[0] ?? 'Part marking' },
  ]

const facilityStats = publicFacilityArea
  ? [{ val: publicFacilityArea, label: 'Facility Area' }, ...identityBand.slice(1).map((item) => ({ val: item.val, label: item.label }))]
  : identityBand.map((item) => ({ val: item.val, label: item.label }))

const reachChips = publicYears
  ? [{ val: publicYears, label: 'Years of Operation' }, ...publicWorkAreas.slice(0, 2).map((area) => ({ val: area.split(' ')[0] ?? area, label: area }))]
  : publicWorkAreas.slice(0, 3).map((area) => {
    const [first, ...rest] = area.split(' ')
    return { val: first ?? area, label: rest.join(' ') || area }
  })

const resourceNotices = publicWorkAreas.slice(0, 3).map((area) => ({
  tag: 'Notice',
  title: area,
  excerpt: 'Published resources, case studies, and downloads are being updated. Enquire via Contact or Request a Quote.',
}))

const companySummary = `${officialName.value} (${shortName.value}) is an ${description.value.charAt(0).toLowerCase()}${description.value.slice(1)}`

function ProcessWorkflow({
  steps,
  visible,
  navigate,
}: {
  steps: typeof workflow
  visible: boolean
  navigate: (page: Page) => void
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = steps.length
  const current = steps[active]
  const progress = count > 1 ? (active / (count - 1)) * 100 : 0

  useEffect(() => {
    if (!visible || paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % count)
    }, 4500)
    return () => window.clearInterval(id)
  }, [visible, paused, count])

  if (!current) return null

  return (
    <div
      className={`process-workflow ${visible ? 'is-visible' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="process-header flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <SectionLabel text="Our Process" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight">
            From Brief
            <br />
            To Finished Part
          </h2>
          <p className="mt-4 max-w-xl text-mid text-sm lg:text-base leading-relaxed">
            Six connected manufacturing stages — from machining through inspection — so every programme moves with a clear path from enquiry to dispatch.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">
            Stage {current.step} / 0{count}
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-mid">
            <span className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-mid' : 'bg-orange process-live-dot'}`} />
            {paused ? 'Paused' : 'Live sequence'}
          </div>
        </div>
      </div>

      <div className="process-timeline relative mb-8">
        <div className="process-timeline-track hidden lg:block absolute top-[27px] left-[6%] right-[6%]" />
        <div className="hidden lg:block absolute top-[27px] left-[6%] right-[6%] h-px overflow-hidden">
          <div
            className="process-timeline-progress h-full origin-left"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, index) => {
            const isActive = index === active
            return (
              <button
                type="button"
                key={step.step}
                onClick={() => {
                  setActive(index)
                  setPaused(true)
                }}
                className={`process-stage min-w-[9.5rem] lg:min-w-0 text-left group ${isActive ? 'is-active' : ''}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex lg:justify-center mb-4">
                  <div
                    className={`process-node relative z-10 w-14 h-14 flex items-center justify-center border ${
                      isActive
                        ? 'bg-orange border-orange text-white process-node-active'
                        : 'bg-navy border-navy text-orange group-hover:border-orange'
                    }`}
                  >
                    <span className="font-mono text-sm font-semibold">{step.step}</span>
                  </div>
                </div>
                <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-1 ${isActive ? 'text-orange' : 'text-mid'}`}>
                  Stage {step.step}
                </div>
                <h3 className={`font-display font-bold uppercase leading-tight ${isActive ? 'text-orange' : 'text-navy group-hover:text-orange'}`}>
                  {step.title}
                </h3>
              </button>
            )
          })}
        </div>
      </div>

      <div className="process-panel relative text-white">
        <div className="absolute top-6 right-6 hidden md:block pointer-events-none">
          <span className="font-display font-black text-white/10 text-7xl leading-none">{current.step}</span>
        </div>
        <div className="absolute top-0 left-0 h-1 w-full bg-white/10">
          <div
            key={`${current.step}-${paused ? 'paused' : 'live'}`}
            className={`h-full bg-orange ${paused ? '' : 'process-timer'}`}
            style={{ width: paused ? `${progress}%` : undefined }}
          />
        </div>
        <div key={current.step} className="process-feature-swap process-panel-inner relative grid lg:grid-cols-[auto_minmax(0,1fr)_auto] gap-8 p-6 sm:p-8 lg:p-10">
          <div className="process-panel-icon w-16 h-16 sm:w-20 sm:h-20 border border-orange/40 text-orange flex items-center justify-center">
            {current.icon}
          </div>
          <div>
            <div className="font-mono text-[11px] text-orange uppercase tracking-[0.18em] mb-3">
              Current stage
            </div>
            <h3 className="font-display font-black text-white text-3xl lg:text-4xl uppercase leading-tight mb-3">
              {current.title}
            </h3>
            <p className="text-steel text-sm lg:text-base leading-relaxed max-w-2xl mb-5">
              {current.desc}
            </p>
            {current.items.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {current.items.map((item) => (
                  <li
                    key={item}
                    className="process-tag font-mono text-[11px] uppercase tracking-wider text-orange border border-orange/25 bg-orange/10 px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col justify-between gap-6 lg:items-end">
            <div className="font-mono text-[11px] uppercase tracking-widest text-steel lg:text-right">
              {active + 1 < count ? `Next: ${steps[active + 1].title}` : 'Final inspection stage'}
            </div>
            <button
              type="button"
              onClick={() => navigate('capabilities')}
              className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-6 py-3.5 flex items-center gap-3 transition-colors w-fit"
            >
              View this capability
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home({ navigate }: Props) {
  const revealCaps = useReveal()
  const revealIndustries = useReveal()
  const revealWorkflow = useReveal()
  const revealQuality = useReveal()
  const revealCase = useReveal()
  const revealNews = useReveal()

  return (
    <div>
      {/* ── HERO ── */}
      <section className="home-section min-h-[100svh] flex flex-col overflow-hidden bg-navy" aria-label="Igniting Minds Aerospace manufacturing">
        <HeroBackdrop />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/55 via-navy/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/15" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-orange/15" />
        <div className="absolute inset-0 blueprint-grid opacity-[0.08]" />

        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full min-w-0 px-6 xl:px-12 pt-28 pb-16">
          <div className="max-w-3xl xl:max-w-4xl anim-fade-up min-w-0">
            <SectionLabel text="Aerospace Engineering & Manufacturing" className="text-[11px] sm:text-sm" />
            <h1 className="font-display font-black text-white uppercase leading-[0.98] tracking-[-0.02em] text-[clamp(2.6rem,6.2vw,6.75rem)] [text-shadow:0_8px_32px_rgba(10,20,38,0.55)]">
              IGNITING<br />
              THE FUTURE<br />
              <span className="text-orange">OF FLIGHT</span>
            </h1>
            <p className="mt-6 max-w-xl text-steel text-base lg:text-lg leading-relaxed">
              {description.value}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('capabilities')}
                className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-8 py-3.5 flex items-center gap-3 transition-colors duration-200 shadow-lg shadow-orange/25"
              >
                Explore Capabilities
                <ArrowRight />
              </button>
              <button
                onClick={() => navigate('quote')}
                className="border border-orange/60 text-orange hover:bg-orange/10 font-medium text-sm px-8 py-3.5 flex items-center gap-3 transition-colors duration-200 glass-dark"
              >
                Request a Quote
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="mt-auto pt-16">
            <div className="border-t border-white/15 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
              {identityBand.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <div className="font-display font-black text-white text-4xl lg:text-5xl tracking-tight">{item.val}</div>
                  <div className="font-mono text-[11px] text-orange uppercase tracking-[0.16em] mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW ── */}
      <section className="home-section bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="home-overview-grid grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="home-overview-media">
              <div className="home-overview-media-frame home-overview-media-frame--factory">
                <img
                  src={images.overviewTeamFactory}
                  alt="Igniting Minds Aerospace team on the manufacturing shop floor"
                  width={1920}
                  height={1453}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="home-overview-img home-overview-img--factory"
                />
                <div className="home-overview-overlay">
                  <div className="grid grid-cols-3 gap-4">
                    {overviewOverlay.map(s => (
                      <div key={s.label} className="text-center">
                        <div className="font-display font-bold text-white text-xl">{s.val}</div>
                        <div className="font-mono text-[10px] text-orange tracking-widest mt-1">{s.unit} · {s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange/70 pointer-events-none" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-orange/70 pointer-events-none" />
              </div>
              <div className="home-overview-media-frame home-overview-media-frame--seated">
                <img
                  src={images.overviewTeamSeated}
                  alt="Igniting Minds Aerospace leadership and team"
                  width={1920}
                  height={618}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="home-overview-img home-overview-img--seated"
                />
              </div>
            </div>

            <div>
              <SectionLabel text="Company Overview" />
              <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-5">
                Engineering Excellence<br />
                <span className="text-orange">At Every Scale</span>
              </h2>
              <p className="text-mid leading-relaxed mb-5">
                {companySummary}
              </p>
              <p className="text-mid leading-relaxed mb-6">
                Work areas include aero-engine tooling, precision aerospace components, MRO tooling, and integrated engineering and manufacturing.
              </p>
              <ul className="space-y-3 mb-8">
                {overviewList.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-mid">
                    <div className="w-4 h-4 border border-orange flex items-center justify-center shrink-0 mt-0.5">
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-orange" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('about')}
                className="bg-navy hover:bg-navy-light text-white font-medium text-sm px-7 py-3.5 flex items-center gap-3 transition-colors w-fit shadow-lg shadow-navy/20"
              >
                Learn About Us
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="home-section caps-type-section bg-navy">
        <div className="caps-type-inner max-w-[1440px] mx-auto w-full px-6 xl:px-12 py-12 lg:py-0">
          <div ref={revealCaps.ref} className={`caps-type-header reveal ${revealCaps.visible ? 'visible' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-0">
              <div className="min-w-0">
                <div className="caps-kicker">
                  <SectionLabel text="Manufacturing Capabilities" />
                </div>
                <h2 className="caps-heading font-black text-white uppercase leading-[0.95]">
                  Precision At Every<br />Process
                </h2>
              </div>
              <button
                onClick={() => navigate('capabilities')}
                className="caps-link flex items-center gap-2 text-orange uppercase hover:text-white transition-colors shrink-0"
              >
                All Capabilities <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="caps-fill-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeCapabilities.map((cap, i) => (
              <button
                type="button"
                key={cap.num}
                className={`caps-card im-card im-card-hover p-6 group text-left relative h-full reveal ${revealCaps.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => navigate('capabilities')}
              >
                <div className="caps-card-head flex items-start justify-between mb-4">
                  <div className="text-orange group-hover:text-white transition-colors">{cap.icon}</div>
                  <span className="caps-card-num text-steel/50">{cap.num}</span>
                </div>
                <h3 className="caps-card-title font-bold text-white uppercase mb-2 group-hover:text-orange transition-colors">
                  {cap.title}
                </h3>
                <p className="caps-card-copy text-steel mb-4">{cap.desc}</p>
                <ul className="space-y-1.5">
                  {cap.items.map(item => (
                    <li key={item} className="caps-card-item text-steel/70 flex items-center gap-2">
                      <div className="w-1 h-1 bg-orange/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="home-section industries-screen bg-off">
        <div className="industries-screen-inner max-w-[1440px] mx-auto px-6 xl:px-12 py-16 lg:py-20">
          <div ref={revealIndustries.ref} className={`reveal ${revealIndustries.visible ? 'visible' : ''} shrink-0`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
              <div>
                <SectionLabel text="Industries Served" />
                <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight">
                  Aerospace<br />Manufacturing
                </h2>
              </div>
              <button
                onClick={() => navigate('industries')}
                className="flex items-center gap-2 text-orange font-mono text-xs uppercase tracking-widest hover:text-navy transition-colors shrink-0"
              >
                All Industries <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="industries-fill-grid grid lg:grid-cols-12 gap-4">
            {publicIndustries.map((ind, i) => {
              const src = ind.image ? images[ind.image] : images.manufacturingImage
              const featured = i === 0
              const catalog = catalogFillClass(src)
              return (
                <button
                  key={ind.id}
                  onClick={() => navigate('industries')}
                  className={`relative min-h-[18rem] text-left group overflow-hidden reveal ${revealIndustries.visible ? 'visible' : ''} ${
                    featured ? 'lg:col-span-7 lg:row-span-2 lg:min-h-0' : 'lg:col-span-5 lg:min-h-0'
                  } ${catalog ? `bg-off ${catalog}` : 'bg-navy'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <SitePhoto
                    src={src}
                    alt={ind.industry}
                    role={isTechnicalPhoto(src) ? 'photo' : 'decorative'}
                    frame={featured ? 'panorama' : 'landscape'}
                    className={`absolute inset-0 im-photo-hover${catalog ? '' : isTechnicalPhoto(src) ? ' p-6 sm:p-8' : ''}`}
                  />
                  <div className={`absolute inset-0 ${catalog ? 'im-overlay-caption im-overlay-caption-catalog' : 'im-overlay-caption'}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <h3 className="font-display font-bold text-white text-xl lg:text-2xl uppercase leading-tight">
                      {ind.industry}
                    </h3>
                    <p className="font-mono text-[11px] text-orange/90 mt-1 tracking-wider">
                      {ind.workAreas?.[0] ?? 'Aerospace'}
                    </p>
                    <p className="text-steel text-sm leading-relaxed mt-2 line-clamp-2">{ind.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                      <span className="font-mono text-xs uppercase tracking-wider">Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="home-section bg-navy py-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <SectionLabel text="Featured Products" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                Built for Critical<br />Applications
              </h2>
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-2 text-orange font-mono text-sm uppercase tracking-widest hover:text-white transition-colors shrink-0"
            >
              All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map(product => {
              const img = productImageSrc(product.image) ?? images.precisionComponents
              const specs = publicProductSpecs(product).slice(0, 3)
              return (
                <button
                  key={product.id}
                  onClick={() => navigate('products')}
                  className="im-card im-card-hover text-left group overflow-hidden"
                >
                  <div
                    className={`${imageFrame.card} ${productWellClass(img) || 'bg-navy im-media-product'}`}
                    style={productFrameStyle(img)}
                  >
                    <SitePhoto
                      src={img}
                      alt={product.name}
                      frame="card"
                      className="im-photo-hover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[11px] text-orange uppercase tracking-widest mb-2">{product.category}</div>
                    <h3 className="font-display font-bold text-white text-3xl uppercase leading-tight mb-2 group-hover:text-orange transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-steel text-sm leading-relaxed mb-4">{product.shortDescription}</p>
                    {specs.length > 0 && (
                      <div className="border-t border-border-dark pt-3 grid grid-cols-3 gap-2">
                        {specs.map((spec) => (
                          <div key={spec.label}>
                            <div className="font-mono text-[10px] text-steel/70 uppercase tracking-wider">{spec.label}</div>
                            <div className="font-mono text-xs text-white mt-0.5">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── MANUFACTURING WORKFLOW ── */}
      <section className="home-section process-screen">
        <div className="process-screen-glow" aria-hidden="true" />
        <div ref={revealWorkflow.ref} className="process-screen-inner relative max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <ProcessWorkflow
            steps={workflow}
            visible={revealWorkflow.visible}
            navigate={navigate}
          />
        </div>
      </section>

      {/* ── QUALITY ── */}
      <section className="home-section home-quality">
        <div className="home-quality-ambient" aria-hidden="true" />
        <div className="home-quality-grid" aria-hidden="true" />
        <div className="home-quality-scan" aria-hidden="true" />
        <div
          ref={revealQuality.ref}
          className={`home-quality-inner relative max-w-[1440px] mx-auto w-full px-6 xl:px-12 ${revealQuality.visible ? 'is-visible' : ''}`}
        >
          <div className="home-quality-layout">
            <div className="home-quality-copy">
              <SectionLabel text="Quality Assurance" />
              <h2 className="home-quality-heading font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-5">
                Inspection.<br />Load Testing.<br />Marking.
              </h2>
              <p className="home-quality-lede text-steel leading-relaxed mb-6">
                Dimensional, geometric, and CMM inspection, NDT, load testing, and part marking.
              </p>
              <div className="home-quality-certs">
                {qualityCards.map((item) => (
                  <div key={item.cert} className="home-quality-cert">
                    <div className="home-quality-cert-mark" aria-hidden="true" />
                    <div className="font-display font-bold text-orange text-lg uppercase leading-tight">{item.cert}</div>
                    <div className="font-mono text-[11px] text-steel mt-1.5 tracking-wider leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('quality')}
                className="home-quality-cta flex items-center gap-2 text-orange font-mono text-xs uppercase tracking-widest"
              >
                View Quality Policy <ArrowRight className="home-quality-cta-arrow w-3.5 h-3.5" />
              </button>
            </div>

            <div className="home-quality-media">
              <div className="home-quality-media-glow" aria-hidden="true" />
              <div className="home-quality-frame">
                <SitePhoto
                  src={images.qualityImage}
                  alt="Precision inspection equipment"
                  frame="banner"
                  loading="lazy"
                  className="home-quality-img"
                />
                <div className="home-quality-frame-edge" aria-hidden="true" />
                <span className="home-quality-corner home-quality-corner--tl" aria-hidden="true" />
                <span className="home-quality-corner home-quality-corner--tr" aria-hidden="true" />
                <span className="home-quality-corner home-quality-corner--bl" aria-hidden="true" />
                <span className="home-quality-corner home-quality-corner--br" aria-hidden="true" />
                <div className="home-quality-label">
                  <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em]">Precision Inspection</span>
                </div>
              </div>
            </div>
          </div>

          <div className="home-quality-methods">
            {qualityOverlay.map((item, index) => (
              <article
                key={item.val}
                className="home-quality-method"
                style={{ '--home-quality-stagger': `${160 + index * 90}ms` } as CSSProperties}
              >
                <div className="home-quality-method-top">
                  <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.18em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="home-quality-method-icon" aria-hidden="true">
                    {item.val === 'Inspect' ? (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="M16 16l4 4" />
                      </svg>
                    ) : item.val === 'Load' ? (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 18h16M7 18V8h10v10M9 8V5h6v3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 19V5h8l6 6v8H5Z" />
                        <path d="M13 5v6h6" />
                      </svg>
                    )}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase mt-3">{item.val}</h3>
                <p className="font-mono text-[11px] text-steel mt-2 tracking-wider leading-relaxed">{item.label}</p>
                <span className="home-quality-method-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACILITY ── */}
      <section className="home-section relative py-24 overflow-hidden">
        <img
          src={images.facilityImage}
          alt="Igniting Minds Aerospace manufacturing facility"
          className={`absolute inset-0 ${photoClass(images.facilityImage, 'decorative')} opacity-45`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/55 to-navy/20" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="max-w-2xl">
            <SectionLabel text="Our Facility" />
            <h2 className="font-display font-bold text-white text-4xl lg:text-6xl uppercase leading-tight mb-5">
              Aerospace<br />Manufacturing
            </h2>
            <p className="text-steel text-base leading-relaxed mb-8">
              {description.value} Facility photography is shown as visual context. Disputed location, area, and machine-count figures are not published here.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {facilityStats.map(s => (
                <div key={s.label}>
                  <div className="font-display font-black text-white text-4xl">{s.val}</div>
                  <div className="font-mono text-[11px] text-orange mt-1 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('facilities')}
              className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-3.5 flex items-center gap-3 transition-colors w-fit"
            >
              Tour the Facility
              <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── MANUFACTURING IDENTITY ── */}
      <section className="home-section work-morph-section overflow-hidden py-24">
        <div className="news-morph-orb news-morph-orb-a" />
        <div className="pointer-events-none absolute inset-0 opacity-25 blueprint-grid" />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel text="Work Areas" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-5">
                Engineering &amp;<br />Manufacturing
              </h2>
              <p className="text-steel leading-relaxed mb-8">
                {description.value}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {reachChips.map(s => (
                  <div key={s.label} className="work-neu-chip px-4 py-4">
                    <div className="font-display font-bold text-white text-3xl lg:text-4xl">{s.val}</div>
                    <div className="font-mono text-[11px] text-orange mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative work-glass-map skeuo-orange overflow-hidden aspect-[16/10] min-h-[22rem]">
              <LocationsMap />
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="home-section case-screen">
        <div className="case-screen-glow" aria-hidden="true" />
        <div className="case-scan" aria-hidden="true" />
        <div
          ref={revealCase.ref}
          className={`case-screen-inner relative max-w-[1440px] mx-auto w-full px-6 xl:px-12 ${revealCase.visible ? 'is-visible' : ''}`}
        >
          <div className="case-header flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="case-kicker">
                <SectionLabel text="Case Studies" />
              </div>
              <h2 className="case-heading font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight">
                Resources Being<br />Updated
              </h2>
            </div>
            <button
              onClick={() => navigate('resources')}
              className="case-cta font-mono text-xs uppercase tracking-widest text-orange shrink-0 px-4 py-2.5 flex items-center gap-2"
            >
              All Resources <ArrowRight className="case-cta-arrow w-3.5 h-3.5" />
            </button>
          </div>
          <div className="case-grid grid lg:grid-cols-2 gap-6">
            {featuredProducts.slice(0, 2).map((product, i) => (
              <button
                key={product.id}
                onClick={() => navigate('resources')}
                className="case-card text-left group"
                style={{ animationDelay: `${120 + i * 100}ms` }}
              >
                <div className="case-card-media bg-navy relative im-media-product">
                  <SitePhoto
                    src={i === 0 ? images.cncGantryBay : images.cncMachineImage}
                    alt={product.name}
                    frame="banner"
                    className="case-card-image im-media-product-img"
                  />
                  <div className="case-card-shade" />
                  <div className="absolute top-4 left-4 font-mono text-[11px] text-orange uppercase tracking-widest px-2 py-1 bg-navy/60 backdrop-blur-md border border-white/10">
                    {product.category}
                  </div>
                </div>
                <div className="case-card-body p-6">
                  <div className="font-mono text-[11px] text-orange uppercase tracking-widest mb-2">Documentation</div>
                  <h3 className="font-display font-bold text-white text-2xl uppercase leading-tight mb-3 group-hover:text-orange transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed mb-5">
                    Case studies are being prepared for owner review. This card summarises a published product family, not a named programme or customer result.
                  </p>
                  <div className="flex items-center justify-end border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2 text-orange">
                      <span className="font-mono text-xs uppercase tracking-wider">View Resources</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section className="home-section overflow-hidden news-morph-section py-24" ref={revealNews.ref}>
        <div className="news-morph-orb news-morph-orb-a" />
        <div className="news-morph-orb news-morph-orb-b" />
        <div className="pointer-events-none absolute inset-0 opacity-30 blueprint-grid" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <SectionLabel text="Latest News" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                News &amp; <br />Announcements
              </h2>
            </div>
            <button
              onClick={() => navigate('resources')}
              className="news-neu-chip text-orange font-mono text-sm uppercase tracking-widest hover:text-white transition-colors shrink-0 px-4 py-2.5 flex items-center gap-2"
            >
              All Resources <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {resourceNotices.map((article, i) => (
              <button
                key={article.title}
                onClick={() => navigate('resources')}
                className={`news-glass-card skeuo-orange text-left p-7 group reveal ${revealNews.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="news-neu-chip font-mono text-[11px] text-orange uppercase tracking-widest px-2.5 py-1">
                    {article.tag}
                  </span>
                  <span className="font-mono text-[11px] text-steel/70">0{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase leading-tight mb-3 group-hover:text-orange transition-colors">
                  {article.title}
                </h3>
                <p className="text-steel text-sm leading-relaxed mb-6">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-orange/70 group-hover:text-orange transition-colors">
                  <span className="font-mono text-xs uppercase tracking-wider">View Resources</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS HIGHLIGHT ── */}
      <section className="home-section overflow-hidden careers-morph-section py-24">
        <div className="careers-morph-orb left-[-3rem] top-[-3rem]" />
        <div className="careers-morph-orb right-[-2rem] bottom-[-4rem]" style={{ animationDelay: '1.4s' }} />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[11px] text-white/70 uppercase tracking-[0.22em] mb-3">Join Our Team</div>
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight drop-shadow-sm">
                Build the Future<br />of Aerospace
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="grid grid-cols-3 gap-3">
                {identityBand.slice(0, 3).map(s => (
                  <div key={s.label} className="careers-neu-stat px-4 py-3 min-w-[7.5rem]">
                    <div className="font-display font-bold text-white text-2xl lg:text-3xl">{s.val}</div>
                    <div className="font-mono text-[10px] text-white/75 uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('careers')}
                className="careers-skeuo-btn text-orange font-medium text-sm px-8 py-3.5 flex items-center gap-3 shrink-0"
              >
                Explore Careers
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="home-section isolate overflow-hidden py-24">
        <div className="absolute inset-0 bg-[#0A1426]" />
        <div className="absolute inset-0 opacity-55" aria-hidden="true">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={0.7}
            speed={0.22}
            distort={0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.2}
            rayCount={0}
            mixBlendMode="lighten"
            colors={['#ffffff', '#7EB6E8', '#003580']}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/25 to-navy/60 pointer-events-none" />
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 xl:px-12 text-center">
          <div className="font-mono text-[11px] text-orange uppercase tracking-[0.22em] mb-6">Ready to Work Together?</div>
          <h2 className="font-display font-black text-white text-5xl lg:text-7xl xl:text-8xl uppercase leading-none tracking-tight mb-6">
            Request a<br />Quote Today
          </h2>
          <p className="text-steel max-w-xl mx-auto leading-relaxed mb-10">
            Submit your engineering drawings, specifications, and delivery requirements. The quote form submits an enquiry to the company. Drawings are stored privately after a confirmed upload.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('quote')}
              className="bg-orange hover:bg-orange-light text-white font-bold text-sm px-10 py-4 flex items-center gap-3 transition-colors shadow-lg shadow-orange/25"
            >
              Submit RFQ
              <ArrowRight />
            </button>
            <button
              onClick={() => navigate('contact')}
              className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-10 py-4 transition-colors"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
