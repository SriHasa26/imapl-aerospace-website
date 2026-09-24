import { useEffect, useState } from 'react'
import type { Page } from '../App'
import { images } from '../content/assets'
import { catalogFillClass, imageFrame, isTechnicalPhoto, photoClass } from '../content/imagePresentation'
import {
  capabilities,
  capabilityPageSections,
  type CapabilityRecord,
} from '../content/capabilities'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SL({ text }: { text: string }) {
  return (
    <div className="caps-page-eyebrow flex items-center gap-3 mb-3">
      <div className="caps-page-eyebrow-rule h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
    </div>
  )
}

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function composeSection(capabilityIds: string[]) {
  const records = capabilityIds
    .map((id) => capabilities.find((capability) => capability.id === id))
    .filter((capability): capability is CapabilityRecord => {
      if (!capability) return false
      return isPublishable(capability.verificationStatus)
    })

  const primary = records[0]
  if (!primary) return undefined

  const materials = unique(records.flatMap((record) => record.materials))
  const details = unique(records.flatMap((record) => record.technicalDetails))
  const specs: Array<[string, string]> = []

  if (details.length > 0) {
    specs.push(['Process', details.join(', ')])
  }
  if (materials.length > 0) {
    specs.push(['Materials', materials.join(', ')])
  }

  return {
    title: primary.title,
    tagline: details.slice(0, 3).join(' · ') || primary.title,
    desc: primary.description,
    img: primary.image ? images[primary.image] : undefined,
    specs,
    items: details,
  }
}

const caps = capabilityPageSections
  .map((section) => {
    const composed = composeSection(section.capabilityIds)
    if (!composed) return undefined
    return { id: section.id, anchorId: section.anchorId, ...composed }
  })
  .filter((section): section is NonNullable<typeof section> => Boolean(section))

export default function Capabilities({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeAnchor, setActiveAnchor] = useState(caps[0]?.anchorId ?? '')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Hero is always the first thing on the page, so reveal it on mount rather than
    // waiting for a scroll-triggered IntersectionObserver — gating it on scroll
    // position raced against the navigation scroll-to-top reset and could leave it
    // permanently hidden.
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(caps.map((cap) => [cap.anchorId, true])))
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
      { threshold: 0.16, rootMargin: '0px 0px -12% 0px' },
    )

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const next = caps.find((cap) => cap.anchorId === visible[0]?.target.id)?.anchorId
        if (next) setActiveAnchor(next)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0.12, 0.35, 0.6] },
    )

    caps.forEach((cap) => {
      const el = document.getElementById(cap.anchorId)
      if (!el) return
      sectionObserver.observe(el)
      spyObserver.observe(el)
    })

    return () => {
      window.cancelAnimationFrame(revealId)
      sectionObserver.disconnect()
      spyObserver.disconnect()
    }
  }, [])

  return (
    <div className="caps-page">
      {/* Hero */}
      <section
        className={`caps-page-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <div className="absolute inset-0 blueprint-grid opacity-[0.08]" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <SL text="Manufacturing Capabilities" />
          <h1 className="caps-page-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6 sm:whitespace-nowrap">
            Precision At Every Process
          </h1>
          <p className="caps-page-lede text-steel max-w-2xl text-lg leading-relaxed">
            CNC machining, tooling, jigs and fixtures, assembly, part marking, inspection, NDT, and load testing.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#0E1B33" />
          </svg>
        </div>
      </section>

      {/* Quick nav */}
      <nav className="caps-page-nav" aria-label="Capability sections">
        <div className="caps-page-nav-inner max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="caps-page-nav-track">
            {caps.map(c => (
              <a
                key={c.id}
                href={`#${c.anchorId}`}
                className={`caps-page-nav-link shrink-0 font-mono text-xs uppercase tracking-widest px-4 py-4 border-r border-border-dark focus-visible:outline-none focus-visible:text-cyan ${activeAnchor === c.anchorId ? 'is-active' : ''}`}
              >
                {c.id} {c.title.split(' ').slice(0, 2).join(' ')}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Capability detail sections */}
      {caps.map((cap, i) => (
        <section
          key={cap.id}
          id={cap.anchorId}
          className={`caps-page-block py-16 lg:py-20 scroll-mt-40 ${i % 2 === 0 ? 'caps-page-block--dark' : 'caps-page-block--light bg-off'} ${revealed[cap.anchorId] ? 'is-visible' : ''}`}
        >
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className={`caps-page-panel ${i % 2 === 0 ? 'caps-page-panel--dark' : 'caps-page-panel--light'}`}>
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 ${cap.id === '06' ? 'caps-page-inspection-grid items-start lg:items-stretch' : 'items-start'} ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <div className={`font-mono text-xs sm:text-sm uppercase tracking-widest mb-3 flex items-center gap-2 ${i % 2 === 0 ? 'text-cyan' : 'text-blue'}`}>
                  <span className={i % 2 === 0 ? 'text-steel' : 'text-mid'}>{cap.id}</span>
                  <div className="w-8 h-px bg-cyan/30" />
                  Capability
                </div>
                <h2 className={`font-display font-bold text-4xl lg:text-5xl uppercase leading-tight mb-2 ${i % 2 === 0 ? 'text-white' : 'text-navy'}`}>
                  {cap.title}
                </h2>
                <p className={`font-mono text-[11px] uppercase tracking-widest mb-6 ${i % 2 === 0 ? 'text-cyan' : 'text-blue'}`}>{cap.tagline}</p>
                <p className={`leading-relaxed mb-8 ${i % 2 === 0 ? 'text-steel' : 'text-mid'}`}>{cap.desc}</p>

                {cap.specs.length > 0 && (
                  <div className={`border ${i % 2 === 0 ? 'border-border-dark' : 'border-border-light'} mb-8`}>
                    {cap.specs.map(([k, v], j) => (
                      <div key={k} className={`flex items-start gap-4 px-4 py-3 min-w-0 ${j % 2 === 0 ? (i % 2 === 0 ? 'bg-navy-mid' : 'bg-off-dark') : ''} border-b last:border-0 ${i % 2 === 0 ? 'border-border-dark' : 'border-border-light'}`}>
                        <div className={`font-mono text-[11px] uppercase tracking-wider w-32 shrink-0 ${i % 2 === 0 ? 'text-steel' : 'text-mid'}`}>{k}</div>
                        <div className={`font-mono text-[11px] min-w-0 break-words ${i % 2 === 0 ? 'text-white' : 'text-navy'}`}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {cap.items.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                    {cap.items.map(item => (
                      <li key={item} className={`flex items-start gap-3 text-sm ${i % 2 === 0 ? 'text-steel' : 'text-mid'}`}>
                        <div className="w-4 h-4 border border-cyan flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={() => navigate('quote')} className={`btn-chamfer group flex items-center gap-2 font-medium text-sm tracking-wide px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5 ${i % 2 === 0 ? 'bg-blue hover:bg-blue-light text-white' : 'bg-navy hover:bg-navy-light text-white'}`}>
                  Request Capability Quote <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              <div className={`caps-page-figure relative${cap.id === '06' ? ' caps-page-figure--inspection' : ''}`}>
                <div className={`${cap.id === '06' ? 'caps-page-figure-frame--inspection im-catalog-fill' : `${imageFrame.card} ${cap.img && catalogFillClass(cap.img) ? catalogFillClass(cap.img) : 'bg-navy'}`}`}>
                  {cap.img && (
                    <img
                      src={cap.img}
                      alt={cap.id === '06' ? 'Inspection CMM and measurement equipment' : cap.title}
                      className={`${photoClass(cap.img)} caps-page-figure-img`}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                {cap.id !== '06' && <div className="caps-page-figure-overlay" />}
                <div className="caps-page-figure-corner caps-page-figure-corner--tl" />
                <div className="caps-page-figure-corner caps-page-figure-corner--tr" />
                <div className="caps-page-figure-corner caps-page-figure-corner--bl" />
                <div className="caps-page-figure-corner caps-page-figure-corner--br" />
              </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-5xl uppercase mb-4">Ready to Manufacture?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Submit your drawings and specifications for a technical and commercial proposal.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Request a Quote <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('contact')} className="btn-chamfer border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm tracking-wide px-8 py-4 transition-all duration-200 hover:-translate-y-0.5">
              Talk to Our Engineers
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
