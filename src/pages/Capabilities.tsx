import { useEffect, useRef, useState } from 'react'
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

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeAnchor, setActiveAnchor] = useState(caps[0]?.anchorId ?? '')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      setRevealed(Object.fromEntries(caps.map((cap) => [cap.anchorId, true])))
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
      { threshold: 0.18 },
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
      heroObserver.disconnect()
      sectionObserver.disconnect()
      spyObserver.disconnect()
    }
  }, [])

  return (
    <div className="caps-page">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`caps-page-hero relative overflow-hidden ${heroVisible ? 'is-visible' : ''}`}
      >
        <div className="caps-page-hero-ambient" aria-hidden="true" />
        <div className="caps-page-hero-grid" aria-hidden="true" />
        <div className="caps-page-hero-scan" aria-hidden="true" />
        <div className="caps-page-hero-field" aria-hidden="true">
          <span className="caps-page-hero-ring" />
          <span className="caps-page-hero-ring caps-page-hero-ring-2" />
          <span className="caps-page-hero-ring caps-page-hero-ring-3" />
          <span className="caps-page-hero-cross" />
          <span className="caps-page-hero-dot" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="caps-page-crumb font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Capabilities</span>
          </div>
          <SL text="Manufacturing Capabilities" />
          <h1 className="caps-page-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Precision At<br />Every Process
          </h1>
          <p className="caps-page-lede text-steel max-w-2xl text-lg leading-relaxed">
          CNC machining, tooling, jigs and fixtures, assembly, part marking, inspection, NDT, and load testing.
          </p>
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
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 ${cap.id === '06' ? 'items-stretch' : 'items-start'} ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
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
                  <ul className="space-y-2 mb-8">
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
                <button onClick={() => navigate('quote')} className={`flex items-center gap-2 font-medium text-sm px-7 py-3.5 transition-colors ${i % 2 === 0 ? 'bg-blue hover:bg-blue-light text-white' : 'bg-navy hover:bg-navy-light text-white'}`}>
                  Request Capability Quote <AR />
                </button>
              </div>

              <div className={`caps-page-figure relative${cap.id === '06' ? ' caps-page-figure--pair' : ''}`}>
                <div className={`${cap.id === '06' ? 'caps-page-figure-frame--pair im-catalog-fill' : `${imageFrame.card} ${cap.img && catalogFillClass(cap.img) ? catalogFillClass(cap.img) : 'bg-navy'}`}`}>
                  {cap.id === '06' ? (
                    <div className="caps-page-figure-pair">
                      <div className="caps-page-figure-pair-cell">
                        <img
                          src={images.inspectionCmmCrysta}
                          alt="MITUTOYO CMM CRYSTA-Apex S7106"
                          className="caps-page-figure-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="caps-page-figure-pair-cell">
                        <img
                          src={images.inspectionVpp}
                          alt="ACCURATE Model VPP 2515 MAZ"
                          className="caps-page-figure-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  ) : (
                    cap.img && (
                      <img
                        src={cap.img}
                        alt={cap.title}
                        className={`${photoClass(cap.img)} caps-page-figure-img`}
                        loading="lazy"
                        decoding="async"
                      />
                    )
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
      <section className="bg-navy py-20 blueprint-grid">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-5xl uppercase mb-4">Ready to Manufacture?</h2>
          <p className="text-steel max-w-lg mx-auto mb-8">Submit your drawings and specifications for a technical and commercial proposal.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="bg-cyan hover:bg-cyan/90 text-navy font-bold text-sm px-8 py-4 flex items-center gap-2 transition-colors">
              Request a Quote <AR />
            </button>
            <button onClick={() => navigate('contact')} className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-8 py-4 transition-colors">
              Talk to Our Engineers
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
