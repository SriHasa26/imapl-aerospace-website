import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Page } from '../App'
import { images } from '../content/assets'
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
  prototypeHomeHeroStats,
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
  prototypeCertificationCards,
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

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-cyan" />
      <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">{text}</span>
    </div>
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

const publicHeroNumericStats = prototypeHomeHeroStats.filter((stat) => isPublishable(stat.verificationStatus))
const identityHeroStats = [
  { val: shortName.value, label: 'Aerospace Manufacturing', sub: officialName.value },
  { val: 'MRO', label: 'Tooling Solutions', sub: publicWorkAreas[2] ?? 'MRO Tooling' },
  { val: 'CNC', label: 'Precision Components', sub: publicWorkAreas[1] ?? 'Precision Aerospace Components' },
  { val: 'GSE', label: 'Ground Support', sub: 'Tooling & Fixtures' },
]
const heroStats = publicHeroNumericStats.length > 0
  ? publicHeroNumericStats.map((stat) => ({ val: stat.val, label: stat.label, sub: stat.sub }))
  : identityHeroStats

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
}))

const publicInspection = isPublishable(inspectionProcesses.verificationStatus) ? inspectionProcesses.methods : []
const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []
const publicCerts = prototypeCertificationCards.filter((cert) => isPublishable(cert.verificationStatus))
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

export default function Home({ navigate }: Props) {
  const revealCaps = useReveal()
  const revealIndustries = useReveal()
  const revealWorkflow = useReveal()
  const revealNews = useReveal()

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-navy">
        <div className="absolute inset-0 blueprint-grid" />
        <div className="absolute inset-0 blueprint-grid-fine opacity-40" />
        <div className="absolute inset-0">
          <img
            src={images.heroImage}
            alt="Igniting Minds Aerospace manufacturing facility"
            className="w-full h-full object-cover opacity-[0.13]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-transparent to-navy" />
        </div>

        {/* HUD decorations */}
        <div className="absolute top-24 left-8 lg:left-12 font-mono text-[9px] text-cyan/30 space-y-1 pt-4 select-none">
          <div>{shortName.value}</div>
          <div>AEROSPACE</div>
          <div>MANUFACTURING</div>
          <div className="mt-2 text-cyan/20">SYS: NOMINAL</div>
        </div>
        <div className="absolute top-24 right-8 lg:right-12 font-mono text-[9px] text-cyan/30 space-y-1 pt-4 text-right select-none">
          {publicFoundingYear && <div>EST. {publicFoundingYear}</div>}
          {publicHeadquarters && <div>{publicHeadquarters}</div>}
          <div className="text-cyan/20">ENGINEERING</div>
          <div className="text-cyan/20">TOOLING</div>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-24 left-8 w-6 h-6 border-l border-t border-cyan/20 mt-3 ml-3" />
        <div className="absolute top-24 right-8 w-6 h-6 border-r border-t border-cyan/20 mt-3 mr-3" />

        {/* Main content */}
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12 pt-32 pb-20">
          <div className="max-w-5xl anim-fade-up">
            <SectionLabel text="Aerospace Engineering & Manufacturing" />
            <h1 className="font-display font-black text-white uppercase leading-[0.92] tracking-tight text-[clamp(3.5rem,9vw,9rem)]">
              IGNITING<br />
              THE FUTURE<br />
              <span className="text-cyan">OF FLIGHT</span>
            </h1>
            <p className="mt-8 max-w-xl text-steel text-base lg:text-lg leading-relaxed">
              {description.value}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('capabilities')}
                className="bg-blue hover:bg-blue-light text-white font-medium text-sm px-8 py-4 flex items-center gap-3 transition-colors duration-200"
              >
                Explore Capabilities
                <ArrowRight />
              </button>
              <button
                onClick={() => navigate('quote')}
                className="border border-cyan/50 text-cyan hover:bg-cyan/8 font-medium text-sm px-8 py-4 flex items-center gap-3 transition-colors duration-200"
              >
                Request a Quote
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-auto pt-20">
            <div className="border-t border-border-dark pt-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {heroStats.map(stat => (
                <div key={stat.label}>
                  <div className="font-display font-black text-white text-4xl lg:text-5xl tracking-tight">{stat.val}</div>
                  <div className="font-mono text-[9px] text-cyan uppercase tracking-[0.18em] mt-2">{stat.label}</div>
                  <div className="font-mono text-[9px] text-steel/70 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IDENTITY BAND ── */}
      <section className="bg-blue py-14">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
            {identityBand.map((item) => (
              <div key={item.label}>
                <div className="font-display font-black text-white text-5xl lg:text-6xl tracking-tight">
                  {item.val}
                </div>
                <div className="font-mono text-[9px] text-white/60 uppercase tracking-widest mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW ── */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden bg-navy">
                <img
                  src={images.manufacturingImage}
                  alt="Igniting Minds Aerospace manufacturing team"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Technical overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-navy/80 backdrop-blur-sm border-t border-border-dark p-4">
                <div className="grid grid-cols-3 gap-4">
                  {overviewOverlay.map(s => (
                    <div key={s.label} className="text-center">
                      <div className="font-display font-bold text-white text-xl">{s.val}</div>
                      <div className="font-mono text-[8px] text-cyan tracking-widest">{s.unit} · {s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Corner bracket */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan/60" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan/60" />
            </div>

            <div>
              <SectionLabel text="Company Overview" />
              <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-6">
                Engineering Excellence<br />
                <span className="text-blue">At Every Scale</span>
              </h2>
              <p className="text-mid leading-relaxed mb-6">
                {companySummary}
              </p>
              <p className="text-mid leading-relaxed mb-8">
                Work areas include aero-engine tooling, precision aerospace components, MRO tooling, and integrated engineering and manufacturing.
              </p>
              <ul className="space-y-3 mb-10">
                {overviewList.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-mid">
                    <div className="w-4 h-4 border border-cyan flex items-center justify-center shrink-0 mt-0.5">
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('about')}
                className="bg-navy hover:bg-navy-light text-white font-medium text-sm px-7 py-3.5 flex items-center gap-3 transition-colors w-fit"
              >
                Learn About Us
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div ref={revealCaps.ref} className={`reveal ${revealCaps.visible ? 'visible' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <SectionLabel text="Manufacturing Capabilities" />
                <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                  Precision At<br />Every Process
                </h2>
              </div>
              <button
                onClick={() => navigate('capabilities')}
                className="flex items-center gap-2 text-cyan font-mono text-[11px] uppercase tracking-widest hover:text-white transition-colors shrink-0"
              >
                All Capabilities <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
            {homeCapabilities.map((cap, i) => (
              <button
                type="button"
                key={cap.num}
                className={`bg-navy-mid p-8 hover:bg-navy-light transition-colors duration-300 group text-left reveal ${revealCaps.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => navigate('capabilities')}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-cyan group-hover:text-white transition-colors">{cap.icon}</div>
                  <span className="font-mono text-[11px] text-steel/50">{cap.num}</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase tracking-wide mb-3 group-hover:text-cyan transition-colors">
                  {cap.title}
                </h3>
                <p className="text-steel text-sm leading-relaxed mb-5">{cap.desc}</p>
                <ul className="space-y-1.5">
                  {cap.items.map(item => (
                    <li key={item} className="font-mono text-[10px] text-steel/70 flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyan/50 shrink-0" />
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
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div ref={revealIndustries.ref} className={`reveal ${revealIndustries.visible ? 'visible' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <SectionLabel text="Industries Served" />
                <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight">
                  Aerospace<br />Manufacturing
                </h2>
              </div>
              <button
                onClick={() => navigate('industries')}
                className="flex items-center gap-2 text-blue font-mono text-[11px] uppercase tracking-widest hover:text-navy transition-colors shrink-0"
              >
                All Industries <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicIndustries.map((ind, i) => (
              <button
                key={ind.id}
                onClick={() => navigate('industries')}
                className={`relative overflow-hidden aspect-[4/3] text-left group reveal ${revealIndustries.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <img
                  src={ind.image ? images[ind.image] : images.manufacturingImage}
                  alt={ind.industry}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display font-bold text-white text-2xl uppercase leading-tight">{ind.industry}</h3>
                  <p className="font-mono text-[10px] text-cyan/80 mt-1 tracking-wider">{ind.workAreas?.[0] ?? 'Aerospace'}</p>
                  <div className="mt-3 flex items-center gap-2 text-white/0 group-hover:text-white/80 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Learn more</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-navy py-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel text="Featured Products" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                Built for Critical<br />Applications
              </h2>
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-2 text-cyan font-mono text-[11px] uppercase tracking-widest hover:text-white transition-colors shrink-0"
            >
              All Products <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-border-dark">
            {featuredProducts.map(product => {
              const img = productImageSrc(product.image) ?? images.precisionComponents
              const specs = publicProductSpecs(product).slice(0, 3)
              return (
                <button
                  key={product.id}
                  onClick={() => navigate('products')}
                  className="bg-navy-mid text-left group hover:bg-navy-light transition-colors duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-navy">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-7">
                    <div className="font-mono text-[9px] text-cyan uppercase tracking-widest mb-3">{product.category}</div>
                    <h3 className="font-display font-bold text-white text-xl uppercase leading-tight mb-3 group-hover:text-cyan transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-steel text-sm leading-relaxed mb-5">{product.shortDescription}</p>
                    {specs.length > 0 && (
                      <div className="border-t border-border-dark pt-4 grid grid-cols-3 gap-3">
                        {specs.map((spec) => (
                          <div key={spec.label}>
                            <div className="font-mono text-[8px] text-steel/60 uppercase tracking-wider">{spec.label}</div>
                            <div className="font-mono text-[11px] text-white mt-0.5">{spec.value}</div>
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
      <section className="bg-off py-24">
        <div ref={revealWorkflow.ref} className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className={`reveal ${revealWorkflow.visible ? 'visible' : ''}`}>
            <SectionLabel text="Our Process" />
            <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-16">
              From Brief<br />To Finished Part
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border-light" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8">
              {workflow.map((step, i) => (
                <div
                  key={step.step}
                  className={`relative reveal ${revealWorkflow.visible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-navy flex items-center justify-center mb-5 relative z-10 border border-border-dark group-hover:border-cyan transition-colors">
                    <span className="font-mono text-cyan text-sm font-semibold">{step.step}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg uppercase leading-tight mb-2">{step.title}</h3>
                  <p className="text-mid text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUALITY ── */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel text="Quality Assurance" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-6">
                Inspection.<br />Load Testing. Marking.
              </h2>
              <p className="text-steel leading-relaxed mb-8">
                Dimensional, geometric, and surface-finish inspection, pre-dispatch inspection, load testing, and part marking — as listed in the quality model.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {qualityCards.map(item => (
                  <div key={item.cert} className="border border-border-dark p-4 hover:border-cyan/50 transition-colors">
                    <div className="font-display font-bold text-cyan text-lg uppercase">{item.cert}</div>
                    <div className="font-mono text-[10px] text-steel mt-1 tracking-wider">{item.desc}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('quality')}
                className="flex items-center gap-2 text-cyan font-mono text-[11px] uppercase tracking-widest hover:text-white transition-colors"
              >
                View Quality Policy <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden">
                <img
                  src={images.qualityImage}
                  alt="Precision inspection equipment"
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-navy/60 via-transparent to-transparent" />
              </div>
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                {qualityOverlay.map(s => (
                  <div key={s.label} className="bg-navy/85 backdrop-blur border border-border-dark p-3">
                    <div className="font-display font-bold text-cyan text-lg">{s.val}</div>
                    <div className="font-mono text-[8px] text-steel mt-0.5 tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITY ── */}
      <section className="relative py-32 overflow-hidden">
        <img
          src={images.facilityImage}
          alt="Igniting Minds Aerospace manufacturing facility"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/40" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="max-w-2xl">
            <SectionLabel text="Our Facility" />
            <h2 className="font-display font-bold text-white text-4xl lg:text-6xl uppercase leading-tight mb-6">
              Aerospace<br />Manufacturing
            </h2>
            <p className="text-steel text-base leading-relaxed mb-10">
              {description.value} Facility photography is shown as visual context. Disputed location, area, and machine-count figures are not published here.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {facilityStats.map(s => (
                <div key={s.label}>
                  <div className="font-display font-black text-white text-4xl">{s.val}</div>
                  <div className="font-mono text-[9px] text-cyan mt-1 uppercase tracking-widest">{s.label}</div>
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
      <section className="bg-navy-mid py-24 border-y border-border-dark">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel text="Work Areas" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-6">
                Engineering &<br />Manufacturing
              </h2>
              <p className="text-steel leading-relaxed mb-8">
                {description.value}
              </p>
              <div className="grid grid-cols-3 gap-6">
                {reachChips.map(s => (
                  <div key={s.label} className="border-l border-cyan/30 pl-4">
                    <div className="font-display font-bold text-white text-4xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-cyan mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG World map placeholder */}
            <div className="relative bg-navy border border-border-dark p-8 aspect-[16/9]">
              <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-4">Manufacturing</div>
              {/* Simplified world grid */}
              <svg viewBox="0 0 400 200" className="w-full h-full opacity-60">
                <defs>
                  <pattern id="mapgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,180,216,0.15)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="400" height="200" fill="url(#mapgrid)"/>
                {/* Simplified continent outlines */}
                <path d="M60 60 Q80 40 120 50 Q140 45 150 65 Q145 90 120 100 Q90 105 70 90 Z" fill="none" stroke="rgba(0,180,216,0.3)" strokeWidth="1"/>
                <path d="M155 40 Q200 30 240 45 Q260 50 265 80 Q260 110 230 120 Q200 125 175 110 Q155 95 155 75 Z" fill="none" stroke="rgba(0,180,216,0.3)" strokeWidth="1"/>
                <path d="M270 50 Q310 35 350 50 Q370 60 365 90 Q355 115 330 120 Q300 125 280 110 Q265 95 270 70 Z" fill="none" stroke="rgba(0,180,216,0.3)" strokeWidth="1"/>
                <path d="M40 120 Q60 110 80 120 Q90 130 85 150 Q80 165 60 165 Q40 160 35 145 Z" fill="none" stroke="rgba(0,180,216,0.3)" strokeWidth="1"/>
                {/* Dots for key locations */}
                {[
                  [200, 65], [300, 58], [110, 55], [360, 62], [60, 60], [230, 120],
                ].map(([cx, cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#00B4D8" opacity="0.9"/>
                    <circle cx={cx} cy={cy} r="6" fill="none" stroke="#00B4D8" strokeWidth="0.5" opacity="0.4"/>
                  </g>
                ))}
                {/* Lines connecting dots */}
                <line x1="200" y1="65" x2="300" y2="58" stroke="rgba(0,180,216,0.2)" strokeWidth="0.5" strokeDasharray="3 3"/>
                <line x1="110" y1="55" x2="200" y2="65" stroke="rgba(0,180,216,0.2)" strokeWidth="0.5" strokeDasharray="3 3"/>
                <line x1="200" y1="65" x2="360" y2="62" stroke="rgba(0,180,216,0.2)" strokeWidth="0.5" strokeDasharray="3 3"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel text="Case Studies" />
              <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight">
                Resources Being<br />Updated
              </h2>
            </div>
            <button
              onClick={() => navigate('resources')}
              className="flex items-center gap-2 text-blue font-mono text-[11px] uppercase tracking-widest hover:text-navy transition-colors shrink-0"
            >
              All Resources <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredProducts.slice(0, 2).map((product) => (
              <button
                key={product.id}
                onClick={() => navigate('resources')}
                className="text-left bg-navy group overflow-hidden hover:ring-1 hover:ring-cyan/30 transition-all"
              >
                <div className="aspect-[16/7] overflow-hidden relative">
                  <img
                    src={productImageSrc(product.image) ?? images.precisionComponents}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan uppercase tracking-widest border border-cyan/30 px-2 py-1 bg-navy/60 backdrop-blur">
                    {product.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-2">Documentation</div>
                  <h3 className="font-display font-bold text-white text-2xl uppercase leading-tight mb-3 group-hover:text-cyan transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed mb-6">
                    Case studies are being prepared for owner review. This card summarises a published product family, not a named programme or customer result.
                  </p>
                  <div className="flex items-center gap-8 border-t border-border-dark pt-5">
                    <div className="ml-auto flex items-center gap-2 text-cyan/0 group-hover:text-cyan transition-colors">
                      <span className="font-mono text-[10px] uppercase tracking-wider">View Resources</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section className="bg-navy py-24" ref={revealNews.ref}>
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel text="Latest News" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                News &<br />Announcements
              </h2>
            </div>
            <button
              onClick={() => navigate('resources')}
              className="flex items-center gap-2 text-cyan font-mono text-[11px] uppercase tracking-widest hover:text-white transition-colors shrink-0"
            >
              All Resources <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-px bg-border-dark">
            {resourceNotices.map((article, i) => (
              <button
                key={article.title}
                onClick={() => navigate('resources')}
                className={`bg-navy-mid text-left p-8 hover:bg-navy-light transition-colors group reveal ${revealNews.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[9px] text-cyan uppercase tracking-widest border border-cyan/25 px-2 py-0.5">{article.tag}</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase leading-tight mb-3 group-hover:text-cyan transition-colors">
                  {article.title}
                </h3>
                <p className="text-steel text-sm leading-relaxed mb-6">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-cyan/50 group-hover:text-cyan transition-colors">
                  <span className="font-mono text-[10px] uppercase tracking-wider">View Resources</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS HIGHLIGHT ── */}
      <section className="bg-blue py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[9px] text-white/50 uppercase tracking-[0.22em] mb-3">Join Our Team</div>
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                Build the Future<br />of Aerospace
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="grid grid-cols-3 gap-8">
                {identityBand.slice(0, 3).map(s => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-white/60 uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('careers')}
                className="bg-white text-blue hover:bg-off font-medium text-sm px-8 py-4 flex items-center gap-3 transition-colors shrink-0"
              >
                Explore Careers
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-navy py-28 blueprint-grid">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <div className="font-mono text-[9px] text-cyan uppercase tracking-[0.22em] mb-6">Ready to Work Together?</div>
          <h2 className="font-display font-black text-white text-5xl lg:text-7xl xl:text-8xl uppercase leading-none tracking-tight mb-6">
            Request a<br />Quote Today
          </h2>
          <p className="text-steel max-w-xl mx-auto leading-relaxed mb-12">
            Submit your engineering drawings, specifications, and delivery requirements. The quote form submits an enquiry to the company. Drawings are stored privately after a confirmed upload.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('quote')}
              className="bg-cyan hover:bg-cyan/90 text-navy font-bold text-sm px-10 py-4 flex items-center gap-3 transition-colors"
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
