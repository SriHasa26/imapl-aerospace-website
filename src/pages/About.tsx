import { useEffect, useRef, useState } from 'react'
import type { Page } from '../App'
import { images, type ImageKey } from '../content/assets'
import { imageFrame, photoClass } from '../content/imagePresentation'
import LeadershipProfileModal from '../components/LeadershipProfileModal'
import {
  description,
  leadership,
  mission,
  officialName,
  prototypeMilestones,
  publicWorkAreas,
  shortName,
  vision,
  type LeadershipPerson,
} from '../content/company'
import type { VerificationStatus } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-6 h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">{text}</span>
    </div>
  )
}

function ArrowRight({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

const lightWorkPhotos = new Set<ImageKey>([
  'precisionComponents',
  'mroTooling',
  'productAeroEngineTooling',
  'jigsFixtures',
])
const coverWorkPhotos = new Set<ImageKey>(['qualityImage'])

const portraitFocus: Record<string, string> = {
  'Chakrapani Muppalla': 'center 18%',
  'Manjunatha S': 'center 14%',
  'Beerappa K': 'center 20%',
}

const workCards: Array<{ title: string; image: ImageKey; description: string }> = [
  {
    title: 'Aero Engine Tooling',
    image: 'productAeroEngineTooling',
    description: 'Precision tooling solutions for aero-engine assembly, maintenance, and servicing applications.',
  },
  {
    title: 'Precision Aerospace Components',
    image: 'precisionComponents',
    description: 'High-precision components manufactured to meet demanding aerospace specifications and quality standards.',
  },
  {
    title: 'MRO Tooling Solutions',
    image: 'mroTooling',
    description: 'Specialised tooling and ground support equipment for aircraft maintenance, repair, and overhaul.',
  },
  {
    title: 'Aerospace Assembly Tooling',
    image: 'assemblyImage',
    description: 'Custom-built tooling and assembly systems for accurate positioning, alignment, and repeatable assembly operations.',
  },
  {
    title: 'Jigs & Fixtures',
    image: 'jigsFixtures',
    description: 'Engineered jigs and fixtures for precision machining, component holding, assembly, and inspection.',
  },
  {
    title: 'Precision Quality & Inspection',
    image: 'qualityImage',
    description: 'Dimensional inspection and verification to ensure accuracy, traceability, and compliance with customer requirements.',
  },
]

function isPublishable(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'SOURCE_SUPPORTED'
}

const publicMission = isPublishable(mission.verificationStatus) ? mission.value : undefined
const publicVision = isPublishable(vision.verificationStatus) ? vision.value : undefined
const publicLeadership = [...leadership.legacyTeam, ...leadership.prototypeTeam].filter((person) =>
  isPublishable(person.verificationStatus),
)
const publicMilestones = prototypeMilestones.filter((milestone) => isPublishable(milestone.verificationStatus))

const companySummary = `${officialName.value} (${shortName.value}) is an ${description.value.charAt(0).toLowerCase()}${description.value.slice(1)}`

const profileCards = [
  publicMission
    ? { title: 'Our Mission', text: publicMission }
    : { title: 'Who We Are', text: companySummary },
  publicVision
    ? { title: 'Our Vision', text: publicVision }
    : { title: 'What We Do', items: publicWorkAreas.slice(0, 3) },
]

const valuesIntro =
  'Our Values form the foundation of our Business. They define who we are, what we stand for, and guide how we Operate - both as a Company and as Individuals.'

const valueCards = [
  {
    letter: 'I',
    title: 'Integrity',
    copy: 'We uphold honesty, transparency, and ethical conduct in all our actions—doing the right thing, always.',
  },
  {
    letter: 'M',
    title: 'Mutual Respect',
    copy: 'We build strong relationships through open communication, trust, and respect for each individual’s contributions.',
  },
  {
    letter: 'A',
    title: 'Accountability',
    copy: 'We take ownership of our responsibilities and deliver on our commitments with discipline and reliability.',
  },
  {
    letter: 'P',
    title: 'Pursuit of Excellence',
    copy: 'We continuously strive for improvement, innovation, and quality in everything we do.',
  },
  {
    letter: 'L',
    title: 'Learning Mindset',
    copy: 'We embrace curiosity, feedback, and lifelong learning to adapt, grow, and lead in a changing world.',
  },
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
      <section className="relative min-h-screen min-h-[100svh] flex flex-col justify-center pt-32 pb-32 bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.aboutHeroImage} alt="Engineering discussion on the shop floor" className={`${photoClass(images.aboutHeroImage, 'decorative')} opacity-70`} decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/32 to-navy/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-navy/15" />
        </div>
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <SectionLabel text="About Us" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-3 [text-shadow:0_8px_32px_rgba(10,20,38,0.55)]">
            Precision Engineering<br />for Aerospace
          </h1>
          <p className="font-display font-bold text-cyan text-lg lg:text-xl uppercase tracking-[0.08em] mb-6 [text-shadow:0_2px_10px_rgba(10,20,38,0.5)]">
            Building Excellence Since 2017
          </p>
          <p className="text-steel max-w-2xl text-lg leading-relaxed [text-shadow:0_2px_10px_rgba(10,20,38,0.5)]">
            Igniting Minds Aerospace delivers precision aerospace tooling, complex components, jigs, fixtures, and
            MRO tooling solutions for global aerospace and defence customers.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[64px] sm:h-[92px] lg:h-[116px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#F7F5F1" />
          </svg>
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

            <article className="about-profile-card about-profile-card--values">
              <span className="about-profile-index">03</span>
              <div className="about-profile-rule" />
              <h2 className="about-profile-title">Values</h2>
              <p className="about-profile-copy">{valuesIntro}</p>
              <div className="about-values-grid">
                {valueCards.map((value) => (
                  <div key={value.letter} className="about-values-card">
                    <span className="about-values-letter">{value.letter}</span>
                    <h3 className="about-values-title">{value.title}</h3>
                    <p className="about-values-copy">{value.copy}</p>
                  </div>
                ))}
              </div>
            </article>
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
                Engineering Excellence.<br />Built on Trust.
              </h2>
              <div className="space-y-4 text-steel leading-relaxed">
                <p>
                  Founded in 2017 and headquartered in Bengaluru, Igniting Minds Aerospace (IMA) is an aerospace
                  manufacturing company specialising in precision tooling, complex aerospace components, jigs,
                  fixtures, and MRO tooling solutions.
                </p>
                <p>
                  We partner with global aerospace and defence customers to deliver precision-engineered solutions
                  that meet demanding quality, performance, and reliability requirements.
                </p>
                <p>
                  Our strength lies in our people, engineering expertise, and commitment to continuous improvement.
                  As we expand our global footprint and develop advanced manufacturing capabilities, our focus
                  remains on building lasting partnerships and delivering manufacturing excellence.
                </p>
              </div>
            </div>
            <div>
              <div className={`${imageFrame.group} relative bg-navy`}>
                <img src={images.aboutHeritageImage} alt="Igniting Minds Aerospace team on the manufacturing floor" className={`${photoClass(images.aboutHeritageImage, 'photo', 'group')}`} loading="lazy" decoding="async" />
              </div>
              <div className="about-story-pair">
                <div className="about-story-pair-frame">
                  <img src={images.aboutTeamSeatedImage} alt="Igniting Minds Aerospace team" className={`${photoClass(images.aboutTeamSeatedImage, 'photo', 'pair')} about-story-pair-img`} loading="lazy" decoding="async" />
                </div>
                <div className="about-story-pair-frame">
                  <img src={images.careersGroupImage} alt="Igniting Minds Aerospace employees at the manufacturing facility" className={`${photoClass(images.careersGroupImage, 'photo', 'pair')} about-story-pair-img`} loading="lazy" decoding="async" />
                </div>
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
      <section className="about-work-section py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SectionLabel text="Our Work" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-8 lg:mb-10">
            Engineering &<br />Manufacturing
          </h2>
          <div className="about-work-grid">
            {workCards.map((card) => {
              const src = images[card.image]
              return (
                <div key={card.title} className="about-work-card">
                  {src && (
                    <div className={[
                      'about-work-photo',
                      lightWorkPhotos.has(card.image) ? 'about-work-photo--light' : '',
                      coverWorkPhotos.has(card.image) ? 'about-work-photo--cover' : 'about-work-photo--contain',
                    ].filter(Boolean).join(' ')}>
                      <img
                        src={src}
                        alt={card.title}
                        className="about-work-photo-img im-photo-hover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-5 lg:p-6">
                    <h3 className="font-display font-bold text-navy text-xl uppercase mb-2">{card.title}</h3>
                    <p className="text-mid text-sm leading-relaxed">{card.description}</p>
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
              <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight sm:whitespace-nowrap">
                Leadership Built on Experience
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
                          loading="lazy"
                          decoding="async"
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
                      <h3 className="font-display font-bold text-white text-xl uppercase">{'displayName' in person ? person.displayName : person.name}</h3>
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
      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">Ready to Partner?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Discover how we can support your aerospace program.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="btn-chamfer group bg-white text-orange hover:bg-off font-medium text-sm tracking-wide px-7 py-3.5 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Request a Quote <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('contact')} className="btn-chamfer border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm tracking-wide px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5">
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
