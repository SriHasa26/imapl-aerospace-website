import { useEffect, useRef, useState } from 'react'
import type { Page } from '../App'
import { images, type ImageKey } from '../content/assets'
import { imageFrame, photoClass } from '../content/imagePresentation'
import LeadershipProfileModal from '../components/LeadershipProfileModal'
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
  workAreaDescriptions,
  workAreaImages,
  yearsOfExperience,
  type LeadershipPerson,
} from '../content/company'
import { isConflicting, type MaybeConflicting, type VerificationStatus } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-6 h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
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
const lightWorkPhotos = new Set<ImageKey>([
  'precisionComponents',
  'mroTooling',
  'productAeroEngineTooling',
  'jigsFixtures',
])
const coverWorkPhotos = new Set<ImageKey>(['qualityImage'])

const portraitFocus: Record<string, string> = {
  'Chakrapani M': 'center 18%',
  'Manjunatha S': 'center 14%',
  'Beerappa K': 'center 20%',
}

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

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.18 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

export default function About({ navigate }: Props) {
  const profileReveal = useInView()
  const [openLeader, setOpenLeader] = useState<LeadershipPerson | null>(null)
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.aboutHeroImage} alt="Engineering discussion on the shop floor" className={`${photoClass(images.aboutHeroImage, 'decorative')} opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/78 via-navy/40 to-navy/22" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/72 via-transparent to-navy/18" />
        </div>
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
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
      <section className="about-profile-section">
        <div className="about-profile-orb about-profile-orb-a" />
        <div className="about-profile-orb about-profile-orb-b" />
        <div className="about-profile-sheen" aria-hidden="true" />
        <div
          ref={profileReveal.ref}
          className={`about-profile-inner max-w-[1440px] mx-auto px-6 xl:px-12 ${profileReveal.visible ? 'is-visible' : ''}`}
        >
          <div className="about-profile-grid">
            {profileCards.map((item, index) => (
              <article
                key={item.title}
                className="about-profile-card"
              >
                <span className="about-profile-index">0{index + 1}</span>
                <div className="about-profile-rule" />
                <h2 className="about-profile-title">{item.title}</h2>
                {item.text && <p className="about-profile-copy">{item.text}</p>}
                {item.items && (
                  <ul className="about-profile-list">
                    {item.items.map((value) => (
                      <li key={value}>
                        <span className="about-profile-mark" />
                        {value}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-navy py-24">
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
                  {publicFoundingYear ? ` Founded in ${publicFoundingYear} and headquartered in Bengaluru.` : ''}
                </p>
                <p>
                  Work areas include {publicWorkAreas.slice(0, 4).map((area) => area.toLowerCase()).join(', ')}.
                </p>
              </div>
            </div>
            <div>
              <div className={`${imageFrame.group} relative bg-navy`}>
                <img src={images.aboutHeritageImage} alt="Igniting Minds Aerospace team on the manufacturing floor" className={`${photoClass(images.aboutHeritageImage, 'photo', 'group')}`} />
              </div>
              <div className="about-story-pair">
                <div className="about-story-pair-frame">
                  <img src={images.aboutTeamSeatedImage} alt="Igniting Minds Aerospace team" className={`${photoClass(images.aboutTeamSeatedImage, 'photo', 'pair')} about-story-pair-img`} loading="lazy" decoding="async" />
                </div>
                <div className="about-story-pair-frame">
                  <img src={images.careersGroupImage} alt="Igniting Minds Aerospace employees at the manufacturing facility" className={`${photoClass(images.careersGroupImage, 'photo', 'pair')} about-story-pair-img`} loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="about-story-stats">
                {identityCards.map(s => (
                  <div key={s.label} className="bg-navy-mid border border-border-dark p-4">
                    <div className="font-display font-bold text-cyan text-2xl">{s.val}</div>
                    <div className="font-mono text-xs text-steel mt-1 tracking-wider">{s.label}</div>
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

      {/* Work areas with official photographs */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SectionLabel text="Our Work" />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-8 lg:mb-10">
            Engineering &<br />Manufacturing
          </h2>
          <div className="about-work-grid">
            {publicWorkAreas.map((area, index) => {
              const imageKey = workAreaImages[area]
              const src = imageKey ? images[imageKey] : undefined
              return (
                <div key={area} className={`about-work-card bg-gradient-to-b ${workAreaTones[index % 2]} to-navy-mid hover:to-navy-light`}>
                  {src && (
                    <div className={[
                      'about-work-photo',
                      imageKey && lightWorkPhotos.has(imageKey) ? 'about-work-photo--light' : '',
                      imageKey && coverWorkPhotos.has(imageKey) ? 'about-work-photo--cover' : 'about-work-photo--contain',
                    ].filter(Boolean).join(' ')}>
                      <img
                        src={src}
                        alt={area}
                        className="about-work-photo-img im-photo-hover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-5 lg:p-6">
                    <h3 className="font-display font-bold text-white text-xl uppercase mb-2">{area}</h3>
                    {workAreaDescriptions[area] && (
                      <p className="text-steel text-sm leading-relaxed">{workAreaDescriptions[area]}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {publicLeadership.length > 0 && (
        <section id="leadership" className="about-leaders-section py-16 scroll-mt-24">
          <div className="about-leaders-inner max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="about-leaders-heading">
              <SectionLabel text="Leadership Team" />
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight">
                Guided by<br />Industry Veterans
              </h2>
            </div>
            <div className="about-leaders-grid">
              {publicLeadership.map((person) => {
                const photoKey = 'photo' in person ? person.photo : undefined
                const src = photoKey ? images[photoKey] : undefined
                const focus = portraitFocus[person.name] ?? 'center 16%'
                return (
                  <article key={person.name} className="about-leader-card">
                    {src ? (
                      <div className="about-leader-photo">
                        <img
                          src={src}
                          alt={person.name}
                          width={400}
                          height={500}
                          style={{ objectPosition: focus }}
                        />
                      </div>
                    ) : (
                      <div className="about-leader-photo flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-8 h-8 text-steel" fill="none" stroke="currentColor" strokeWidth="1">
                          <circle cx="16" cy="11" r="5" />
                          <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" />
                        </svg>
                      </div>
                    )}
                    <div className="about-leader-copy">
                      <h3 className="font-display font-bold text-white text-xl uppercase">{person.name}</h3>
                      <div className="font-mono text-xs text-cyan uppercase tracking-wider mt-1 mb-2">{person.title}</div>
                      <div className="about-leader-summary font-mono text-xs text-steel">{person.summary}</div>
                      <button
                        type="button"
                        className="about-leader-profile-btn"
                        onClick={() => setOpenLeader(person)}
                      >
                        View Profile <ArrowRight />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-orange py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Ready to Partner?</h2>
            <p className="text-white/70 mt-2">Discover how we can support your aerospace program.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('quote')} className="bg-white text-orange hover:bg-off font-medium text-sm px-7 py-3.5 flex items-center gap-2 transition-colors">
              Request a Quote <ArrowRight />
            </button>
            <button onClick={() => navigate('contact')} className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-3.5 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <LeadershipProfileModal
        person={openLeader}
        onClose={() => setOpenLeader(null)}
        portraitFocus={portraitFocus}
      />
    </div>
  )
}
