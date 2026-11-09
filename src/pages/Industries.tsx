import type { Page } from '../App'
import { images } from '../content/assets'
import { industries, namedEntities, prototypeIndustryCards } from '../content/industries'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const publicIndustries = industries.filter((industry) => isPublishable(industry.verificationStatus))
const publicEntities = namedEntities.filter((entity) => isPublishable(entity.verificationStatus))
const publicPrototypeCards = prototypeIndustryCards.filter((card) => isPublishable(card.verificationStatus))

const industrySections = (publicPrototypeCards.length > 0 ? publicPrototypeCards : publicIndustries).map((item, index) => {
  if ('title' in item) {
    return {
      id: item.id,
      title: item.title,
      sub: item.sub,
      desc: item.desc,
      programs: publicEntities.length > 0 ? publicEntities.map((entity) => entity.name) : item.programs,
      chips: item.stats.map(([label, val]) => ({ val, label })),
      img: undefined as string | undefined,
      alt: item.title,
    }
  }

  const workAreas = item.workAreas ?? []
  const chips = workAreas.slice(0, 3).map((area) => {
    const [first, ...rest] = area.split(' ')
    return { val: first ?? area, label: rest.join(' ') || area }
  })
  while (chips.length < 3) {
    chips.push({ val: item.industry, label: 'Industry' })
  }

  return {
    id: String(index + 1).padStart(2, '0'),
    title: item.industry,
    sub: item.subheading ?? workAreas[0] ?? 'Aerospace',
    desc: item.description,
    programs: workAreas,
    chips,
    img: item.image ? images[item.image] : undefined,
    alt: item.industry,
  }
})

export default function Industries({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Industries</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Industries Served</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Aerospace<br />Manufacturing
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Aerospace manufacturing and MRO tooling — aero-engine tooling, precision aerospace components, and MRO tooling.
          </p>
        </div>
      </section>

      {/* Industry detail sections */}
      {industrySections.map((ind, i) => (
        <section key={ind.id} className={`py-24 ${i % 2 === 0 ? 'bg-off' : 'bg-navy'}`}>
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className={`grid lg:grid-cols-2 gap-16 ${i === 0 ? 'items-center' : 'items-start'} ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden bg-navy">
                  {ind.img && (
                    <img
                      src={ind.img}
                      alt={ind.alt}
                      className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${i % 2 === 0 ? 'opacity-85' : 'opacity-70'}`}
                    />
                  )}
                  {i % 2 !== 0 && <div className="absolute inset-0 bg-gradient-to-r from-navy/40 to-transparent" />}
                </div>
                <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan border border-cyan/30 px-3 py-1.5 bg-navy/80 uppercase tracking-widest">
                  {ind.id} / {ind.sub}
                </div>
                {ind.chips.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-px bg-border-dark">
                    {ind.chips.map((chip, chipIndex) => (
                      <div key={`${chip.val}-${chip.label}-${chipIndex}`} className={`p-3 text-center ${i % 2 === 0 ? 'bg-navy/90' : 'bg-navy-mid/90'} backdrop-blur`}>
                        <div className="font-display font-bold text-cyan text-lg">{chip.val}</div>
                        <div className="font-mono text-[8px] text-steel mt-0.5 tracking-wider">{chip.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="font-mono text-[9px] text-cyan uppercase tracking-widest mb-3">Industry {ind.id}</div>
                <h2 className={`font-display font-bold text-4xl lg:text-5xl uppercase leading-tight mb-3 ${i % 2 === 0 ? 'text-navy' : 'text-white'}`}>
                  {ind.title}
                </h2>
                <p className={`font-mono text-[11px] uppercase tracking-wider mb-6 ${i % 2 === 0 ? 'text-blue' : 'text-cyan'}`}>{ind.sub}</p>
                <p className={`leading-relaxed mb-8 ${i % 2 === 0 ? 'text-mid' : 'text-steel'}`}>{ind.desc}</p>
                {ind.programs.length > 0 && (
                  <div className={`mb-8 border-l-2 pl-5 ${i % 2 === 0 ? 'border-blue' : 'border-cyan'}`}>
                    <div className={`font-mono text-[9px] uppercase tracking-widest mb-3 ${i % 2 === 0 ? 'text-steel' : 'text-steel/60'}`}>Work areas</div>
                    <ul className="space-y-2">
                      {ind.programs.map(p => (
                        <li key={p} className={`text-sm flex items-start gap-2 ${i % 2 === 0 ? 'text-mid' : 'text-steel'}`}>
                          <div className={`w-1 h-1 mt-2 shrink-0 ${i % 2 === 0 ? 'bg-blue' : 'bg-cyan/60'}`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => navigate('quote')}
                  className={`flex items-center gap-2 font-medium text-sm px-7 py-3.5 transition-colors ${
                    i % 2 === 0 ? 'bg-navy hover:bg-navy-light text-white' : 'bg-blue hover:bg-blue-light text-white'
                  }`}
                >
                  Request a Quote <AR />
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-blue py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Your Industry. Our Capability.</h2>
            <p className="text-white/70 mt-2 max-w-lg">Every aerospace sector has unique demands. Let our engineering team show you how we meet yours.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('quote')} className="bg-white text-blue hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors">
              Submit RFQ <AR />
            </button>
            <button onClick={() => navigate('contact')} className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-4 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
