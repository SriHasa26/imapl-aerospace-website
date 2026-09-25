import { useEffect, useState, type CSSProperties } from 'react'
import type { NavigateFn } from '../App'
import LifeAtImapl from '../components/LifeAtImapl'
import LeadershipProfileModal from '../components/LeadershipProfileModal'
import { images } from '../content/assets'
import { photoClass } from '../content/imagePresentation'
import {
  isConfirmedOpening,
  legacyRoles,
  prototypeBenefits,
  prototypeCultureStats,
  prototypeRoles,
} from '../content/careers'
import {
  description,
  leadership,
  mission,
  officialName,
  publicWorkAreas,
  shortName,
  values,
  vision,
} from '../content/company'
import { capabilities } from '../content/capabilities'
import { isConflicting, isPublishable } from '../content/types'

interface Props { navigate: NavigateFn }

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const portraitFocus: Record<string, string> = {
  'Chakrapani M': 'center 18%',
  'Manjunatha S': 'center 14%',
  'Beerappa K': 'center 20%',
}

const allRoles = [...legacyRoles, ...prototypeRoles]
const confirmedOpenings = allRoles.filter(isConfirmedOpening)
const publicBenefits = prototypeBenefits.filter((benefit) => isPublishable(benefit.verificationStatus))
const publicCultureStats = prototypeCultureStats.filter((stat) => isPublishable(stat.verificationStatus))
const publicLeadership = leadership.legacyTeam.filter((person) => isPublishable(person.verificationStatus))
const publicValues = isConflicting(values)
  ? (values.candidates.find((candidate) => isPublishable(candidate.verificationStatus))?.value ?? [])
  : (isPublishable(values.verificationStatus) ? values.value : [])
const machining = capabilities.find((item) => item.id === 'cnc-machining' && isPublishable(item.verificationStatus))
const getProgramme = legacyRoles.find((role) => role.id === 'get')

const heroStats = publicCultureStats.filter((stat) => /open roles|departments|glassdoor/i.test(stat.label))
const identityHeroStats = [
  { val: shortName.value, label: 'Aerospace Manufacturing' },
  { val: 'MRO', label: 'Tooling Solutions' },
  { val: 'CNC', label: 'Precision Components' },
]
const displayedHeroStats = heroStats.length > 0
  ? heroStats.map((stat) => ({ val: stat.val, label: stat.label }))
  : identityHeroStats

const whyCards = [
  {
    num: '01',
    title: 'Precision Engineering',
    desc: description.value,
  },
  {
    num: '02',
    title: 'Advanced Manufacturing',
    desc: machining?.description ?? 'CNC machining, precision inspection systems, and process-driven manufacturing workflows.',
  },
  {
    num: '03',
    title: 'Hands-On Learning',
    desc: getProgramme?.description ?? 'Learning and development through engineering and manufacturing work.',
  },
  {
    num: '04',
    title: 'Collaborative Teams',
    desc: 'Built on collaboration and transparency.',
  },
  {
    num: '05',
    title: 'Quality-Driven Culture',
    desc: publicWorkAreas.find((area) => /quality/i.test(area)) ?? 'Quality-Driven Manufacturing',
  },
  {
    num: '06',
    title: 'Integrated Engineering',
    desc: publicWorkAreas.find((area) => /integrated/i.test(area)) ?? 'Integrated Engineering & Manufacturing',
  },
]

const lifeCards = [
  {
    title: 'Engineering',
    desc: machining?.description ?? description.value,
    img: images.machiningImage,
    alt: 'CNC machining at IMAPL',
  },
  {
    title: 'Collaboration',
    desc: 'Engineering discussion and manufacturing teamwork on the shop floor.',
    img: images.aboutHeroImage,
    alt: 'IMAPL engineering discussion',
  },
  {
    title: 'Learning',
    desc: getProgramme?.description ?? 'Hands-on industry exposure, learning and development, mentorship.',
    img: images.workshopImage,
    alt: 'IMAPL manufacturing workshop',
  },
]

const bentoAreas = ['eng', 'collab', 'learn']

type Leader = (typeof publicLeadership)[number]

export default function Careers({ navigate }: Props) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [openLeader, setOpenLeader] = useState<Leader | null>(null)

  useEffect(() => {
    // Hero is always the first thing on the page, so reveal it on mount rather than
    // waiting for a scroll-triggered IntersectionObserver — gating it on scroll
    // position raced against the navigation scroll-to-top reset and could leave it
    // permanently hidden.
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['car-why', 'car-life', 'car-split', 'car-openings', 'car-culture', 'car-gallery']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(ids.map((id) => [id, true])))
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) revealObserver.observe(el)
    })

    return () => {
      window.cancelAnimationFrame(revealId)
      revealObserver.disconnect()
    }
  }, [])

  return (
    <div className="careers-page">
      <section
        className={`careers-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <img
          src={images.careersHeroPhoto}
          alt=""
          aria-hidden="true"
          className="careers-hero-photo absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/75" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full min-w-0 px-6 xl:px-12">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Careers</span>
          </div>
          <h1 className="careers-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Build the Future<br />with Precision
          </h1>
          <p className="careers-lede text-steel max-w-2xl w-full min-w-0 text-lg leading-relaxed mb-10">
            {description.value} Current vacancies are not confirmed on this site.
          </p>
          <div className="careers-lede grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl border-t border-border-dark pt-8">
            {displayedHeroStats.map((s) => (
              <div key={s.label} className="quality-card quality-card--dark p-5 text-center">
                <div className="font-display font-black text-white text-3xl mb-1">{s.val}</div>
                <div className="font-mono text-[11px] text-cyan uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      <section id="car-why" className={`careers-why min-h-screen flex items-center ${revealed['car-why'] ? 'is-visible' : ''}`}>
        <div className="careers-why-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">01 / Why IMAPL</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">Why Work with {shortName.value}</h2>
          <p className="text-steel max-w-2xl leading-relaxed mb-10">{mission.value}</p>
          <div className="careers-why-cards">
            {whyCards.map((card, index) => (
              <article
                key={card.num}
                className="careers-why-card"
                style={{ '--careers-stagger': `${index * 80}ms` } as CSSProperties}
              >
                <div className="careers-why-num font-mono text-[11px] text-orange tracking-widest">{card.num}</div>
                <div className="careers-why-mark" aria-hidden="true" />
                <h3 className="font-display font-bold text-white text-xl uppercase mb-3">{card.title}</h3>
                <p className="text-steel text-sm leading-relaxed">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="car-life" className={`careers-life min-h-screen flex items-center ${revealed['car-life'] ? 'is-visible' : ''}`}>
        <div className="careers-life-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">02 / Life at {shortName.value}</span>
          </div>
          <h2 className="font-display font-bold text-navy text-4xl uppercase mb-4">Life at {shortName.value}</h2>
          <p className="text-mid max-w-2xl leading-relaxed mb-10">{vision.value}</p>
          <div className="careers-bento">
            <article className="careers-bento-tile careers-bento-team">
              <img
                src={images.careersGroupImage}
                alt="Igniting Minds Aerospace team"
                loading="lazy"
                decoding="async"
                className={`${photoClass(images.careersGroupImage, 'photo', 'pair')} careers-bento-img`}
              />
              <div className="careers-bento-overlay">
                <span className="font-mono text-[11px] text-cyan uppercase tracking-widest">Our People</span>
                <span className="font-display font-bold text-white text-2xl lg:text-3xl uppercase leading-tight">One Team, One Mission</span>
              </div>
            </article>
            <article className="careers-bento-tile careers-bento-culture">
              <img
                src={images.careersCultureImage}
                alt="Training at IMAPL"
                loading="lazy"
                decoding="async"
                className={`${photoClass(images.careersCultureImage, 'decorative')} careers-bento-img`}
              />
              <div className="careers-bento-overlay">
                <span className="font-mono text-[11px] text-cyan uppercase tracking-widest">Development</span>
                <span className="font-display font-bold text-white text-xl uppercase leading-tight">Hands-On Training</span>
              </div>
            </article>
            {lifeCards.map((card, index) => (
              <article
                key={card.title}
                className={`careers-bento-tile careers-bento-${bentoAreas[index] ?? 'eng'}`}
                style={{ '--careers-stagger': `${(index + 2) * 80}ms` } as CSSProperties}
              >
                <img
                  src={card.img}
                  alt={card.alt}
                  loading="lazy"
                  className={`${photoClass(card.img, 'decorative')} careers-bento-img`}
                />
                <div className="careers-bento-overlay">
                  <span className="font-mono text-[11px] text-cyan uppercase tracking-widest">{card.title}</span>
                </div>
              </article>
            ))}
          </div>
          {publicValues.length > 0 && (
            <div className="careers-values">
              {publicValues.map((value) => (
                <div key={value} className="careers-value">
                  <span className="careers-value-dot" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-navy uppercase tracking-widest">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="car-split" className={`careers-split min-h-screen flex items-center ${revealed['car-split'] ? 'is-visible' : ''}`}>
        <div className="careers-split-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
          <div className="careers-people min-w-0">
            <div className="careers-eyebrow flex items-center gap-3 mb-3">
              <div className="careers-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">03 / People</span>
            </div>
            <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">People of {shortName.value}</h2>
            <p className="text-steel text-sm leading-relaxed mb-8 max-w-xl">
              Leadership published in the company profile. Employee testimonials are not published on this site.
            </p>
            <div className="about-leaders-grid">
              {publicLeadership.map((person) => {
                const src = person.photo ? images[person.photo] : undefined
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
                          style={{ objectPosition: portraitFocus[person.name] ?? 'center 16%' }}
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
                      {person.summary && <div className="about-leader-summary font-mono text-xs text-steel">{person.summary}</div>}
                      <button type="button" className="about-leader-profile-btn" onClick={() => setOpenLeader(person)}>
                        View Profile <AR />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="car-openings" className={`careers-openings-section min-h-screen flex items-center ${revealed['car-openings'] ? 'is-visible' : ''}`}>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="careers-openings min-w-0">
              <div className="careers-eyebrow flex items-center gap-3 mb-3">
                <div className="careers-eyebrow-rule h-px bg-orange" />
                <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">04 / Opportunities</span>
              </div>
              <h2 className="font-display font-bold text-navy text-4xl uppercase mb-6">
                {confirmedOpenings.length > 0 ? 'Current Openings' : 'Career Opportunities'}
              </h2>
              {confirmedOpenings.length > 0 ? (
                <div className="careers-role-list">
                  {confirmedOpenings.map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => navigate('contact')}
                      className="careers-role"
                    >
                      <div>
                        {job.dept && (
                          <div className="font-mono text-[11px] text-blue uppercase tracking-widest mb-2">{job.dept}</div>
                        )}
                        <h3 className="font-display font-bold text-navy text-lg uppercase">{job.role}</h3>
                      </div>
                      <span className="careers-text-btn">Enquire <AR /></span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="careers-status careers-status--light careers-status--wide">
                  <div className="careers-status-row">
                    <span className="careers-status-dot" aria-hidden="true" />
                    <div>
                      <div className="font-mono text-[11px] text-blue uppercase tracking-widest mb-1">Current status</div>
                      <h3 className="font-display font-bold text-navy text-2xl uppercase">No confirmed openings at this time</h3>
                    </div>
                  </div>
                  <p className="text-mid text-sm leading-relaxed max-w-2xl">
                    No confirmed current vacancies are published. Legacy and prototype role titles are held internally and are not presented as open positions.
                  </p>
                  <p className="text-mid text-sm leading-relaxed max-w-2xl">
                    We welcome professional enquiries regarding future opportunities at {shortName.value}. The contact form submits an enquiry; it does not send a resume or application to HR.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('contact')}
                    className="btn-chamfer group bg-orange hover:bg-orange-light text-white font-medium text-sm tracking-wide px-7 py-3.5 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 w-fit"
                  >
                    Contact Our Team <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>

            <div className="careers-openings-figure relative">
              <div className="careers-openings-well">
                <img
                  src={images.careersImage}
                  alt="Igniting Minds Aerospace team"
                  loading="lazy"
                  decoding="async"
                  className={`${photoClass(images.careersImage, 'decorative')} careers-openings-img`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="car-culture" className={`careers-culture min-h-screen flex items-center ${revealed['car-culture'] ? 'is-visible' : ''}`}>
        <div className="careers-culture-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">05 / Culture</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">Engineering Beyond the Drawing</h2>
          <p className="text-steel max-w-2xl leading-relaxed mb-10">
            {officialName.value} work areas listed on the company profile.
          </p>
          <div className="careers-flow">
            {publicWorkAreas.map((area, index) => (
              <article
                key={area}
                className="careers-flow-card"
                style={{ '--careers-stagger': `${index * 80}ms` } as CSSProperties}
              >
                <div className="font-mono text-[11px] text-orange tracking-widest mb-3">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="font-display font-bold text-white text-lg uppercase leading-tight">{area}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {publicBenefits.length > 0 && (
        <section className="careers-benefits min-h-screen flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
            <h2 className="font-display font-bold text-white text-4xl uppercase mb-12">What We Offer</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicBenefits.map((b) => (
                <div key={b.title} className="careers-why-card">
                  <h3 className="font-display font-bold text-white text-xl uppercase mb-3">{b.title}</h3>
                  <p className="text-steel text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <LifeAtImapl visible={revealed['car-gallery']} />

      <section className="bg-orange min-h-screen flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase mb-4">Interested in Careers?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Contact the team about careers. This does not submit an application or store a resume.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
            >
              Enquire via Contact <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
