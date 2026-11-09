import { useEffect, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import { images, videos } from '../content/assets'
import { officialName } from '../content/company'
import {
  strategicLocations,
  bengaluruBays,
  bengaluruAddresses,
  bengaluruEquipmentGroups,
  ajmanOfficeDetails,
} from '../content/facilities'
import LocationsMap from '../components/LocationsMap'

interface Props {
  navigate: (page: Page) => void
}

function SL({ text }: { text: string }) {
  return (
    <div className="facilities-eyebrow flex items-center gap-3 mb-3">
      <div className="facilities-eyebrow-rule h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
    </div>
  )
}

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default function Facilities({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      try {
        window.history.replaceState(null, '', `#${id}`)
      } catch {
        // no-op if history update is restricted
      }
    }
  }

  useEffect(() => {
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120)
      }
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sectionIds = [
      'fac-stats',
      'bengaluru',
      ...bengaluruBays.map((b) => `fac-bay-${b.num}`),
      'fac-bengaluru-equipment',
      'ajman',
      'fac-map',
    ]

    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(sectionIds.map((id) => [id, true])))
      return () => window.cancelAnimationFrame(revealId)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => (prev[entry.target.id] ? prev : { ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) revealObserver.observe(el)
    })

    return () => {
      window.cancelAnimationFrame(revealId)
      revealObserver.disconnect()
    }
  }, [])

  return (
    <div className="facilities-page">
      {/* Hero */}
      <section
        className={`facilities-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <video
          className="facilities-hero-video absolute inset-0 h-full w-full object-cover"
          src={videos.facilities}
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
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12 py-20">
          <SL text="Our Facilities" />
          <h1 className="facilities-heading font-display font-black text-white text-4xl sm:text-5xl lg:text-7xl uppercase leading-[1.08] tracking-tight mb-6 max-w-5xl">
            ADVANCED AEROSPACE MANUFACTURING FACILITIES
          </h1>
          <p className="facilities-lede text-steel max-w-2xl text-lg sm:text-xl leading-relaxed">
            Precision aerospace manufacturing, multi-axis machining, aero-engine & MRO tooling, and ground support equipment production across our strategic locations.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => scrollToSection('bengaluru')}
              className="btn-chamfer group bg-orange hover:bg-orange/90 text-white font-bold text-sm tracking-wide px-7 py-3.5 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              01 Bengaluru Facility <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('ajman')}
              className="btn-chamfer group bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide px-7 py-3.5 flex items-center gap-2 border border-white/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              02 Ajman UAE Operations <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Facility Locations Snapshot */}
      <section id="fac-stats" className="bg-off py-20 lg:py-28">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-stats'] ? 'is-visible' : ''}`}>
          <div className="max-w-3xl mb-12">
            <SL text="Facility Locations" />
            <h2 className="font-display font-bold text-navy text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight">
              Global Manufacturing & Operations Footprint
            </h2>
            <p className="text-mid text-base sm:text-lg mt-3 leading-relaxed">
              Two strategic locations providing integrated aerospace manufacturing capabilities, precision tooling, and dedicated regional customer liaison.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {strategicLocations.map((loc) => (
              <div
                key={loc.id}
                className="quality-card quality-card--light flex flex-col justify-between p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs font-bold text-orange tracking-widest uppercase bg-orange/10 px-3 py-1 rounded">
                      {loc.badge}
                    </span>
                    <span className="font-display font-black text-navy/20 text-3xl sm:text-4xl">
                      {loc.number}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-navy text-2xl sm:text-3xl uppercase tracking-tight mb-2">
                    {loc.name}
                  </h3>
                  <div className="font-mono text-xs text-mid uppercase tracking-wider mb-4">
                    {loc.role}
                  </div>
                  <p className="text-mid text-sm sm:text-base leading-relaxed mb-6">
                    {loc.summary}
                  </p>
                  <ul className="space-y-2.5 mb-8 border-t border-border-light pt-6">
                    {loc.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy">
                        <span className="text-orange mt-0.5">▪</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => scrollToSection(loc.anchorId)}
                  className="btn-chamfer group w-full bg-navy text-white hover:bg-navy/90 font-bold text-xs sm:text-sm tracking-wide px-6 py-3.5 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  Explore Facility Details <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-orange" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility 01 - Bengaluru, India */}
      <section id="bengaluru" className="bg-navy py-20 lg:py-28 text-white relative">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['bengaluru'] ? 'is-visible' : ''}`}>
          {/* Facility Header */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 pb-12 border-b border-white/10">
            <div className="lg:col-span-7">
              <SL text="Facility 01 — India" />
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight mb-4">
                Bengaluru Manufacturing Hub
              </h2>
              <div className="font-mono text-xs sm:text-sm text-orange uppercase tracking-wider mb-4">
                Corporate Headquarters & Primary Aerospace Production Center
              </div>
              <p className="text-steel text-base sm:text-lg leading-relaxed max-w-2xl">
                Located in Bengaluru, Karnataka — the aerospace capital of India. IMA operates two specialized facilities spanning Peenya Industrial Area and Thigalarapalya, delivering high-precision multi-axis machining, complex aero-engine tooling, ground support equipment, and certified metrology verification.
              </p>
            </div>
            {/* Address Cards */}
            <div className="lg:col-span-5 space-y-4">
              {bengaluruAddresses.map((addr, idx) => (
                <div key={idx} className="quality-card quality-card--dark p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-orange"></span>
                    <span className="font-mono text-xs text-orange uppercase tracking-wider font-semibold">{addr.label}</span>
                  </div>
                  <div className="text-sm text-white/90 font-mono mb-2 leading-relaxed">
                    {addr.lines.map((line, lIdx) => (
                      <div key={lIdx}>{line}</div>
                    ))}
                  </div>
                  <div className="text-xs text-steel border-t border-white/10 pt-2 mt-2 leading-normal">
                    {addr.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genuine Bengaluru Photographs / Manufacturing Bays */}
          <div className="mb-8">
            <div className="mb-8">
              <span className="font-mono text-xs text-orange uppercase tracking-widest">Shop Floor & Infrastructure</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase text-white mt-1">Manufacturing Bays & Operations</h3>
            </div>

            <div className="facilities-tour-list">
              {bengaluruBays.map((bay, i) => (
                <article
                  key={bay.num}
                  id={`fac-bay-${bay.num}`}
                  className={`facilities-bay scroll-mt-28 ${i % 2 !== 0 ? 'facilities-bay--flip' : ''} ${revealed[`fac-bay-${bay.num}`] ? 'is-visible' : ''}`}
                  style={{ '--facilities-stagger': `${i * 100}ms` } as CSSProperties}
                >
                  <div className="facilities-bay-media">
                    <div className="facilities-bay-well">
                      <img
                        src={images[bay.image]}
                        alt={bay.name}
                        className={`w-full h-full object-cover ${bay.position ?? 'object-center'} facilities-bay-img`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="facilities-bay-overlay" />
                    <div className="facilities-bay-corner facilities-bay-corner--tl" />
                    <div className="facilities-bay-corner facilities-bay-corner--tr" />
                    <div className="facilities-bay-corner facilities-bay-corner--bl" />
                    <div className="facilities-bay-corner facilities-bay-corner--br" />
                    <div className="facilities-bay-label font-mono text-[9px] text-cyan uppercase tracking-widest">
                      {bay.label}
                    </div>
                  </div>
                  <div className="facilities-bay-copy">
                    <div className="font-mono text-[10px] text-orange uppercase tracking-widest mb-2">
                      Area {bay.num} · Bengaluru Plant
                    </div>
                    <h4 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mb-3 leading-tight">
                      {bay.name}
                    </h4>
                    <p className="text-steel text-sm sm:text-base leading-relaxed mb-6">
                      {bay.detail}
                    </p>
                    {bay.equipment && (
                      <div className="border-t border-white/10 pt-4 mt-auto">
                        <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider mb-2">Equipment & Systems:</div>
                        <div className="flex flex-wrap gap-2">
                          {bay.equipment.map((eq, eqIdx) => (
                            <span key={eqIdx} className="font-mono text-xs bg-white/5 border border-white/10 text-white/80 px-2.5 py-1 rounded">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bengaluru Equipment Inventory */}
      <section id="fac-bengaluru-equipment" className="bg-off py-20 lg:py-28">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-bengaluru-equipment'] ? 'is-visible' : ''}`}>
          <div className="max-w-3xl mb-12">
            <SL text="Bengaluru Machinery & Inspection Fleet" />
            <h2 className="font-display font-bold text-navy text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight">
              Verified Machinery Fleet
            </h2>
            <p className="text-mid text-base sm:text-lg mt-3 leading-relaxed">
              Precision multi-axis CNC machines, Swiss-type turning centers, and metrology systems supporting aero-engine components and tooling production in Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bengaluruEquipmentGroups.map((group, gIdx) => (
              <div key={gIdx} className="quality-card quality-card--light p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-light">
                  <span className="w-2 h-2 bg-orange rounded-full"></span>
                  <h3 className="font-display font-bold text-navy text-base lg:text-lg uppercase tracking-tight">
                    {group.category}
                  </h3>
                </div>
                <ul className="space-y-3 flex-1">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-xs sm:text-sm text-navy/90 flex items-start gap-2">
                      <span className="text-orange font-bold">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility 02 - Ajman, UAE */}
      <section id="ajman" className="bg-navy py-20 lg:py-28 text-white relative">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['ajman'] ? 'is-visible' : ''}`}>
          {/* Facility Header */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 pb-12 border-b border-white/10">
            <div className="lg:col-span-7">
              <SL text="Facility 02 — United Arab Emirates" />
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight mb-4">
                Ajman UAE Operations
              </h2>
              <div className="font-mono text-xs sm:text-sm text-orange uppercase tracking-wider mb-4">
                Middle East Regional Operations & Aerospace Technical Liaison
              </div>
              <p className="text-steel text-base sm:text-lg leading-relaxed max-w-2xl">
                {ajmanOfficeDetails.overview}
              </p>
            </div>
            {/* Address & Status Card */}
            <div className="lg:col-span-5">
              <div className="quality-card quality-card--dark p-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse"></span>
                    <span className="font-mono text-xs text-cyan uppercase tracking-wider font-semibold">Active Regional Hub</span>
                  </div>
                  <span className="font-mono text-xs text-orange bg-orange/10 px-2.5 py-1 rounded">UAE</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase mb-2">
                  {ajmanOfficeDetails.label}
                </h3>
                <div className="font-mono text-sm text-white/90 mb-4">
                  {ajmanOfficeDetails.location}
                </div>
                <div className="border-t border-white/10 pt-3 text-xs text-steel leading-relaxed">
                  Focus: {ajmanOfficeDetails.role}. Dedicated to commercial airline operators, regional MRO facilities, and aerospace logistics across the GCC.
                </div>
              </div>
            </div>
          </div>

          {/* Operational Scope Cards */}
          <div className="mb-12">
            <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase text-white mb-8">
              Regional Capabilities & Engineering Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ajmanOfficeDetails.services.map((svc, sIdx) => (
                <div key={sIdx} className="quality-card quality-card--dark p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs text-orange mb-3 tracking-widest uppercase">
                      0{sIdx + 1} // Scope
                    </div>
                    <h4 className="font-display font-bold text-white text-xl uppercase mb-3 leading-snug">
                      {svc.title}
                    </h4>
                    <p className="text-steel text-sm leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-steel font-mono">
                    <span>Region: GCC / Middle East</span>
                    <span className="text-orange">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UAE Inquiry / Action Strip */}
          <div className="quality-card quality-card--dark p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-bold text-white text-xl uppercase mb-1">
                Connect with our Middle East Team
              </h4>
              <p className="text-steel text-sm">
                Discuss tooling requirements, AOG technical assistance, or schedule a regional consultation.
              </p>
            </div>
            <button
              onClick={() => navigate('contact')}
              className="btn-chamfer group bg-orange hover:bg-orange/90 text-white font-bold text-xs sm:text-sm tracking-wide px-7 py-3.5 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer shrink-0"
            >
              Contact UAE Team <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Locations Map */}
      <section id="fac-map" className="bg-[#0D2038] py-16 lg:py-20 border-t border-white/10">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-map'] ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Info Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <SL text="Geographical Presence" />
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl uppercase leading-tight mb-3">
                Locations &amp; Coordinate Network
              </h2>
              <p className="text-steel text-sm sm:text-base leading-relaxed mb-6">
                Explore our primary manufacturing centers in Bengaluru and regional presence in Ajman, UAE on the interactive locator.
              </p>

              <div className="space-y-3 mb-6">
                <div className="quality-card quality-card--dark p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-white text-sm uppercase">01 Bengaluru Facilities</span>
                    <span className="font-mono text-[10px] text-orange bg-orange/10 border border-orange/20 px-2 py-0.5 rounded">
                      Manufacturing Hub
                    </span>
                  </div>
                  <p className="font-mono text-xs text-steel">13.023° N, 77.514° E · Peenya &amp; Thigalarapalya</p>
                </div>

                <div className="quality-card quality-card--dark p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-white text-sm uppercase">02 Ajman Operations</span>
                    <span className="font-mono text-[10px] text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">
                      Regional Liaison
                    </span>
                  </div>
                  <p className="font-mono text-xs text-steel">25.405° N, 55.514° E · Jurf Industrial Zone, UAE</p>
                </div>
              </div>

              <div className="text-xs text-steel/80 font-mono flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-orange animate-pulse" />
                Select pins or site tabs on the map to switch location views
              </div>
            </div>

            {/* Resized & Framed Interactive Map Widget */}
            <div className="lg:col-span-7">
              <div className="relative work-glass-map skeuo-orange rounded-xl overflow-hidden aspect-[16/10] min-h-[320px] max-h-[460px] border border-white/15 shadow-2xl">
                <LocationsMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange py-20 lg:py-28 text-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl uppercase mb-4 tracking-tight">
            Schedule a Facility Visit
          </h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            {officialName.value} welcomes customer technical evaluations, supplier audits, and site visits at our Bengaluru manufacturing hub.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('contact')}
              className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg"
            >
              Request a Visit <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('contact')}
              className="btn-chamfer group bg-navy hover:bg-navy/90 text-white font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Contact Operations Team
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
