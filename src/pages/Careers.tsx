import type { Page } from '../App'
import UnconfirmedNote from '../components/UnconfirmedNote'
import { images } from '../content/assets'
import {
  isConfirmedOpening,
  legacyRoles,
  prototypeBenefits,
  prototypeCultureStats,
  prototypeRoles,
} from '../content/careers'
import { description, officialName, publicWorkAreas, shortName } from '../content/company'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const allRoles = [...legacyRoles, ...prototypeRoles]
const confirmedOpenings = allRoles.filter(isConfirmedOpening)
const publicBenefits = prototypeBenefits.filter((benefit) => isPublishable(benefit.verificationStatus))
const publicCultureStats = prototypeCultureStats.filter((stat) => isPublishable(stat.verificationStatus))

const workAreaCards = publicWorkAreas.map((area) => ({
  title: area,
  desc: `${officialName.value} work area listed on the company profile.`,
}))

const cultureStats = publicCultureStats.length > 0
  ? publicCultureStats.slice(0, 4).map((stat) => ({ val: stat.val, label: stat.label }))
  : [
      { val: shortName.value, label: 'Aerospace Manufacturing' },
      { val: 'MRO', label: 'Tooling Solutions' },
      { val: 'CNC', label: 'Precision Components' },
      { val: 'GSE', label: 'Ground Support' },
    ]

const heroStats = publicCultureStats.filter((stat) => /open roles|departments|glassdoor/i.test(stat.label))
const identityHeroStats = [
  { val: shortName.value, label: 'Aerospace Manufacturing' },
  { val: 'MRO', label: 'Tooling Solutions' },
  { val: 'CNC', label: 'Precision Components' },
]
const displayedHeroStats = heroStats.length > 0
  ? heroStats.map((stat) => ({ val: stat.val, label: stat.label }))
  : identityHeroStats

export default function Careers({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="absolute inset-0">
          <img src={images.careersImage} alt="Igniting Minds Aerospace team" className="w-full h-full object-cover opacity-[0.1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Careers</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Careers</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Build the Future<br />of Aerospace
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            {description.value} Current vacancies are not confirmed on this site.
          </p>
          <div className="mt-10 flex items-center gap-8 border-t border-border-dark pt-8">
            {displayedHeroStats.map(s => (
              <div key={s.label}>
                <div className="font-display font-bold text-white text-4xl">{s.val}</div>
                <div className="font-mono text-[9px] text-cyan mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-blue" />
                <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">Our Culture</span>
              </div>
              <h2 className="font-display font-bold text-navy text-4xl uppercase mb-6">Engineers Who Build. Engineers Who Lead.</h2>
              <p className="text-mid leading-relaxed mb-4">
                {officialName.value} ({shortName.value}) is an {description.value.charAt(0).toLowerCase()}{description.value.slice(1)}
              </p>
              <p className="text-mid leading-relaxed mb-8">
                Work areas include aero-engine tooling, precision aerospace components, MRO tooling, and integrated engineering and manufacturing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {cultureStats.map(s => (
                  <div key={s.label} className="border-l-2 border-blue pl-4">
                    <div className="font-display font-bold text-blue text-2xl">{s.val}</div>
                    <div className="font-mono text-[9px] text-mid mt-1 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img src={images.careersCultureImage} alt="Team culture at Igniting Minds Aerospace" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Work areas / benefits */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">
              {publicBenefits.length > 0 ? 'Benefits' : 'Work Areas'}
            </span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl uppercase mb-12">
            {publicBenefits.length > 0 ? 'What We Offer' : 'Where We Work'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
            {(publicBenefits.length > 0 ? publicBenefits : workAreaCards).map(b => (
              <div key={b.title} className="bg-navy-mid p-8 hover:bg-navy-light transition-colors">
                <div className="w-2 h-2 bg-cyan mb-5" />
                <h3 className="font-display font-bold text-white text-xl uppercase mb-3">{b.title}</h3>
                <p className="text-steel text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-blue" />
            <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">Careers</span>
          </div>
          <h2 className="font-display font-bold text-navy text-4xl uppercase mb-4">
            {confirmedOpenings.length > 0 ? 'Current Openings' : 'Career Enquiries'}
          </h2>
          <UnconfirmedNote title="Job listings" />
          <p className="text-mid text-sm mb-8 max-w-2xl">
            {confirmedOpenings.length > 0
              ? 'Confirmed openings from the careers model.'
              : 'No confirmed current vacancies are published. Legacy and prototype role titles are held internally and are not presented as open positions.'}
          </p>

          {confirmedOpenings.length > 0 ? (
            <div className="space-y-px bg-border-light">
              {confirmedOpenings.map(job => (
                <button
                  key={job.id}
                  onClick={() => navigate('contact')}
                  className="w-full bg-off hover:bg-white transition-colors p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group border-b border-border-light last:border-0"
                >
                  <div>
                    {job.dept && (
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[8px] text-cyan border border-cyan/30 px-2 py-0.5 uppercase tracking-wider">{job.dept}</span>
                        {job.employmentType && (
                          <span className="font-mono text-[8px] text-steel border border-border-light px-2 py-0.5 uppercase tracking-wider">{job.employmentType}</span>
                        )}
                      </div>
                    )}
                    <h3 className="font-display font-bold text-navy text-xl uppercase group-hover:text-blue transition-colors mb-2">{job.role}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-blue group-hover:gap-3 transition-all">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Enquire</span>
                    <AR />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-border-light bg-white p-8 lg:p-12">
              <h3 className="font-display font-bold text-navy text-2xl uppercase mb-3">No confirmed openings</h3>
              <p className="text-mid leading-relaxed max-w-2xl mb-6">
                Use Contact to enquire about careers. The contact form submits an enquiry; it does not send a resume or application to HR.
              </p>
              <button
                onClick={() => navigate('contact')}
                className="bg-navy hover:bg-navy-light text-white font-medium text-sm px-7 py-3.5 flex items-center gap-3 transition-colors w-fit"
              >
                Enquire via Contact <AR />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Spontaneous application */}
      <section className="bg-blue py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Interested in Careers?</h2>
            <p className="text-white/70 mt-2 max-w-lg">
              Contact the team about careers. This does not submit an application or store a resume.
            </p>
          </div>
          <button onClick={() => navigate('contact')} className="bg-white text-blue hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors shrink-0">
            Enquire via Contact <AR />
          </button>
        </div>
      </section>
    </div>
  )
}
