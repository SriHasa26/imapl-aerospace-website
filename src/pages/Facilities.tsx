import type { Page } from '../App'
import { images } from '../content/assets'
import { description, officialName, publicWorkAreas, shortName } from '../content/company'
import {
  facilities,
  facilityArea,
  facilityLocationConflict,
  facilityPhotoKeys,
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

const locationFacts = publicLocationFacts.length > 0
  ? publicLocationFacts.map((fact) => [fact.label, fact.value] as const)
  : [
      ['Tooling', publicWorkAreas[0] ?? 'Aero Engine Tooling'],
      ['Components', publicWorkAreas[1] ?? 'Precision Aerospace Components'],
      ['MRO', publicWorkAreas[2] ?? 'MRO Tooling Solutions'],
      ['Manufacturing', publicWorkAreas[3] ?? 'Integrated Engineering & Manufacturing'],
    ] as const

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
      detail: index === 0 ? description.value : undefined,
      img: images[key],
    }))

export default function Facilities({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-20 overflow-hidden min-h-[70vh] flex items-end">
        <img src={images.facilityImage} alt="Igniting Minds Aerospace manufacturing facility" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy" />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 xl:px-12 pb-20 pt-32">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Facilities</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Our Facilities</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border-dark mt-10">
            {heroStats.map(s => (
              <div key={s.label}>
                <div className="font-display font-black text-white text-4xl">{s.val}</div>
                <div className="font-mono text-[9px] text-cyan mt-1 uppercase tracking-widest">{s.unit}</div>
                <div className="font-mono text-[9px] text-steel/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / identity */}
      <section className="bg-off py-16 border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-blue" />
                <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">
                  {publicLocations.length > 0 || publicLocationSummary ? 'Location' : 'Manufacturing'}
                </span>
              </div>
              <h2 className="font-display font-bold text-navy text-3xl uppercase mb-4">{locationHeading}</h2>
              <p className="text-mid leading-relaxed max-w-xl">
                {locationBody}
              </p>
            </div>
            <div className="space-y-4">
              {locationFacts.map(([k, v]) => (
                <div key={`${k}-${v}`}>
                  <div className="font-mono text-[9px] text-steel uppercase tracking-wider mb-1">{k}</div>
                  <div className="text-sm text-mid">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bay by bay / photo tour */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Facility Tour</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
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

          <div className="space-y-px">
            {photoTour.map((bay, i) => (
              <div key={bay.num} className={`grid lg:grid-cols-2 gap-0 group ${i % 2 === 0 ? '' : 'lg:[&>*:first-child]:order-2'}`}>
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={bay.img}
                    alt={bay.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan uppercase tracking-widest border border-cyan/30 px-2 py-1 bg-navy/70 backdrop-blur">
                    {publicBays.length > 0 ? `Bay ${bay.num}` : bay.num}
                  </div>
                </div>
                <div className="bg-navy-mid p-10 lg:p-14 flex flex-col justify-center">
                  {bay.meta && (
                    <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-2">{bay.meta}</div>
                  )}
                  <h3 className="font-display font-bold text-white text-3xl uppercase mb-4">{bay.name}</h3>
                  {bay.detail && <p className="text-steel leading-relaxed">{bay.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {publicLegacyMachines.length > 0 && (
        <section className="bg-off py-24">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-blue" />
              <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">Equipment</span>
            </div>
            <h2 className="font-display font-bold text-navy text-4xl uppercase mb-10">Named Machines</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicLegacyMachines.map((machine) => (
                <li key={machine} className="border border-border-light p-5 text-sm text-mid">{machine}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {showExpansion ? (
        <section className="bg-blue py-20">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
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
                  <div key={s.label} className="border border-white/20 p-5">
                    <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-white/60 mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-blue py-20">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
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
                  <div key={s.label} className="border border-white/20 p-5">
                    <div className="font-display font-bold text-white text-3xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-white/60 mt-1 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
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
