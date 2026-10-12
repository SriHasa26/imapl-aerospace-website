import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import { images } from '../content/assets'
import { photoClass } from '../content/imagePresentation'
import {
  geP23tf3,
  inspectionEquipment,
  inspectionProcesses,
  loadTesting,
  partMarking,
  publishedCertifications,
  prototypeQualityPolicy,
  prototypeQualityProcesses,
  qualityMetricsPrototype,
} from '../content/quality'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SL({ text }: { text: string }) {
  return (
    <div className="quality-eyebrow flex items-center gap-3 mb-3">
      <div className="quality-eyebrow-rule h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
    </div>
  )
}

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const publicInspection = isPublishable(inspectionProcesses.verificationStatus) ? inspectionProcesses.methods : []
const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []
const publicEquipment = inspectionEquipment.filter((item) => isPublishable(item.verificationStatus))
const publicMetrics = isPublishable(qualityMetricsPrototype.verificationStatus) ? qualityMetricsPrototype.items : []
const publicCerts = publishedCertifications.filter((cert) => isPublishable(cert.verificationStatus))
const publicProcesses = prototypeQualityProcesses.filter((process) => isPublishable(process.verificationStatus))
const publicPolicy = isPublishable(prototypeQualityPolicy.verificationStatus) ? prototypeQualityPolicy : undefined
const showGeP23tf3 = isPublishable(geP23tf3.verificationStatus)

const processCards = [
  publicInspection.length > 0 ? { code: 'Inspection', name: 'In-process and final inspection', details: publicInspection.map((method) => ['Method', method] as const) } : undefined,
  publicLoadTesting.length > 0 ? { code: 'Load Testing', name: 'Aerospace tools, fixtures, and assemblies', details: publicLoadTesting.map((method) => ['Method', method] as const) } : undefined,
  publicPartMarking.length > 0 ? { code: 'Part Marking', name: 'Marking to customer specification', details: publicPartMarking.map((method) => ['Method', method] as const) } : undefined,
].filter((card): card is NonNullable<typeof card> => Boolean(card))

const identityMetrics = [
  { val: 'Inspect', label: 'Dimensional', sub: publicInspection[0] ?? 'Inspection' },
  { val: 'Geometry', label: 'Verification', sub: publicInspection[1] ?? 'Inspection' },
  { val: 'Load', label: 'Testing', sub: publicLoadTesting[0] ?? 'Load testing' },
  { val: 'Mark', label: 'Part Marking', sub: publicPartMarking[0] ?? 'Part marking' },
]

const metricCards = publicMetrics.length > 0
  ? publicMetrics.map((item) => ({ val: item, label: 'Quality metric', sub: 'Production data' }))
  : identityMetrics

const processSteps = publicProcesses.length > 0
  ? publicProcesses
  : [
      ...publicInspection.map((method, index) => ({
        step: String(index + 1).padStart(2, '0'),
        title: method,
        desc: 'In-process and final inspection.',
      })),
      ...publicLoadTesting.map((method, index) => ({
        step: String(publicInspection.length + index + 1).padStart(2, '0'),
        title: method,
        desc: 'Load testing of aerospace tools, fixtures, and assemblies.',
      })),
    ].slice(0, 6)

const equipmentRows = publicEquipment.length > 0
  ? publicEquipment.map((item) => [item.name, item.details[0] ?? ''] as const)
  : [
      ...publicLoadTesting.map((method) => [method, 'Load testing'] as const),
      ...publicPartMarking.map((method) => [method, showGeP23tf3 ? 'Including GE P23TF3' : 'Part marking'] as const),
    ]

const policyText = publicPolicy?.statement
  ?? 'In-process and final inspection includes dimensional, geometric, and surface-finish verification and pre-dispatch inspection.'

function moduleKey(val: string): string {
  const key = val.toLowerCase().replace(/[^a-z]/g, '')
  if (key.includes('inspect')) return 'inspect'
  if (key.includes('geometry')) return 'geometry'
  if (key.includes('load')) return 'load'
  if (key.includes('mark')) return 'mark'
  return 'generic'
}

export default function Quality({ navigate }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['quality-metrics', 'quality-certs', 'quality-process', 'quality-lab']
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
      { threshold: 0.16 },
    )
    if (hero) heroObserver.observe(hero)

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => (
              prev[entry.target.id] ? prev : { ...prev, [entry.target.id]: true }
            ))
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) sectionObserver.observe(el)
    })

    return () => {
      heroObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  return (
    <div className="quality-page">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`quality-hero relative overflow-hidden ${heroVisible ? 'is-visible' : ''}`}
      >
        <div className="absolute inset-0">
          <img src={images.qualityHeroImage} alt="Mitutoyo CMM inspection" className={`${photoClass(images.qualityHeroImage, 'decorative')} opacity-[0.55]`} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/72 via-navy/38 to-navy/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/68 via-transparent to-navy/16" />
        </div>
        <div className="quality-hero-ambient" aria-hidden="true" />
        <div className="quality-hero-grid" aria-hidden="true" />
        <div className="quality-hero-scan" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="quality-crumb font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Quality</span>
          </div>
          <SL text="Quality Assurance" />
          <h1 className="quality-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Inspection.<br />Verification.
          </h1>
          <p className="quality-lede text-steel max-w-2xl text-lg leading-relaxed">
            Inspection, NDT, load testing, and part marking — with AS9100 Rev D and ISO 9001 certified processes.
          </p>
        </div>
      </section>

      {/* Quality Policy / sourced process language */}
      <section className="quality-policy bg-orange">
        <div className="quality-policy-grid" aria-hidden="true" />
        <div className="quality-policy-inner relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-white/80 uppercase tracking-widest mb-1.5">
            {publicPolicy ? 'Quality Policy Statement' : 'Inspection Process'}
          </div>
          <blockquote className="quality-policy-quote font-display font-bold text-white text-2xl lg:text-3xl uppercase leading-tight">
            {`"${policyText}"`}
          </blockquote>
          {publicPolicy && (
            <div className="mt-3 font-mono text-xs text-white/80">— {publicPolicy.attribution}</div>
          )}
        </div>
      </section>

      {/* Key metrics */}
      <section
        id="quality-metrics"
        className={`quality-metrics ${revealed['quality-metrics'] ? 'is-visible' : ''}`}
      >
        <div className="quality-metrics-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="quality-modules">
            {metricCards.map((stat, index) => (
              <div
                key={stat.label + stat.val}
                className={`quality-module quality-module--${moduleKey(stat.val)}`}
                style={{ '--quality-stagger': `${index * 80}ms` } as CSSProperties}
              >
                <div className="quality-module-fx" aria-hidden="true" />
                <div className="font-display font-black text-blue text-4xl lg:text-5xl mb-2">{stat.val}</div>
                <div className="font-mono text-xs text-navy uppercase tracking-widest">{stat.label}</div>
                <div className="font-mono text-xs text-mid mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="quality-blend quality-blend--to-dark" aria-hidden="true" />

      {/* Certifications / quality processes */}
      <section
        id="quality-certs"
        className={`quality-certs ${revealed['quality-certs'] ? 'is-visible' : ''}`}
      >
        <div className="quality-certs-ambient" aria-hidden="true" />
        <div className="quality-certs-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text={publicCerts.length > 0 ? 'Certifications & Accreditations' : 'Quality Processes'} />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            {publicCerts.length > 0 ? (
              <>
                Globally Recognized<br />Standards
              </>
            ) : (
              <>
                Inspection &<br />Part Marking
              </>
            )}
          </h2>
          <div className="quality-cert-grid">
            {(publicCerts.length > 0 ? publicCerts.map((cert) => ({
              code: cert.code,
              name: cert.name,
              details: cert.details,
              year: undefined as string | undefined,
            })) : processCards.map((card) => ({
              code: card.code,
              name: card.name,
              details: card.details,
              year: undefined as string | undefined,
            }))).map((cert, index) => (
              <div
                key={cert.code}
                className="quality-cert"
                style={{ '--quality-stagger': `${index * 90}ms` } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="quality-cert-code font-display font-bold text-cyan text-3xl uppercase">{cert.code}</div>
                    <div className="font-mono text-xs text-steel mt-1 tracking-wider">{cert.name}</div>
                  </div>
                  {cert.year && (
                    <div className="border border-cyan/30 px-3 py-2 text-center shrink-0">
                      <div className="font-mono text-[11px] text-steel uppercase tracking-wider">Issued</div>
                      <div className="font-mono text-[11px] text-cyan mt-0.5">{cert.year}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-2.5">
                  {cert.details.map(([k, v]) => (
                    <div key={`${k}-${v}`} className="flex items-start gap-3">
                      <div className="font-mono text-[11px] text-steel uppercase tracking-wider w-24 shrink-0 pt-0.5">{k}</div>
                      <div className="font-mono text-[11px] text-white">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="quality-blend quality-blend--to-light" aria-hidden="true" />

      {/* Quality Process */}
      <section
        id="quality-process"
        className={`quality-process ${revealed['quality-process'] ? 'is-visible' : ''}`}
      >
        <div className="quality-process-ambient" aria-hidden="true" />
        <div className="quality-process-grid-bg" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text="Quality Process" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            Built In, Not<br />Inspected In
          </h2>
          <div className="quality-process-grid">
            {processSteps.map((p, index) => (
              <article
                key={p.step}
                className="quality-step"
                style={{ '--quality-stagger': `${index * 80}ms` } as CSSProperties}
              >
                <div className="quality-step-node" aria-hidden="true" />
                <div className="font-mono text-[11px] text-blue font-semibold mb-4">{p.step}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3">{p.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="quality-blend quality-blend--to-dark" aria-hidden="true" />

      {/* Equipment */}
      <section
        id="quality-lab"
        className={`quality-lab ${revealed['quality-lab'] ? 'is-visible' : ''}`}
      >
        <div className="quality-lab-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="quality-lab-copy">
              <SL text="Metrology Equipment" />
              <h2 className="font-display font-bold text-white text-4xl uppercase leading-tight mb-6">
                {publicEquipment.length > 0 ? (
                  <>
                    State-of-the-Art<br />Verification Lab
                  </>
                ) : (
                  <>
                    Load Testing &<br />Part Marking
                  </>
                )}
              </h2>
              <p className="text-steel leading-relaxed mb-8">
                {publicEquipment.length > 0
                  ? 'Coordinate measuring and inspection systems used for dimensional verification.'
                  : 'Load testing and part-marking methods. Named instruments are not presented as the current fleet.'}
              </p>
              {equipmentRows.length > 0 && (
                <div className="space-y-3">
                  {equipmentRows.map(([eq, spec]) => (
                    <div key={eq} className="flex items-start gap-4 border-b border-border-dark pb-3">
                      <div className="w-1.5 h-1.5 bg-cyan mt-2 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">{eq}</div>
                        <div className="font-mono text-xs text-steel mt-0.5">{spec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="quality-figure relative">
                <div className="quality-figure-well im-media-product">
                  <img src={images.inspectionContracer} alt="MITUTOYO Contracer CV-2100" className={`${photoClass(images.inspectionContracer, 'photo', 'landscape')} quality-figure-img`} loading="lazy" decoding="async" />
                </div>
                <div className="quality-figure-overlay" />
                <div className="quality-figure-corner quality-figure-corner--tl" />
                <div className="quality-figure-corner quality-figure-corner--tr" />
                <div className="quality-figure-corner quality-figure-corner--bl" />
                <div className="quality-figure-corner quality-figure-corner--br" />
              </div>
              <div className="quality-figure relative">
                <div className="quality-figure-well im-media-product">
                  <img src={images.qualityGaugeImage} alt="TRIMOS VT1000MA" className={`${photoClass(images.qualityGaugeImage, 'photo', 'landscape')} quality-figure-img`} loading="lazy" decoding="async" />
                </div>
                <div className="quality-figure-overlay" />
                <div className="quality-figure-corner quality-figure-corner--tl" />
                <div className="quality-figure-corner quality-figure-corner--tr" />
                <div className="quality-figure-corner quality-figure-corner--bl" />
                <div className="quality-figure-corner quality-figure-corner--br" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Quality Documentation</h2>
            <p className="text-white/70 mt-2">Use the quote form to request quality information. Certificate files are not published here.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('quote')} className="bg-white text-orange hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors">
              Request Documents <AR />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
