import { useEffect, useRef, useState, type CSSProperties } from 'react'
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

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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

type Leader = (typeof publicLeadership)[number]

export default function Careers({ navigate }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [openLeader, setOpenLeader] = useState<Leader | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['car-why', 'car-life', 'car-split', 'car-culture', 'car-gallery', 'car-cta']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      setRevealed(Object.fromEntries(ids.map((id) => [id, true])))
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
      heroObserver.disconnect()
      revealObserver.disconnect()
    }
  }, [])

  return (
    <div className="careers-page">
      <section
        ref={heroRef}
        className={`careers-hero relative overflow-hidden ${heroVisible ? 'is-visible' : ''}`}
      >
        <img
          src={images.careersImage}
          alt="Igniting Minds Aerospace team"
          className={`absolute inset-0 ${photoClass(images.careersImage, 'decorative')} opacity-[0.5]`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/78 via-navy/42 to-navy/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/20" />
        <div className="careers-hero-ambient" aria-hidden="true" />
        <div className="careers-hero-grid" aria-hidden="true" />
        <div className="careers-hero-scan" aria-hidden="true" />
        <span className="careers-hero-dot careers-hero-dot--a" aria-hidden="true" />
        <span className="careers-hero-dot careers-hero-dot--b" aria-hidden="true" />
        <span className="careers-hero-dot careers-hero-dot--c" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto w-full min-w-0 px-6 xl:px-12">
          <div className="careers-crumb font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Careers</span>
          </div>
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Careers</span>
          </div>
          <h1 className="careers-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Build the Future<br />with Precision
          </h1>
          <p className="careers-lede text-steel max-w-2xl w-full min-w-0 text-lg leading-relaxed">
            {description.value} Current vacancies are not confirmed on this site.
          </p>
          <div className="careers-hero-stats mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border-dark pt-8">
            {displayedHeroStats.map((s) => (
              <div key={s.label} className="careers-stat min-w-0">
                <div className="font-display font-bold text-white text-4xl">{s.val}</div>
                <div className="font-mono text-xs text-cyan mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="car-why" className={`careers-why ${revealed['car-why'] ? 'is-visible' : ''}`}>
        <div className="careers-why-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
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

      <section id="car-life" className={`careers-life ${revealed['car-life'] ? 'is-visible' : ''}`}>
        <div className="careers-life-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">02 / Life at {shortName.value}</span>
          </div>
          <h2 className="font-display font-bold text-navy text-4xl uppercase mb-4">Life at {shortName.value}</h2>
          <p className="text-mid max-w-2xl leading-relaxed mb-10">{vision.value}</p>
          <div className="careers-life-pair">
            <article className="careers-life-card careers-life-pair-card">
              <div className="careers-life-well">
                <img
                  src={images.careersGroupImage}
                  alt="Igniting Minds Aerospace team"
                  loading="lazy"
                  decoding="async"
                  className={`${photoClass(images.careersGroupImage, 'photo', 'pair')} careers-life-img`}
                />
              </div>
            </article>
            <article className="careers-life-card careers-life-pair-card">
              <div className="careers-life-well">
                <img
                  src={images.careersCultureImage}
                  alt="Training at IMAPL"
                  loading="lazy"
                  decoding="async"
                  className={`${photoClass(images.careersCultureImage, 'decorative')} careers-life-img`}
                />
              </div>
            </article>
          </div>
          <div className="careers-life-grid">
            {lifeCards.map((card, index) => (
              <article
                key={card.title}
                className="careers-life-card"
                style={{ '--careers-stagger': `${index * 80}ms` } as CSSProperties}
              >
                <div className="careers-life-well">
                  <img
                    src={card.img}
                    alt={card.alt}
                    loading="lazy"
                    className={`${photoClass(card.img, 'decorative')} careers-life-img`}
                  />
                </div>
                <div className="careers-life-body">
                  <h3 className="font-display font-bold text-navy text-xl uppercase mb-2">{card.title}</h3>
                  <p className="text-mid text-sm leading-relaxed">{card.desc}</p>
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

      <section id="car-split" className={`careers-split ${revealed['car-split'] ? 'is-visible' : ''}`}>
        <div className="careers-split-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="careers-split-grid">
            <div className="careers-people min-w-0">
              <div className="careers-eyebrow flex items-center gap-3 mb-3">
                <div className="careers-eyebrow-rule h-px bg-orange" />
                <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">03 / People</span>
              </div>
              <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">People of {shortName.value}</h2>
              <p className="text-steel text-sm leading-relaxed mb-8 max-w-xl">
                Leadership published in the company profile. Employee testimonials are not published on this site.
              </p>
              <div className="careers-people-list">
                {publicLeadership.map((person, index) => {
                  const src = person.photo ? images[person.photo] : undefined
                  return (
                    <article
                      key={person.name}
                      className="careers-person"
                      style={{ '--careers-stagger': `${index * 80}ms` } as CSSProperties}
                    >
                      <div className="careers-person-photo">
                        {src ? (
                          <img
                            src={src}
                            alt={person.name}
                            width={160}
                            height={200}
                            loading="lazy"
                            className="careers-person-img"
                            style={{ objectPosition: portraitFocus[person.name] ?? 'center 16%' }}
                          />
                        ) : (
                          <div className="careers-person-fallback" />
                        )}
                      </div>
                      <div className="careers-person-copy min-w-0">
                        <div className="font-mono text-[11px] text-cyan uppercase tracking-widest mb-1">{person.title}</div>
                        <h3 className="font-display font-bold text-white text-xl uppercase mb-2">{person.name}</h3>
                        {person.summary && <p className="text-steel text-sm leading-relaxed mb-4">{person.summary}</p>}
                        <button type="button" className="careers-text-btn" onClick={() => setOpenLeader(person)}>
                          View Profile <AR />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <aside className="careers-openings min-w-0">
              <div className="careers-eyebrow flex items-center gap-3 mb-3">
                <div className="careers-eyebrow-rule h-px bg-orange" />
                <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">04 / Opportunities</span>
              </div>
              <h2 className="font-display font-bold text-white text-4xl uppercase mb-6">
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
                          <div className="font-mono text-[11px] text-cyan uppercase tracking-widest mb-2">{job.dept}</div>
                        )}
                        <h3 className="font-display font-bold text-white text-lg uppercase">{job.role}</h3>
                      </div>
                      <span className="careers-text-btn">Enquire <AR /></span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="careers-status">
                  <div className="careers-status-row">
                    <span className="careers-status-dot" aria-hidden="true" />
                    <div>
                      <div className="font-mono text-[11px] text-cyan uppercase tracking-widest mb-1">Current status</div>
                      <h3 className="font-display font-bold text-white text-2xl uppercase">No confirmed openings at this time</h3>
                    </div>
                  </div>
                  <p className="text-steel text-sm leading-relaxed">
                    No confirmed current vacancies are published. Legacy and prototype role titles are held internally and are not presented as open positions.
                  </p>
                  <p className="text-steel text-sm leading-relaxed">
                    We welcome professional enquiries regarding future opportunities at {shortName.value}. The contact form submits an enquiry; it does not send a resume or application to HR.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('contact')}
                    className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-7 py-3.5 flex items-center gap-2 transition-colors w-fit"
                  >
                    Contact Our Team <AR />
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section id="car-culture" className={`careers-culture ${revealed['car-culture'] ? 'is-visible' : ''}`}>
        <div className="careers-culture-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
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
                {index < publicWorkAreas.length - 1 && <div className="careers-flow-line" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      {publicBenefits.length > 0 && (
        <section className="careers-benefits">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
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

      <section id="car-cta" className={`careers-cta ${revealed['car-cta'] ? 'is-visible' : ''}`}>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="careers-cta-panel">
            <div>
              <h2 className="font-display font-bold text-white text-4xl uppercase">Interested in Careers?</h2>
              <p className="text-white/70 mt-2 max-w-lg">
                Contact the team about careers. This does not submit an application or store a resume.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="bg-white text-orange hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors shrink-0"
            >
              Enquire via Contact <AR />
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
