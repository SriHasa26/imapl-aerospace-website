import type { Page } from '../App'
import { images } from '../content/assets'
import {
  geP23tf3,
  inspectionEquipment,
  inspectionProcesses,
  loadTesting,
  partMarking,
  prototypeCertificationCards,
  prototypeQualityPolicy,
  prototypeQualityProcesses,
  qualityMetricsPrototype,
} from '../content/quality'
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

const publicInspection = isPublishable(inspectionProcesses.verificationStatus) ? inspectionProcesses.methods : []
const publicLoadTesting = isPublishable(loadTesting.verificationStatus) ? loadTesting.methods : []
const publicPartMarking = isPublishable(partMarking.verificationStatus) ? partMarking.methods : []
const publicEquipment = inspectionEquipment.filter((item) => isPublishable(item.verificationStatus))
const publicMetrics = isPublishable(qualityMetricsPrototype.verificationStatus) ? qualityMetricsPrototype.items : []
const publicCerts = prototypeCertificationCards.filter((cert) => isPublishable(cert.verificationStatus))
const publicProcesses = prototypeQualityProcesses.filter((process) => isPublishable(process.verificationStatus))
const publicPolicy = isPublishable(prototypeQualityPolicy.verificationStatus) ? prototypeQualityPolicy : undefined
const showGeP23tf3 = isPublishable(geP23tf3.verificationStatus)

const processCards = [
  publicInspection.length > 0 ? { code: 'Inspection', name: 'In-process and final inspection', details: publicInspection.map((method) => ['Method', method] as const) } : undefined,
  publicLoadTesting.length > 0 ? { code: 'Load Testing', name: 'Aerospace tools, fixtures, and assemblies', details: publicLoadTesting.map((method) => ['Method', method] as const) } : undefined,
  publicPartMarking.length > 0 ? { code: 'Part Marking', name: 'Marking to customer specification', details: publicPartMarking.map((method) => ['Method', method] as const) } : undefined,
].filter((card): card is NonNullable<typeof card> => Boolean(card))

const identityMetrics = [
  { val: 'Inspect', label: 'Dimensional', sub: publicInspection[0] ?? 'Inspection' },
  { val: 'Geometry', label: 'Verification', sub: publicInspection[1] ?? 'Inspection' },
  { val: 'Load', label: 'Testing', sub: publicLoadTesting[0] ?? 'Load testing' },
  { val: 'Mark', label: 'Part Marking', sub: publicPartMarking[0] ?? 'Part marking' },
]

const metricCards = publicMetrics.length > 0
  ? publicMetrics.map((item) => ({ val: item, label: 'Quality metric', sub: 'Production data' }))
  : identityMetrics

const processSteps = publicProcesses.length > 0
  ? publicProcesses
  : [
      ...publicInspection.map((method, index) => ({
        step: String(index + 1).padStart(2, '0'),
        title: method,
        desc: 'In-process and final inspection.',
      })),
      ...publicLoadTesting.map((method, index) => ({
        step: String(publicInspection.length + index + 1).padStart(2, '0'),
        title: method,
        desc: 'Load testing of aerospace tools, fixtures, and assemblies.',
      })),
    ].slice(0, 6)

const equipmentRows = publicEquipment.length > 0
  ? publicEquipment.map((item) => [item.name, item.details[0] ?? ''] as const)
  : [
      ...publicLoadTesting.map((method) => [method, 'Load testing'] as const),
      ...publicPartMarking.map((method) => [method, showGeP23tf3 ? 'Including GE P23TF3' : 'Part marking'] as const),
    ]

const policyText = publicPolicy?.statement

export default function Quality({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="absolute inset-0">
          <img src={images.qualityHeroImage} alt="Quality inspection equipment" className="w-full h-full object-cover opacity-[0.08]" />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light">
            {metricCards.map(stat => (
              <div key={stat.label + stat.val} className="bg-off p-8 lg:p-10">
                <div className="font-display font-black text-blue text-4xl lg:text-5xl mb-2">{stat.val}</div>
                <div className="font-mono text-[10px] text-navy uppercase tracking-widest">{stat.label}</div>
                <div className="font-mono text-[9px] text-mid/60 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / quality processes */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text={publicCerts.length > 0 ? 'Certifications & Accreditations' : 'Quality Processes'} />
          <h2 className="font-display font-bold text-white text-4xl lg:text-5xl uppercase leading-tight mb-14">
            {publicCerts.length > 0 ? (
              <>
                Globally Recognized<br />Standards
              </>
            ) : (
              <>
                Inspection &<br />Part Marking
              </>
            )}
          </h2>
          <div className="grid lg:grid-cols-2 gap-px bg-border-dark">
            {(publicCerts.length > 0 ? publicCerts.map((cert) => ({
              code: cert.code,
              name: cert.name,
              details: [
                ['Certifying Body', cert.body],
                ['Scope', cert.scope],
                ['Next Renewal', cert.renewal],
              ] as Array<readonly [string, string]>,
              year: cert.year,
            })) : processCards.map((card) => ({
              code: card.code,
              name: card.name,
              details: card.details,
              year: undefined as string | undefined,
            }))).map(cert => (
              <div key={cert.code} className="bg-navy-mid p-8 hover:bg-navy-light transition-colors">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="font-display font-bold text-cyan text-3xl uppercase">{cert.code}</div>
                    <div className="font-mono text-[10px] text-steel mt-1 tracking-wider">{cert.name}</div>
                  </div>
                  {cert.year && (
                    <div className="border border-cyan/30 px-3 py-2 text-center shrink-0">
                      <div className="font-mono text-[8px] text-steel uppercase tracking-wider">Issued</div>
                      <div className="font-mono text-[11px] text-cyan mt-0.5">{cert.year}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-2.5">
                  {cert.details.map(([k, v]) => (
                    <div key={`${k}-${v}`} className="flex items-start gap-3">
                      <div className="font-mono text-[9px] text-steel/60 uppercase tracking-wider w-24 shrink-0 pt-0.5">{k}</div>
                      <div className="font-mono text-[11px] text-white">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="bg-off py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <SL text="Quality Process" />
          <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl uppercase leading-tight mb-14">
            Built In, Not<br />Inspected In
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

      {/* Equipment */}
      <section className="bg-navy py-24">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SL text="Metrology Equipment" />
              <h2 className="font-display font-bold text-white text-4xl uppercase leading-tight mb-6">
                {publicEquipment.length > 0 ? (
                  <>
                    State-of-the-Art<br />Verification Lab
                  </>
                ) : (
                  <>
                    Load Testing &<br />Part Marking
                  </>
                )}
              </h2>
              <p className="text-steel leading-relaxed mb-8">
                {publicEquipment.length > 0
                  ? 'Named inspection equipment from the quality model.'
                  : 'Load testing and part-marking methods. Named instruments are not presented as the current fleet.'}
              </p>
              {equipmentRows.length > 0 && (
                <div className="space-y-3">
                  {equipmentRows.map(([eq, spec]) => (
                    <div key={eq} className="flex items-start gap-4 border-b border-border-dark pb-3">
                      <div className="w-1.5 h-1.5 bg-cyan mt-2 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">{eq}</div>
                        <div className="font-mono text-[10px] text-steel mt-0.5">{spec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative aspect-square overflow-hidden">
              <img src={images.qualityTeamImage} alt="Inspection team at Igniting Minds Aerospace" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-tl from-navy/60 to-transparent" />
            </div>
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
