import type { Page } from '../App'
import { images, photoObjectClass } from '../content/assets'
import {
  description,
  foundingYear,
  leadership,
  mission,
  officialName,
  prototypeMilestones,
  publicWorkAreas,
  shortName,
  staffCount,
  values,
  vision,
  yearsOfExperience,
} from '../content/company'
import { isConflicting, type MaybeConflicting, type VerificationStatus } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-cyan" />
      <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">{text}</span>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

const workAreaTones = ['from-blue/20', 'from-cyan/10'] as const

function isPublishable(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'SOURCE_SUPPORTED'
}

function publishedValue<T>(field: MaybeConflicting<T>): T | undefined {
  if (isConflicting(field)) return undefined
  if (!isPublishable(field.verificationStatus)) return undefined
  return field.value
}

const publicFoundingYear = publishedValue(foundingYear)
const publicStaffCount = publishedValue(staffCount)
const publicYears = publishedValue(yearsOfExperience)
const publicMission = isPublishable(mission.verificationStatus) ? mission.value : undefined
const publicVision = isPublishable(vision.verificationStatus) ? vision.value : undefined
const publicValues = publishedValue(values)
const publicLeadership = [...leadership.legacyTeam, ...leadership.prototypeTeam].filter((person) =>
  isPublishable(person.verificationStatus),
)
const publicMilestones = prototypeMilestones.filter((milestone) => isPublishable(milestone.verificationStatus))

const identityCards = [
  publicYears
    ? { val: publicYears, label: 'Years of Operation' }
    : { val: shortName.value, label: 'Aerospace Manufacturing' },
  publicStaffCount
    ? { val: publicStaffCount, label: 'Expert Engineers' }
    : { val: 'MRO', label: 'Tooling Solutions' },
]

const companySummary = `${officialName.value} (${shortName.value}) is an ${description.value.charAt(0).toLowerCase()}${description.value.slice(1)}`

const profileCards = [
  publicMission
    ? { title: 'Our Mission', text: publicMission }
    : { title: 'Who We Are', text: companySummary },
  publicVision
    ? { title: 'Our Vision', text: publicVision }
    : { title: 'What We Do', items: publicWorkAreas.slice(0, 3) },
  publicValues
    ? { title: 'Our Values', items: publicValues }
    : { title: 'How We Work', items: publicWorkAreas.slice(3) },
]

export default function About({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-canvas overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="absolute inset-0">
          <img src={images.aboutHeroImage} alt="Igniting Minds Aerospace team" className={`w-full h-full ${photoObjectClass(images.aboutHeroImage, 'bleed')} opacity-[0.12]`} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">About</span>
          </div>
          <SectionLabel text="About Us" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Engineering<br />Excellence
            {publicFoundingYear ? (
              <>
                <br />
                <span className="text-cyan">Since {publicFoundingYear}</span>
              </>
            ) : (
              <>
                <br />
                <span className="text-cyan">{shortName.value}</span>
              </>
            )}
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            {description.value}
          </p>
        </div>
      </section>

      {/* Identity + work areas (replaces unverified mission / vision / values) */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-3 gap-px bg-border-light">
            {profileCards.map(item => (
              <div key={item.title} className="bg-off p-10">
                <div className="w-8 h-px bg-cyan mb-6" />
                <h2 className="font-display font-bold text-navy text-3xl uppercase mb-4">{item.title}</h2>
                {item.text && <p className="text-mid leading-relaxed">{item.text}</p>}
                {item.items && (
                  <ul className="space-y-2">
                    {item.items.map(v => (
                      <li key={v} className="flex items-center gap-3 text-sm text-mid">
                        <div className="w-1.5 h-1.5 bg-cyan shrink-0" />
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-canvas py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel text="Our Story" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-6">
                Aerospace<br />Engineering
              </h2>
              <div className="space-y-4 text-steel leading-relaxed">
                <p>
                  {officialName.value} is an {description.value.charAt(0).toLowerCase()}
                  {description.value.slice(1)}
                </p>
                <p>
                  Work areas include {publicWorkAreas.slice(0, 3).map((area) => area.toLowerCase()).join(', ')}.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden bg-navy">
                <img src={images.aboutHeritageImage} alt="Igniting Minds Aerospace manufacturing facility" className={`w-full h-full ${photoObjectClass(images.aboutHeritageImage)} opacity-70`} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                {identityCards.map(s => (
                  <div key={s.label} className="bg-navy/85 backdrop-blur border border-border-dark p-4">
                    <div className="font-display font-bold text-cyan text-2xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-steel mt-1 tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {publicMilestones.length > 0 && (
        <section className="bg-off py-24">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <SectionLabel text="Milestones" />
            <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-border-light hidden sm:block" />
              <div className="space-y-8">
                {publicMilestones.map((m) => (
                  <div key={m.year} className="sm:flex items-start gap-8">
                    <div className="shrink-0 w-20 text-right">
                      <span className="font-mono font-semibold text-blue text-sm">{m.year}</span>
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-4 shrink-0 relative z-10 mt-0.5">
                      <div className="w-2.5 h-2.5 bg-cyan border-2 border-off" />
                    </div>
                    <div className="sm:pt-0 pt-2 border-l border-border-light pl-6 sm:border-0 sm:pl-0">
                      <h3 className="font-display font-bold text-navy text-xl uppercase mb-1">{m.event}</h3>
                      <p className="text-mid text-sm leading-relaxed">{m.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Work areas occupy the former leadership layout. Names stay in the content model. */}
      <section id="leadership" className="bg-canvas py-24 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SectionLabel text={publicLeadership.length > 0 ? 'Leadership Team' : 'Our Work'} />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            {publicLeadership.length > 0 ? (
              <>
                Guided by<br />Industry Veterans
              </>
            ) : (
              <>
                Engineering &<br />Manufacturing
              </>
            )}
          </h2>
          {publicLeadership.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
              {publicLeadership.map((person, index) => (
                <div key={person.name} className={`bg-gradient-to-b ${workAreaTones[index % 2]} to-navy-mid p-8 hover:to-navy-light transition-colors`}>
                  <div className="w-16 h-16 bg-navy-light border border-border-dark flex items-center justify-center mb-5">
                    <svg viewBox="0 0 32 32" className="w-8 h-8 text-steel" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="16" cy="11" r="5" />
                      <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl uppercase">{person.name}</h3>
                  <div className="font-mono text-[10px] text-cyan uppercase tracking-wider mt-1 mb-2">{person.title}</div>
                  <div className="font-mono text-[10px] text-steel">{person.summary}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
              {publicWorkAreas.map((area, index) => (
                <div key={area} className={`bg-gradient-to-b ${workAreaTones[index % 2]} to-navy-mid p-8 hover:to-navy-light transition-colors`}>
                  <div className="w-16 h-16 bg-navy-light border border-border-dark flex items-center justify-center mb-5">
                    <svg viewBox="0 0 32 32" className="w-8 h-8 text-steel" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="16" cy="11" r="5" />
                      <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl uppercase">{area}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Ready to Partner?</h2>
            <p className="text-white/70 mt-2">Discover how we can support your aerospace program.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('quote')} className="bg-white text-blue hover:bg-off font-medium text-sm px-7 py-3.5 flex items-center gap-2 transition-colors">
              Request a Quote <ArrowRight />
            </button>
            <button onClick={() => navigate('contact')} className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-3.5 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
