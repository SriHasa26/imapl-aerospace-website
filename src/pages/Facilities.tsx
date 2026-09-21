import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import { images } from '../content/assets'
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

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeTour, setActiveTour] = useState(photoTour[0]?.num ?? '')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tourIds = photoTour.map((bay) => `fac-tour-${bay.num}`)
    const extraIds = ['fac-location', 'fac-tour', 'fac-equipment']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      setRevealed(Object.fromEntries([...tourIds, ...extraIds].map((id) => [id, true])))
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
      { threshold: 0.12 },
    )
    if (hero) heroObserver.observe(hero)

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
      heroObserver.disconnect()
      revealObserver.disconnect()
      spyObserver.disconnect()
    }
  }, [])

  return (
    <div className="facilities-page">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`facilities-hero relative overflow-hidden ${heroVisible ? 'is-visible' : ''}`}
      >
        <img src={images.facilityImage} alt="Igniting Minds Aerospace manufacturing facility" className={`absolute inset-0 ${photoClass(images.facilityImage, 'decorative')} opacity-55`} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/78 via-navy/45 to-navy/22" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/22" />
        <div className="facilities-hero-ambient" aria-hidden="true" />
        <div className="facilities-hero-grid" aria-hidden="true" />
        <div className="facilities-hero-scan" aria-hidden="true" />
        <span className="facilities-hero-dot facilities-hero-dot--a" aria-hidden="true" />
        <span className="facilities-hero-dot facilities-hero-dot--b" aria-hidden="true" />
        <span className="facilities-hero-dot facilities-hero-dot--c" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <div className="facilities-crumb font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Facilities</span>
          </div>
          <div className="facilities-eyebrow flex items-center gap-3 mb-4">
            <div className="facilities-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-[10px] text-orange uppercase tracking-[0.2em]">Our Facilities</span>
          </div>
          <h1 className="facilities-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            {publicArea ? (
              <>
                {publicArea} of<br />Advanced<br />Manufacturing
              </>
            ) : (
              <>
                Advanced<br />Aerospace<br />Manufacturing
              </>
            )}
          </h1>
          <div className="facilities-hero-stats grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-border-dark mt-8 min-w-0">
            {heroStats.map(s => (
              <div key={s.label} className="facilities-stat min-w-0">
                <div className="font-display font-black text-white text-4xl">{s.val}</div>
                <div className="font-mono text-[9px] text-cyan mt-1 uppercase tracking-widest">{s.unit}</div>
                <div className="font-mono text-[9px] text-steel/70 mt-0.5 break-words">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / identity */}
      <section
        id="fac-location"
        className={`facilities-location ${revealed['fac-location'] ? 'is-visible' : ''}`}
      >
        <div className="facilities-location-ambient" aria-hidden="true" />
        <div className="facilities-location-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="facilities-location-panel">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="facilities-eyebrow-rule h-px bg-orange" />
                  <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">
                    {publicLocations.length > 0 || publicLocationSummary ? 'Location' : 'Manufacturing'}
                  </span>
                </div>
                <h2 className="font-display font-bold text-navy text-3xl uppercase mb-4">{locationHeading}</h2>
                <p className="text-mid leading-relaxed max-w-xl">
                  {locationBody}
                </p>
              </div>
              <div className="space-y-0 facilities-facts">
                {locationFacts.map(([k, v]) => (
                  <div key={`${k}-${v}`} className="facilities-fact">
                    <div className="font-mono text-[9px] text-steel uppercase tracking-wider mb-1">{k}</div>
                    <div className="text-sm text-mid">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="facilities-blend facilities-blend--to-dark" aria-hidden="true" />

      {/* Bay by bay / photo tour */}
      <section className={`facilities-tour ${revealed['fac-tour'] ? 'is-visible' : ''}`}>
        <div className="facilities-tour-ambient" aria-hidden="true" />
        <div className="facilities-tour-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div id="fac-tour" className="facilities-tour-intro scroll-mt-32">
            <div className="facilities-eyebrow flex items-center gap-3 mb-4">
              <div className="facilities-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-[10px] text-orange uppercase tracking-[0.2em]">Facility Tour</span>
            </div>
            <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-8">
              {publicBays.length > 0 ? (
                <>
                  Six Integrated<br />Manufacturing Areas
                </>
              ) : (
                <>
                  Aerospace<br />Manufacturing
                </>
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
                  <div className="facilities-bay-scan" aria-hidden="true" />
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

      {publicLegacyMachines.length > 0 ? (
        <div className="facilities-blend facilities-blend--to-light" aria-hidden="true" />
      ) : (
        <div className="facilities-blend facilities-blend--to-blue" aria-hidden="true" />
      )}

      {publicLegacyMachines.length > 0 && (
        <section
          id="fac-equipment"
          className={`facilities-equipment ${revealed['fac-equipment'] ? 'is-visible' : ''}`}
        >
          <div className="facilities-equipment-ambient" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="facilities-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">Equipment</span>
            </div>
            <h2 className="font-display font-bold text-navy text-4xl uppercase mb-10">Named Machines</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicLegacyMachines.map((machine) => (
                <li key={machine} className="facilities-machine text-sm text-mid">{machine}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {publicLegacyMachines.length > 0 && (
        <div className="facilities-blend facilities-blend--from-light-to-blue" aria-hidden="true" />
      )}

      {showExpansion ? (
        <section className="facilities-identity">
          <div className="facilities-identity-ambient" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-3">{prototypeExpansion.phaseLabel}</div>
                <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">
                  {prototypeExpansion.headline}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {prototypeExpansion.detail}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {prototypeExpansion.stats.map(s => (
                  <div key={s.label} className="facilities-identity-stat">
                    <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-white/60 mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="facilities-identity">
          <div className="facilities-identity-ambient" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-3">{shortName.value}</div>
                <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">
                  Aerospace Manufacturing
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {description.value}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {identityStats.map(s => (
                  <div key={s.label} className="facilities-identity-stat">
                    <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-white/60 mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="facilities-blend facilities-blend--from-blue-to-navy" aria-hidden="true" />

      {/* CTA */}
      <section className="facilities-cta">
        <div className="facilities-cta-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">Schedule a Facility Visit</h2>
          <p className="text-steel max-w-md mx-auto mb-8">
            {officialName.value} welcomes site visits. Use the contact form to request a visit.
          </p>
          <button onClick={() => navigate('contact')} className="bg-blue hover:bg-blue-light text-white font-medium text-sm px-8 py-4 flex items-center gap-2 mx-auto transition-colors">
            Request a Visit <AR />
          </button>
        </div>
      </section>
    </div>
  )
}
