import { useEffect, useState } from 'react'
import type { Page } from '../App'
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
  { step: '01', title: 'DIMENSIONAL INSPECTION', desc: 'Precision measurement of critical dimensions.' },
  { step: '02', title: 'GEOMETRIC INSPECTION', desc: 'Verification of GD&T and geometric tolerances.' },
  { step: '03', title: 'CMM PROGRAMMING & INSPECTION', desc: 'Programmed measurement of complex geometries.' },
  { step: '04', title: 'NON-DESTRUCTIVE TESTING (NDT)', desc: 'Inspection for internal and surface defects.' },
  { step: '05', title: 'PRE-DISPATCH INSPECTION', desc: 'Final verification of quality and specifications.' },
  { step: '06', title: 'DEAD WEIGHT LOAD TESTING', desc: 'Load testing of tools, fixtures, and assemblies.' },
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
      <section className={`bg-orange min-h-[calc(100svh-4.5rem)] flex items-center justify-center py-20 sm:py-24 ${heroVisible ? 'is-visible' : ''}`}>
        <div className="w-full max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h1 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4 max-w-5xl mx-auto tracking-tight">
            QUALITY DOCUMENTATION
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            Access IMA’s quality certifications and supporting documentation to support your supplier qualification and compliance requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              type="button"
              onClick={() => navigate('quote')}
              className="btn-chamfer group inline-flex items-center justify-center gap-2 bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Request Quality Documents <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="btn-chamfer inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm tracking-wide px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Contact Quality Team
            </button>
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section
        id="quality-metrics"
        className="bg-off min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-metrics'] ? 'is-visible' : ''}`}>
          <SL text="QUALITY ASSURANCE" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            INSPECTION &amp; TESTING CAPABILITIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilityCards.map((card) => (
              <div key={card.number} className="quality-card quality-card--light p-8">
                <div className="font-mono text-[11px] text-blue font-semibold mb-4">{card.number}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3">{card.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{card.desc}</p>
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
        className="bg-off min-h-screen flex items-center"
      >
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['quality-process'] ? 'is-visible' : ''}`}>
          <SL text="QUALITY PROCESS" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            BUILT IN, NOT<br />INSPECTED IN
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
