import { useEffect, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import { images, videos } from '../content/assets'
import { isPortraitEquipment, isTechnicalPhoto, photoClass } from '../content/imagePresentation'
import { description, officialName, publicWorkAreas, shortName } from '../content/company'
import {
  facilities,
  facilityArea,
  facilityLocationConflict,
  facilityPhotoKeys,
  facilityPhotoTourDetails,
  legacyLocations,
  prototypeBays,
  prototypeExpansion,
  prototypeHeroStats,
  prototypeHyderabadCampus,
  prototypeLocationFacts,
} from '../content/facilities'
import { isConflicting, type MaybeConflicting, type VerificationStatus } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SL({ text }: { text: string }) {
  return (
    <div className="facilities-eyebrow flex items-center gap-3 mb-3">
      <div className="facilities-eyebrow-rule h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
    </div>
  )
}

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

function isPublishable(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'SOURCE_SUPPORTED'
}

function publishedValue<T>(field: MaybeConflicting<T>): T | undefined {
  if (isConflicting(field)) return undefined
  if (!isPublishable(field.verificationStatus)) return undefined
  return field.value
}

const publicArea = publishedValue(facilityArea)
const publicLocationSummary = publishedValue(facilityLocationConflict)
const publicLocations = [prototypeHyderabadCampus, ...legacyLocations].filter((location) =>
  isPublishable(location.verificationStatus),
)
const publicLocationFacts = prototypeLocationFacts.filter((fact) => isPublishable(fact.verificationStatus))
const publicHeroStats = prototypeHeroStats.filter((stat) => isPublishable(stat.verificationStatus))
const publicBays = prototypeBays.filter((bay) => isPublishable(bay.verificationStatus))
const publicLegacyMachines = isPublishable(facilities.legacyEquipment.verificationStatus)
  ? facilities.legacyEquipment.names
  : []
const showExpansion = isPublishable(prototypeExpansion.verificationStatus)

const identityStats = [
  { val: shortName.value, unit: 'Aerospace', label: 'Engineering & Manufacturing' },
  { val: 'MRO', unit: 'Tooling', label: 'Tooling Solutions' },
  { val: 'CNC', unit: 'Machining', label: 'Precision Components' },
  { val: 'GSE', unit: 'Support', label: 'Ground Support Equipment' },
]

const heroStats = publicHeroStats.length > 0
  ? publicHeroStats.map(({ val, unit, label }) => ({ val, unit, label }))
  : publicArea
    ? [{ val: publicArea, unit: 'Area', label: 'Total Facility Area' }, ...identityStats.slice(1)]
    : identityStats

const locationHeading = publicLocationSummary
  ?? (publicLocations[0]?.label)
  ?? 'Aerospace Manufacturing'

const locationBody = publicLocations.length > 0
  ? publicLocations[0].lines.join(', ')
  : description.value

const publishedOffice = publicLocations[0]
const locationFacts = publicLocationFacts.length > 0
  ? publicLocationFacts.map((fact) => [fact.label, fact.value] as const)
  : publishedOffice
    ? [
        ['Office', publishedOffice.label],
        ...publishedOffice.lines.slice(0, 3).map((line, index) => (
          [index === 0 ? 'Address' : index === 1 ? 'Area' : 'City', line] as const
        )),
      ]
    : [
        ['Tooling', publicWorkAreas[0] ?? 'Aero Engine Tooling'],
        ['Components', publicWorkAreas[1] ?? 'Precision Aerospace Components'],
        ['MRO', publicWorkAreas[2] ?? 'MRO Tooling Solutions'],
        ['Manufacturing', publicWorkAreas[3] ?? 'Integrated Engineering & Manufacturing'],
      ]

const photoTour = publicBays.length > 0
  ? publicBays.map((bay) => ({
      num: bay.num,
      name: bay.name,
      meta: `${bay.area} · ${bay.machines}`,
      detail: bay.detail,
      img: images[bay.image],
    }))
  : facilityPhotoKeys.map((key, index) => ({
      num: String(index + 1).padStart(2, '0'),
      name: publicWorkAreas[index] ?? 'Manufacturing',
      meta: undefined as string | undefined,
      detail: index === 0 ? description.value : facilityPhotoTourDetails[index],
      img: images[key],
    }))

export default function Facilities({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeTour, setActiveTour] = useState(photoTour[0]?.num ?? '')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Hero is always the first thing on the page, so reveal it on mount rather than
    // waiting for a scroll-triggered IntersectionObserver — gating it on scroll
    // position raced against the navigation scroll-to-top reset and could leave it
    // permanently hidden.
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tourIds = photoTour.map((bay) => `fac-tour-${bay.num}`)
    const extraIds = ['fac-stats', 'fac-location', 'fac-tour', 'fac-equipment', 'fac-identity']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries([...tourIds, ...extraIds].map((id) => [id, true])))
      return () => window.cancelAnimationFrame(revealId)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => (
              prev[entry.target.id] ? prev : { ...prev, [entry.target.id]: true }
            ))
          }
        })
      },
        { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
    )

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = visible[0]?.target.id
        if (id?.startsWith('fac-tour-')) setActiveTour(id.replace('fac-tour-', ''))
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.12, 0.35, 0.6] },
    )

    ;[...tourIds, ...extraIds].forEach((id) => {
      const el = document.getElementById(id)
      if (el) revealObserver.observe(el)
    })
    tourIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) spyObserver.observe(el)
    })

    return () => {
      window.cancelAnimationFrame(revealId)
      revealObserver.disconnect()
      spyObserver.disconnect()
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
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <SL text="Our Facilities" />
          <h1 className="facilities-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6 sm:whitespace-nowrap">
            {publicArea ? (
              <>{publicArea} of Advanced Manufacturing</>
            ) : (
              <>Advanced Aerospace Manufacturing</>
            )}
          </h1>
          <p className="facilities-lede text-steel max-w-2xl text-lg leading-relaxed">
            Precision aerospace manufacturing, aero-engine and MRO tooling, and ground support equipment production.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Facility snapshot */}
      <section id="fac-stats" className="bg-off min-h-screen flex items-center">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-stats'] ? 'is-visible' : ''}`}>
          <SL text="Facility Snapshot" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            Built For Scale
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {heroStats.map((s) => (
              <div key={s.label} className="quality-card quality-card--light p-8 text-center">
                <div className="font-display font-black text-blue text-4xl lg:text-5xl mb-2">{s.val}</div>
                <div className="font-mono text-xs text-navy uppercase tracking-widest">{s.unit}</div>
                <div className="font-mono text-xs text-mid mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="fac-location" className="bg-navy min-h-screen flex items-center">
        <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-location'] ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-2">
              <SL text={publicLocations.length > 0 || publicLocationSummary ? 'Location' : 'Manufacturing'} />
              <h2 className="font-display font-bold text-white text-4xl uppercase leading-tight mb-4">{locationHeading}</h2>
              <p className="text-steel leading-relaxed max-w-xl">{locationBody}</p>
            </div>
            <div className="quality-card quality-card--dark divide-y divide-border-dark">
              {locationFacts.map(([k, v]) => (
                <div key={`${k}-${v}`} className="px-5 py-4">
                  <div className="font-mono text-[11px] text-steel uppercase tracking-wider mb-1">{k}</div>
                  <div className="text-sm text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bay by bay / photo tour */}
      <section className={`facilities-tour ${revealed['fac-tour'] ? 'is-visible' : ''}`}>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div id="fac-tour" className="facilities-tour-intro scroll-mt-32">
            <SL text="Facility Tour" />
            <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-8">
              {publicBays.length > 0 ? (
                <>Six Integrated<br />Manufacturing Areas</>
              ) : (
                <>Aerospace<br />Manufacturing</>
              )}
            </h2>
          </div>

          <nav className="facilities-tour-nav" aria-label="Facility tour">
            <div className="facilities-tour-track">
              {photoTour.map((bay) => (
                <a
                  key={bay.num}
                  href={`#fac-tour-${bay.num}`}
                  className={`facilities-tour-link ${activeTour === bay.num ? 'is-active' : ''}`}
                >
                  <span className="font-mono text-[9px] tracking-widest">{bay.num}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest">{bay.name}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="facilities-tour-list">
            {photoTour.map((bay, i) => (
              <article
                key={bay.num}
                id={`fac-tour-${bay.num}`}
                className={`facilities-bay scroll-mt-40 ${i % 2 !== 0 ? 'facilities-bay--flip' : ''} ${revealed[`fac-tour-${bay.num}`] ? 'is-visible' : ''}`}
                style={{ '--facilities-stagger': `${Math.min(i, 5) * 80}ms` } as CSSProperties}
              >
                <div className="facilities-bay-media">
                  <div className={`facilities-bay-well${isTechnicalPhoto(bay.img) || isPortraitEquipment(bay.img) ? ' im-media-product' : ''}`}>
                    <img
                      src={bay.img}
                      alt={bay.name}
                      className={`${photoClass(bay.img, isTechnicalPhoto(bay.img) || isPortraitEquipment(bay.img) ? 'photo' : 'decorative')} facilities-bay-img`}
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
                    {publicBays.length > 0 ? `Bay ${bay.num}` : bay.num}
                  </div>
                </div>
                <div className="facilities-bay-copy">
                  {bay.meta && (
                    <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-2">{bay.meta}</div>
                  )}
                  <h3 className="font-display font-bold text-white text-3xl uppercase mb-4">{bay.name}</h3>
                  {bay.detail && <p className="text-steel leading-relaxed">{bay.detail}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      {publicLegacyMachines.length > 0 && (
        <section id="fac-equipment" className="bg-off min-h-screen flex items-center">
          <div className={`quality-reveal max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-equipment'] ? 'is-visible' : ''}`}>
            <SL text="Equipment" />
            <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">Named Machines</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publicLegacyMachines.map((machine) => (
                <li key={machine} className="quality-card quality-card--light p-5 text-sm text-navy">{machine}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Identity / expansion */}
      <section id="fac-identity" className="facilities-identity min-h-screen flex items-center">
        <div className={`quality-reveal relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full ${revealed['fac-identity'] ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-3">
                {showExpansion ? prototypeExpansion.phaseLabel : shortName.value}
              </div>
              <h2 className="font-display font-bold text-white text-4xl uppercase leading-tight mb-4">
                {showExpansion ? prototypeExpansion.headline : 'Aerospace Manufacturing'}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {showExpansion ? prototypeExpansion.detail : description.value}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(showExpansion ? prototypeExpansion.stats : identityStats).map((s) => (
                <div key={s.label} className="facilities-identity-stat">
                  <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                  <div className="font-mono text-[11px] text-white/60 mt-1 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">Schedule a Facility Visit</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            {officialName.value} welcomes site visits. Use the contact form to request a visit.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('contact')} className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Request a Visit <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
