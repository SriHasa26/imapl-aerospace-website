import type { Page } from '../App'
import { images, photoObjectClass } from '../content/assets'
import {
  capabilities,
  capabilityPageSections,
  type CapabilityRecord,
} from '../content/capabilities'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function SL({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-cyan" />
      <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">{text}</span>
    </div>
  )
}

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function composeSection(capabilityIds: string[]) {
  const records = capabilityIds
    .map((id) => capabilities.find((capability) => capability.id === id))
    .filter((capability): capability is CapabilityRecord => {
      if (!capability) return false
      return isPublishable(capability.verificationStatus)
    })

  const primary = records[0]
  if (!primary) return undefined

  const materials = unique(records.flatMap((record) => record.materials))
  const details = unique(records.flatMap((record) => record.technicalDetails))
  const specs: Array<[string, string]> = []

  if (details.length > 0) {
    specs.push(['Process', details.join(', ')])
  }
  if (materials.length > 0) {
    specs.push(['Materials', materials.join(', ')])
  }

  return {
    title: primary.title,
    tagline: details.slice(0, 3).join(' · ') || primary.title,
    desc: primary.description,
    img: primary.image ? images[primary.image] : undefined,
    specs,
    items: details,
  }
}

const caps = capabilityPageSections
  .map((section) => {
    const composed = composeSection(section.capabilityIds)
    if (!composed) return undefined
    return { id: section.id, anchorId: section.anchorId, ...composed }
  })
  .filter((section): section is NonNullable<typeof section> => Boolean(section))

export default function Capabilities({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-canvas overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Capabilities</span>
          </div>
          <SL text="Manufacturing Capabilities" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Precision At<br />Every Process
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            CNC machining, tooling, jigs and fixtures, assembly, inspection, load testing, and part marking.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-canvas-mid border-b border-border-dark">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-0 overflow-x-auto">
            {caps.map(c => (
              <a key={c.id} href={`#${c.anchorId}`} className="shrink-0 font-mono text-[9px] text-steel hover:text-cyan uppercase tracking-widest px-4 py-4 border-r border-border-dark hover:bg-canvas-raised transition-colors">
                {c.id} {c.title.split(' ').slice(0, 2).join(' ')}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Capability detail sections */}
      {caps.map((cap, i) => (
        <section
          key={cap.id}
          id={cap.anchorId}
          className={`py-24 scroll-mt-24 ${i % 2 === 0 ? 'bg-canvas' : 'bg-off'}`}
        >
          <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className={`grid lg:grid-cols-2 gap-16 items-start ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <div className="font-mono text-[9px] text-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-steel/50">{cap.id}</span>
                  <div className="w-8 h-px bg-cyan/30" />
                  Capability
                </div>
                <h2 className={`font-display font-bold text-4xl lg:text-5xl uppercase leading-tight mb-2 ${i % 2 === 0 ? 'text-white' : 'text-navy'}`}>
                  {cap.title}
                </h2>
                <p className={`font-mono text-[11px] uppercase tracking-widest mb-6 ${i % 2 === 0 ? 'text-cyan' : 'text-blue'}`}>{cap.tagline}</p>
                <p className={`leading-relaxed mb-8 ${i % 2 === 0 ? 'text-steel' : 'text-mid'}`}>{cap.desc}</p>

                {cap.specs.length > 0 && (
                  <div className={`border ${i % 2 === 0 ? 'border-border-dark' : 'border-border-light'} mb-8`}>
                    {cap.specs.map(([k, v], j) => (
                      <div key={k} className={`flex items-start gap-4 px-4 py-3 ${j % 2 === 0 ? (i % 2 === 0 ? 'bg-canvas-mid' : 'bg-off-dark') : ''} border-b last:border-0 ${i % 2 === 0 ? 'border-border-dark' : 'border-border-light'}`}>
                        <div className={`font-mono text-[10px] uppercase tracking-wider w-32 shrink-0 ${i % 2 === 0 ? 'text-steel/60' : 'text-mid/60'}`}>{k}</div>
                        <div className={`font-mono text-[11px] ${i % 2 === 0 ? 'text-white' : 'text-navy'}`}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {cap.items.length > 0 && (
                  <ul className="space-y-2 mb-8">
                    {cap.items.map(item => (
                      <li key={item} className={`flex items-start gap-3 text-sm ${i % 2 === 0 ? 'text-steel' : 'text-mid'}`}>
                        <div className="w-4 h-4 border border-cyan flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={() => navigate('quote')} className={`flex items-center gap-2 font-medium text-sm px-7 py-3.5 transition-colors ${i % 2 === 0 ? 'bg-blue hover:bg-blue-light text-white' : 'bg-navy hover:bg-navy-light text-white'}`}>
                  Request Capability Quote <AR />
                </button>
              </div>

              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden bg-navy">
                  {cap.img && (
                    <img
                      src={cap.img}
                      alt={cap.title}
                      className={`w-full h-full ${photoObjectClass(cap.img)} opacity-80 hover:scale-105 transition-transform duration-700`}
                    />
                  )}
                </div>
                <div className={`absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 ${i % 2 === 0 ? 'border-cyan/60' : 'border-blue/60'}`} />
                <div className={`absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 ${i % 2 === 0 ? 'border-cyan/60' : 'border-blue/60'}`} />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-canvas py-20 blueprint-grid">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-5xl uppercase mb-4">Ready to Manufacture?</h2>
          <p className="text-steel max-w-lg mx-auto mb-8">Submit your drawings and specifications for a technical and commercial proposal.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('quote')} className="bg-cyan hover:bg-cyan/90 text-navy font-bold text-sm px-8 py-4 flex items-center gap-2 transition-colors">
              Request a Quote <AR />
            </button>
            <button onClick={() => navigate('contact')} className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-8 py-4 transition-colors">
              Talk to Our Engineers
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
