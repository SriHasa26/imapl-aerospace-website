import { useEffect, useState } from 'react'
import type { Page } from '../App'
import { photoClass } from '../content/imagePresentation'
import { images, videos } from '../content/assets'
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

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const publicInspection = isPublishable(inspectionProcesses.verificationStatus) ? inspectionProcesses.methods : []
const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []
const publicEquipment = inspectionEquipment.filter((item) => isPublishable(item.verificationStatus))
const publicMetrics = isPublishable(qualityMetricsPrototype.verificationStatus) ? qualityMetricsPrototype.items : []
const publicCerts = publishedCertifications.filter((cert) => isPublishable(cert.verificationStatus))
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

const processSteps = prototypeQualityProcesses.filter((process) => isPublishable(process.verificationStatus)).length > 0
  ? prototypeQualityProcesses.filter((process) => isPublishable(process.verificationStatus))
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

const labImage = images.inspectionContracer
const labImageAlt = 'MITUTOYO Contracer CV-2100'

export default function Quality({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Hero is always the first thing on the page, so reveal it on mount rather than
    // waiting for a scroll-triggered IntersectionObserver — gating it on scroll
    // position raced against the navigation scroll-to-top reset and could leave it
    // permanently hidden.
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['quality-metrics', 'quality-certs', 'quality-process', 'quality-lab']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(ids.map((id) => [id, true])))
      return () => window.cancelAnimationFrame(revealId)
    }

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
      window.cancelAnimationFrame(revealId)
      sectionObserver.disconnect()
    }
  }, [])

  return (
    <div className="quality-page">
      {/* Hero */}
      <section
        className={`quality-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <video
          className="quality-hero-video absolute inset-0 h-full w-full object-cover"
          src={videos.quality}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          ref={(node) => {
            if (node) node.playbackRate = 0.5
          }}
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.5
          }}
          onPlay={(e) => {
            e.currentTarget.playbackRate = 0.5
          }}
        />
        <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <SL text="Quality Assurance" />
          <h1 className="quality-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6 sm:whitespace-nowrap">
            Inspection &amp; Verification
          </h1>
          <p className="quality-lede text-steel max-w-2xl text-lg leading-relaxed mb-8">
            AS9100 Rev D and ISO 9001 certified processes — dimensional inspection, load testing, and part marking.
          </p>
          <blockquote className="quality-lede border-l-2 border-orange pl-5 max-w-2xl">
            <div className="font-mono text-xs text-orange uppercase tracking-widest mb-2">
              {publicPolicy ? 'Quality Policy Statement' : 'Inspection Process'}
            </div>
            <p className="text-white text-base sm:text-lg leading-relaxed">
              {`"${policyText}"`}
            </p>
            {publicPolicy && (
              <div className="mt-3 font-mono text-xs text-steel">— {publicPolicy.attribution}</div>
            )}
          </blockquote>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Key metrics */}
      <section
        id="quality-metrics"
        className="bg-off min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-metrics'] ? 'is-visible' : ''}`}>
          <SL text="Key Metrics" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            Quality By The Numbers
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {metricCards.map((stat) => (
              <div key={stat.label + stat.val} className="quality-card quality-card--light p-8 text-center">
                <div className="font-display font-black text-blue text-4xl lg:text-5xl mb-2">{stat.val}</div>
                <div className="font-mono text-xs text-navy uppercase tracking-widest">{stat.label}</div>
                <div className="font-mono text-xs text-mid mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / quality processes */}
      <section
        id="quality-certs"
        className="bg-navy min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-certs'] ? 'is-visible' : ''}`}>
          <SL text={publicCerts.length > 0 ? 'Certifications & Accreditations' : 'Quality Processes'} />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            {publicCerts.length > 0 ? (
              <>Globally Recognized<br />Standards</>
            ) : (
              <>Inspection &amp;<br />Part Marking</>
            )}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(publicCerts.length > 0
              ? publicCerts.map((cert) => ({ code: cert.code, name: cert.name, details: cert.details }))
              : processCards.map((card) => ({ code: card.code, name: card.name, details: card.details }))
            ).map((cert) => (
              <div key={cert.code} className="quality-card quality-card--dark p-7">
                <div className="font-display font-bold text-cyan text-3xl uppercase mb-1">{cert.code}</div>
                <div className="font-mono text-xs text-steel mb-5 tracking-wider">{cert.name}</div>
                <div className="space-y-2.5 border-t border-border-dark pt-4">
                  {cert.details.map(([k, v]) => (
                    <div key={`${k}-${v}`} className="flex items-start gap-3">
                      <div className="font-mono text-[11px] text-steel uppercase tracking-wider w-20 shrink-0 pt-0.5">{k}</div>
                      <div className="font-mono text-[11px] text-white">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section
        id="quality-process"
        className="bg-off min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-process'] ? 'is-visible' : ''}`}>
          <SL text="Quality Process" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            Built In, Not<br />Inspected In
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((p) => (
              <article key={p.step} className="quality-card quality-card--light p-7">
                <div className="font-mono text-[11px] text-blue font-semibold mb-4">{p.step}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3">{p.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Metrology equipment */}
      <section
        id="quality-lab"
        className="bg-navy min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-lab'] ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SL text="Metrology Equipment" />
              <h2 className="font-display font-bold text-white text-4xl uppercase leading-tight mb-6">
                {publicEquipment.length > 0 ? (
                  <>State-of-the-Art<br />Verification Lab</>
                ) : (
                  <>Load Testing &amp;<br />Part Marking</>
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
            <div className="industries-figure relative">
              <div className="industries-figure-well im-media-product">
                <img
                  src={labImage}
                  alt={labImageAlt}
                  className={`${photoClass(labImage, 'photo', 'landscape')} industries-figure-img`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="industries-figure-overlay" />
              <div className="industries-figure-corner industries-figure-corner--tl" />
              <div className="industries-figure-corner industries-figure-corner--tr" />
              <div className="industries-figure-corner industries-figure-corner--bl" />
              <div className="industries-figure-corner industries-figure-corner--br" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">Quality Documentation</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Use the quote form to request quality information. Certificate files are not published here.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Request Documents <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('contact')} className="btn-chamfer border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm tracking-wide px-8 py-4 transition-all duration-200 hover:-translate-y-0.5">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
