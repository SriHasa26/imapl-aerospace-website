import { useEffect, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import { images } from '../content/assets'
import ContactAnimatedBackground from '../components/ContactAnimatedBackground'
import { isTechnicalPhoto, photoClass, productWellClass } from '../content/imagePresentation'
import { industries, namedEntities, prototypeIndustryCards } from '../content/industries'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function AR({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" className={`w-3.5 h-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const publicIndustries = industries.filter((industry) => isPublishable(industry.verificationStatus))
const publicEntities = namedEntities.filter((entity) => isPublishable(entity.verificationStatus))
const publicPrototypeCards = prototypeIndustryCards.filter((card) => isPublishable(card.verificationStatus))

const industrySections = (publicPrototypeCards.length > 0 ? publicPrototypeCards : publicIndustries).map((item, index) => {
  if ('title' in item) {
    return {
      id: item.id,
      anchorId: `ind-${item.id}`,
      title: item.title,
      sub: item.sub,
      desc: item.desc,
      programs: publicEntities.length > 0 ? publicEntities.map((entity) => entity.name) : item.programs,
      chips: item.stats.map(([label, val]) => ({ val, label })),
      img: undefined as string | undefined,
      alt: item.title,
    }
  }

  const workAreas = item.workAreas ?? []
  const chips = workAreas.slice(0, 3).map((area) => {
    const [first, ...rest] = area.split(' ')
    return { val: first ?? area, label: rest.join(' ') || area }
  })
  while (chips.length < 3) {
    chips.push({ val: item.industry, label: 'Industry' })
  }

  return {
    id: String(index + 1).padStart(2, '0'),
    anchorId: `ind-${item.id}`,
    title: item.industry,
    sub: workAreas[0] ?? 'Aerospace',
    desc: item.description,
    programs: workAreas,
    chips,
    img: item.image ? images[item.image] : undefined,
    alt: item.industry,
  }
})

export default function Industries({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeAnchor, setActiveAnchor] = useState(industrySections[0]?.anchorId ?? '')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Hero is always the first thing on the page, so reveal it on mount rather than
    // waiting for a scroll-triggered IntersectionObserver — gating it on scroll
    // position raced against the navigation scroll-to-top reset and could leave it
    // permanently hidden.
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(industrySections.map((section) => [section.anchorId, true])))
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
        const next = visible[0]?.target.id
        if (next) setActiveAnchor(next)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0.12, 0.35, 0.6] },
    )

    industrySections.forEach((section) => {
      const el = document.getElementById(section.anchorId)
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
    <div className="industries-page">
      {/* Hero */}
      <section
        className={`industries-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <ContactAnimatedBackground />
        <div className="industries-hero-ambient" aria-hidden="true" />
        <div className="industries-hero-grid" aria-hidden="true" />
        <div className="industries-hero-scan" aria-hidden="true" />
        <div className="industries-hero-field" aria-hidden="true">
          <span className="industries-hero-ring" />
          <span className="industries-hero-ring industries-hero-ring-2" />
          <span className="industries-hero-cross" />
          <span className="industries-hero-dot" />
        </div>
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <div className="industries-eyebrow flex items-center gap-3 mb-3">
            <div className="industries-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Industries Served</span>
          </div>
          <h1 className="industries-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6 sm:whitespace-nowrap">
            Aerospace Manufacturing
          </h1>
          <p className="industries-lede text-steel max-w-2xl text-lg leading-relaxed">
            Aerospace manufacturing and MRO tooling — aero-engine tooling, precision aerospace components, and MRO tooling.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Industry index */}
      <nav className="industries-nav" aria-label="Industry sections">
        <div className="industries-nav-inner max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="industries-nav-track">
            {industrySections.map((ind) => (
              <a
                key={ind.anchorId}
                href={`#${ind.anchorId}`}
                className={`industries-nav-link shrink-0 font-mono text-xs uppercase tracking-widest px-5 py-4 border-r border-border-dark focus-visible:outline-none focus-visible:text-cyan ${activeAnchor === ind.anchorId ? 'is-active' : ''}`}
              >
                {ind.id} {ind.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="industries-blend" aria-hidden="true" />

      {/* Industry detail sections */}
      {industrySections.map((ind, i) => (
        <section
          key={ind.anchorId}
          id={ind.anchorId}
          className={`industries-block scroll-mt-40 ${i % 2 === 0 ? 'industries-block--light' : 'industries-block--dark'} ${revealed[ind.anchorId] ? 'is-visible' : ''}`}
        >
          <div className="industries-block-ambient" aria-hidden="true" />
          <div className="industries-block-grid" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div
              className={`industries-panel ${i % 2 === 0 ? 'industries-panel--light' : 'industries-panel--dark'}`}
              style={{ '--industries-stagger': `${Math.min(i, 4) * 40}ms` } as CSSProperties}
            >
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div className="industries-figure relative">
                  <div className={['industries-figure-well', productWellClass(ind.img)].filter(Boolean).join(' ')}>
                    {ind.img && (
                      <img
                        src={ind.img}
                        alt={ind.alt}
                        className={`${photoClass(ind.img, isTechnicalPhoto(ind.img) ? 'photo' : 'decorative', 'landscape')} industries-figure-img`}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="industries-figure-overlay" />
                  <div className="industries-figure-corner industries-figure-corner--tl" />
                  <div className="industries-figure-corner industries-figure-corner--tr" />
                  <div className="industries-figure-corner industries-figure-corner--bl" />
                  <div className="industries-figure-corner industries-figure-corner--br" />
                  <div className="industries-figure-label font-mono text-[11px] text-cyan uppercase tracking-widest">
                    {ind.id} / {ind.sub}
                  </div>
                  {ind.chips.length > 0 && (
                    <div className="industries-chips">
                      {ind.chips.map((chip, chipIndex) => (
                        <div key={`${chip.val}-${chip.label}-${chipIndex}`} className="industries-chip">
                          <div className="font-display font-bold text-cyan text-lg">{chip.val}</div>
                          <div className="font-mono text-[11px] text-steel mt-0.5 tracking-wider">{chip.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="industries-copy">
                  <div className="industries-kicker font-mono text-xs sm:text-sm text-cyan uppercase tracking-widest mb-3">Industry {ind.id}</div>
                  <h2 className={`font-display font-bold text-4xl lg:text-5xl uppercase leading-tight mb-3 ${i % 2 === 0 ? 'text-navy' : 'text-white'}`}>
                    {ind.title}
                  </h2>
                  <p className={`font-mono text-[11px] uppercase tracking-wider mb-6 ${i % 2 === 0 ? 'text-blue' : 'text-cyan'}`}>{ind.sub}</p>
                  <p className={`leading-relaxed mb-8 ${i % 2 === 0 ? 'text-mid' : 'text-steel'}`}>{ind.desc}</p>
                  {ind.programs.length > 0 && (
                    <div className={`mb-8 border-l-2 pl-5 ${i % 2 === 0 ? 'border-blue' : 'border-cyan'}`}>
                      <div className={`font-mono text-xs uppercase tracking-widest mb-3 ${i % 2 === 0 ? 'text-mid' : 'text-steel'}`}>Work areas</div>
                      <ul className="space-y-2">
                        {ind.programs.map(p => (
                          <li key={p} className={`text-sm flex items-start gap-2 ${i % 2 === 0 ? 'text-mid' : 'text-steel'}`}>
                            <div className={`w-1 h-1 mt-2 shrink-0 ${i % 2 === 0 ? 'bg-blue' : 'bg-cyan/60'}`} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={() => navigate('quote')}
                    className={`btn-chamfer group flex items-center gap-2 font-medium text-sm tracking-wide px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
                      i % 2 === 0 ? 'bg-navy hover:bg-navy-light text-white' : 'bg-blue hover:bg-blue-light text-white'
                    }`}
                  >
                    Request a Quote <AR className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">Your Industry. Our Capability.</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Every aerospace sector has unique demands. Let our engineering team show you how we meet yours.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Submit RFQ <AR className="transition-transform duration-200 group-hover:translate-x-1" />
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
