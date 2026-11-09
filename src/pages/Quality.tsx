import type { Page } from '../App'
import { images, photoObjectClass } from '../content/assets'
import { prototypeQualityPolicy } from '../content/quality'
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

const publicPolicy = isPublishable(prototypeQualityPolicy.verificationStatus) ? prototypeQualityPolicy : undefined

const certificationCards = [
  { title: 'AS9100 Rev D', description: 'Aerospace Quality Management System' },
  { title: 'ISO 9001', description: 'Quality Management System' },
]

const capabilityCards = [
  {
    number: '01',
    title: 'DIMENSIONAL INSPECTION',
    desc: 'Precision measurement and dimensional verification against engineering drawings.',
  },
  {
    number: '02',
    title: 'GEOMETRIC VERIFICATION',
    desc: 'Verification of geometric tolerances and critical component features.',
  },
  {
    number: '03',
    title: 'LOAD TESTING',
    desc: 'Dead-weight load testing against specified acceptance criteria.',
  },
  {
    number: '04',
    title: 'PART MARKING',
    desc: 'Chemical etching and component identification as per customer requirements.',
  },
]

const processSteps = [
  { step: '01', title: 'DIMENSIONAL INSPECTION', desc: 'Precision measurement of critical dimensions.' },
  { step: '02', title: 'GEOMETRIC INSPECTION', desc: 'Verification of GD&T and geometric tolerances.' },
  { step: '03', title: 'CMM PROGRAMMING & INSPECTION', desc: 'Programmed measurement of complex geometries.' },
  { step: '04', title: 'NON-DESTRUCTIVE TESTING (NDT)', desc: 'Inspection for internal and surface defects.' },
  { step: '05', title: 'PRE-DISPATCH INSPECTION', desc: 'Final verification of quality and specifications.' },
  { step: '06', title: 'DEAD WEIGHT LOAD TESTING', desc: 'Load testing of tools, fixtures, and assemblies.' },
]

const policyText = publicPolicy?.statement

export default function Quality({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-canvas overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="absolute inset-0">
          <img src={images.qualityHeroImage} alt="Quality inspection equipment" className={`w-full h-full ${photoObjectClass(images.qualityHeroImage, 'bleed')} opacity-[0.12]`} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Quality</span>
          </div>
          <SL text="QUALITY ASSURANCE" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            <span className="block">PRECISION.</span>
            <span className="block">QUALITY.</span>
            <span className="block">TRACEABILITY.</span>
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Quality controls built around aerospace requirements, from in-process inspection to final verification and dispatch.
          </p>
        </div>
      </section>

      {/* Quality Policy / sourced process language */}
      <section className="bg-blue py-16">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="max-w-3xl">
            <div className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-4">
              {publicPolicy ? 'Quality Policy Statement' : 'INSPECTION PROCESS'}
            </div>
            {publicPolicy ? (
              <>
                <blockquote className="font-display font-bold text-white text-2xl lg:text-3xl uppercase leading-snug">
                  {`"${policyText}"`}
                </blockquote>
                <div className="mt-6 font-mono text-[10px] text-white/60">— {publicPolicy.attribution}</div>
              </>
            ) : (
              <p className="text-white/70 text-lg leading-relaxed">
                In-process and final inspections verify dimensional accuracy, geometric tolerances, surface finish, and compliance with customer specifications.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section className="bg-off py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text="QUALITY ASSURANCE" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-12">
            INSPECTION &amp; TESTING CAPABILITIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityCards.map(card => (
              <div key={card.number} className="bg-white border border-border-light shadow-sm p-8 flex flex-col">
                <div className="font-mono text-[11px] text-blue font-semibold mb-4">{card.number}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3">{card.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / quality processes */}
      <section className="bg-canvas py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text="CERTIFICATIONS & ACCREDITATIONS" />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            COMMITTED TO QUALITY STANDARDS
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {certificationCards.map((cert) => (
              <div key={cert.title} className="bg-canvas-mid border border-border-dark p-8 hover:bg-canvas-raised transition-colors">
                <div className="font-display font-bold text-cyan text-3xl uppercase">{cert.title}</div>
                <div className="font-mono text-[11px] text-steel mt-2 tracking-wider">{cert.description}</div>
              </div>
            ))}
          </div>
          <p className="text-steel max-w-3xl text-base leading-relaxed mt-10">
            Our quality systems support process consistency, product conformity, traceability, and continuous improvement across aerospace manufacturing operations.
          </p>
        </div>
      </section>

      {/* Quality Process */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text="QUALITY PROCESS" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            BUILT IN, NOT<br />INSPECTED IN
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-light">
            {processSteps.map(p => (
              <div key={p.step} className="bg-off p-8 hover:bg-off-dark transition-colors">
                <div className="font-mono text-[11px] text-blue font-semibold mb-4">{p.step}</div>
                <h3 className="font-display font-bold text-navy text-xl uppercase mb-3">{p.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-4xl uppercase">Quality Documentation</h2>
            <p className="text-white/70 mt-2">Use the quote form to request quality information. Certificate files are not published here.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('quote')} className="bg-white text-blue hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors">
              Request Documents <AR />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
