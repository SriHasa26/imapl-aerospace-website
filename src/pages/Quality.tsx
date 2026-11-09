import { useEffect, useState } from 'react'
import type { Page } from '../App'
import { images, videos } from '../content/assets'
import {
  loadTesting,
  partMarking,
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

const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []

const capabilityCards = [
  {
    number: '01',
    title: 'DIMENSIONAL INSPECTION',
    desc: 'Precision measurement and dimensional verification against engineering drawings.',
  },
  {
    number: '02',
    title: 'GEOMETRIC VERIFICATION',
    desc: 'Verification of geometric tolerances and critical component features.',
  },
  {
    number: '03',
    title: 'LOAD TESTING',
    desc: 'Dead-weight load testing against specified acceptance criteria.',
  },
  {
    number: '04',
    title: 'PART MARKING',
    desc: 'Chemical etching and component identification as per customer requirements.',
  },
]

const certificationCards = [
  { title: 'AS9100 Rev D', description: 'Aerospace Quality Management System' },
  { title: 'ISO 9001', description: 'Quality Management System' },
]

const processSteps = [
  {
    step: '01',
    title: 'DIMENSIONAL INSPECTION',
    desc: 'Precision measurement of critical dimensions.',
    image: images.qualityDimensionalInspection,
    alt: 'Dimensional inspection using precision instruments in QA lab',
  },
  {
    step: '02',
    title: 'GEOMETRIC INSPECTION',
    desc: 'Verification of GD&T and geometric tolerances.',
    image: images.qualityGeometricInspection,
    alt: 'Mitutoyo Contracer CV-2100 geometric contour measurement setup',
  },
  {
    step: '03',
    title: 'CMM PROGRAMMING & INSPECTION',
    desc: 'Programmed measurement of complex geometries.',
    image: images.qualityCmmInspection,
    alt: 'Mitutoyo CMM machine inspecting precision aerospace component',
  },
  {
    step: '04',
    title: 'NON-DESTRUCTIVE TESTING (NDT)',
    desc: 'Inspection for internal and surface defects.',
    image: images.qualityNdtInspection,
    alt: 'Non-destructive testing and penetrant surface flaw inspection',
  },
  {
    step: '05',
    title: 'PRE-DISPATCH INSPECTION',
    desc: 'Final verification of quality and specifications.',
    image: images.qualityPreDispatchInspection,
    alt: 'Final component verification and quality inspection documentation review',
  },
  {
    step: '06',
    title: 'DEAD WEIGHT LOAD TESTING',
    desc: 'Load testing of tools, fixtures, and assemblies.',
    image: images.qualityLoadTesting,
    alt: 'Actual dead-weight load-testing setup and calibration blocks',
  },
]

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
    const ids = ['quality-metrics', 'quality-certs', 'quality-process']
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
          <SL text="QUALITY ASSURANCE" />
          <h1 className="quality-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            <span className="block">PRECISION.</span>
            <span className="block">QUALITY.</span>
            <span className="block">TRACEABILITY.</span>
          </h1>
          <p className="quality-lede text-steel max-w-2xl text-lg leading-relaxed mb-8">
            Quality controls built around aerospace requirements, from in-process inspection to final verification and dispatch.
          </p>
          <blockquote className="quality-lede border-l-2 border-orange pl-5 max-w-2xl">
            <div className="font-mono text-xs text-orange uppercase tracking-widest mb-2">
              INSPECTION PROCESS
            </div>
            <p className="text-white text-base sm:text-lg leading-relaxed">
              In-process and final inspections verify dimensional accuracy, geometric tolerances, surface finish, and compliance with customer specifications.
            </p>
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
        className="bg-off min-h-screen flex items-center py-20 sm:py-24 lg:py-32"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-metrics'] ? 'is-visible' : ''}`}>
          <SL text="QUALITY ASSURANCE" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            INSPECTION &amp; TESTING CAPABILITIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityCards.map((card) => (
              <div key={card.number} className="quality-card quality-card--light p-7 sm:p-8 flex flex-col h-full">
                <div className="font-mono text-[11px] text-blue font-semibold mb-4 tracking-wider">{card.number}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3 min-h-[3.25rem] flex items-start leading-snug">{card.title}</h3>
                <p className="text-mid text-sm leading-relaxed mt-auto">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / quality processes */}
      <section
        id="quality-certs"
        className="bg-navy min-h-screen flex items-center py-20 sm:py-24 lg:py-32"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-certs'] ? 'is-visible' : ''}`}>
          <SL text="CERTIFICATIONS & ACCREDITATIONS" />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            COMMITTED TO QUALITY STANDARDS
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {certificationCards.map((cert) => (
              <div key={cert.title} className="quality-card quality-card--dark p-7">
                <div className="font-display font-bold text-cyan text-3xl uppercase">{cert.title}</div>
                <div className="font-mono text-xs text-steel mt-2 tracking-wider">{cert.description}</div>
              </div>
            ))}
          </div>
          <p className="text-steel max-w-3xl text-base leading-relaxed mt-10">
            Our quality systems support process consistency, product conformity, traceability, and continuous improvement across aerospace manufacturing operations.
          </p>
        </div>
      </section>

      {/* Quality Process */}
      <section
        id="quality-process"
        className="bg-off min-h-screen flex items-center py-20 sm:py-24 lg:py-32 pb-24 sm:pb-32 lg:pb-40"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-process'] ? 'is-visible' : ''}`}>
          <SL text="QUALITY PROCESS" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            BUILT IN, NOT<br />INSPECTED IN
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {processSteps.map((p) => (
              <article
                key={p.step}
                className="quality-card quality-card--light flex flex-col h-full overflow-hidden group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-mid border-b border-border-light/60">
                  <img
                    src={p.image}
                    alt={p.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 font-mono text-[11px] text-cyan bg-navy/85 backdrop-blur-xs px-2.5 py-1 uppercase tracking-widest font-semibold border border-cyan/30">
                    {p.step}
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="font-mono text-[11px] text-blue font-semibold uppercase tracking-wider mb-2">
                    STEP {p.step}
                  </div>
                  <h3 className="font-display font-bold text-navy text-xl uppercase mb-3 min-h-[3rem] flex items-start leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-mid text-sm leading-relaxed mt-auto">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange min-h-screen flex items-center py-20 sm:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">QUALITY DOCUMENTATION</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Access IMA’s quality certifications and supporting documentation to support your supplier qualification and compliance requirements.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Request Quality Documents <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('contact')} className="btn-chamfer border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm tracking-wide px-8 py-4 transition-all duration-200 hover:-translate-y-0.5">
              Contact Quality Team
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
