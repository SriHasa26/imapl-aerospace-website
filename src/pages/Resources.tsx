import { useEffect, useState, type CSSProperties } from 'react'
import type { NavigateFn, Page } from '../App'
import { images, videos } from '../content/assets'
import { description, officialName, shortName } from '../content/company'
import {
  isUnpublishedCatalogItem,
  resources as resourceRecords,
} from '../content/resources'
import { publishedCertifications } from '../content/quality'
import { productFamilies } from '../content/products'
import { capabilities } from '../content/capabilities'
import { isPublishable } from '../content/types'

interface Props {
  navigate: NavigateFn
}

function AR({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="6" y="3" width="12" height="18" rx="0.5" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  )
}

const tabs = ['All', 'Engineering', 'Quality', 'Company', 'Documents'] as const
type Tab = typeof tabs[number]

type Topic = {
  id: string
  filter: Exclude<Tab, 'All' | 'Documents'>
  category: string
  title: string
  excerpt: string
  img: string
  alt: string
  cta: string
  page: Page
  hash?: string
  position?: string
}

function familyDescription(id: string, fallback: string): string {
  const family = productFamilies.find((item) => item.id === id && isPublishable(item.verificationStatus))
  return family?.shortDescription ?? family?.description ?? fallback
}

function capabilityDescription(id: string, fallback: string): string {
  const record = capabilities.find((item) => item.id === id && isPublishable(item.verificationStatus))
  return record?.description ?? fallback
}

const publicCerts = publishedCertifications.filter((cert) => isPublishable(cert.verificationStatus))
const requestableDocuments = resourceRecords.filter(isUnpublishedCatalogItem)

const documentCopy: Record<string, { summary: string; format: string; docType: string }> = {
  'capability-statement': {
    summary: 'Comprehensive overview of IMAPL aerospace manufacturing infrastructure, 5-axis CNC machining, tooling capabilities, metrology lab, and quality compliance.',
    format: 'PDF',
    docType: 'Technical Publication',
  },
  'rfq-template': {
    summary: 'Structured aerospace RFQ specification sheet for submitting part drawings, material requirements, production volumes, and tooling requests.',
    format: 'Spreadsheet',
    docType: 'Procurement Tool',
  },
  sqr: {
    summary: 'Supplier quality requirements, inspection protocols, calibration criteria, and material test report (MTR) submission guidelines.',
    format: 'PDF',
    docType: 'Quality Specification',
  },
  'legacy-supplier-terms': {
    summary: 'Standard terms, purchase order conditions, delivery timelines, and quality compliance requirements for IMAPL aerospace suppliers.',
    format: 'PDF',
    docType: 'Commercial Terms',
  },
}

const featured: Topic = {
  id: 'featured-manufacturing',
  filter: 'Engineering',
  category: 'Featured Resource',
  title: 'Manufacturing Excellence for Aerospace',
  excerpt: capabilityDescription(
    'cnc-machining',
    'Explore IMAPL engineering capabilities, multi-axis precision machining, aero-engine tooling solutions, and verified manufacturing infrastructure across our Bengaluru and Ajman facilities.',
  ),
  img: images.manufacturingImage,
  alt: 'IMAPL aerospace manufacturing shop floor with multi-axis CNC machines',
  cta: 'Explore Capabilities',
  page: 'capabilities',
  hash: '#cap-01',
}

const topics: Topic[] = [
  {
    id: 'company-profile',
    filter: 'Company',
    category: 'Company Profile',
    title: officialName.value,
    excerpt: description.value,
    img: images.overviewTeamFactory,
    alt: 'IMAPL engineering and manufacturing team at Bengaluru plant',
    cta: 'View Company Profile',
    page: 'about',
    position: 'object-[center_35%]',
  },
  {
    id: 'cnc-machining',
    filter: 'Engineering',
    category: 'Precision Machining',
    title: 'Multi-Axis CNC Machining',
    excerpt: 'Multi-axis vertical and horizontal milling, Swiss-style precision turning, and tight-tolerance component machining.',
    img: images.machiningImage,
    alt: 'Precision CNC machining setup at IMAPL',
    cta: 'Explore Machining',
    page: 'capabilities',
    hash: '#cap-01',
    position: 'object-[center_35%]',
  },
  {
    id: 'precision-components',
    filter: 'Engineering',
    category: 'Precision Components',
    title: 'Precision Flight Components',
    excerpt: familyDescription('precision-components', 'High-precision structural parts, brackets, and multi-axis machined aerospace housings in aluminium, Inconel, and titanium.'),
    img: images.multiAxisComponentsHighRes,
    alt: 'Multi-axis machined aerospace component',
    cta: 'View Components',
    page: 'products',
    hash: '#airframe',
    position: 'object-center',
  },
  {
    id: 'aero-engine-tooling',
    filter: 'Engineering',
    category: 'Aero Engine Tooling',
    title: 'Aero-Engine Tooling',
    excerpt: familyDescription('aero-engine-tooling', 'Airframe and aero-engine tooling solutions engineered for critical manufacturing, handling, and engine line maintenance.'),
    img: images.aeroEngineToolingHighRes,
    alt: 'Aero-engine tooling assembly',
    cta: 'View Tooling Products',
    page: 'products',
    hash: '#engine',
    position: 'object-center',
  },
  {
    id: 'mro-tooling',
    filter: 'Engineering',
    category: 'MRO & Ground Support',
    title: 'MRO Tooling Solutions',
    excerpt: familyDescription('mro-tooling', 'Engine stands, transport trolleys, lifting tools, and ground support equipment engineered for airline servicing operations.'),
    img: images.facilityMroToolingImage,
    alt: 'MRO engine stand tooling fixture',
    cta: 'View MRO Solutions',
    page: 'products',
    hash: '#engine',
    position: 'object-center',
  },
  {
    id: 'jigs-fixtures',
    filter: 'Engineering',
    category: 'Tooling & Fixtures',
    title: 'Jigs & Fixtures',
    excerpt: familyDescription('jigs-fixtures', 'Precision jigs and holding fixtures developed for milling, turning, welding, coordinate measurement, and repeatable assembly.'),
    img: images.jigsFixturesHighRes,
    alt: 'Manufacturing jig and assembly fixture',
    cta: 'View Jigs & Fixtures',
    page: 'products',
    hash: '#gse',
    position: 'object-center',
  },
  {
    id: 'quality',
    filter: 'Quality',
    category: 'Quality & Metrology',
    title: 'Quality & CMM Metrology',
    excerpt: 'Coordinate measuring machines (CMM), surface contour verification, and calibrated physical inspection systems.',
    img: images.qualityCmmInspection,
    alt: 'Mitutoyo CMM inspection at IMAPL',
    cta: 'View Quality Lab',
    page: 'quality',
    position: 'object-[center_42%]',
  },
  {
    id: 'facilities',
    filter: 'Company',
    category: 'Manufacturing Facilities',
    title: 'Aerospace Facilities',
    excerpt: 'Dedicated manufacturing infrastructure across Bengaluru, India and regional operations in Ajman, UAE.',
    img: images.facilityGalleryImage,
    alt: 'IMAPL manufacturing facility shop floor review',
    cta: 'Explore Facilities',
    page: 'facilities',
    position: 'object-center',
  },
]

export default function Resources({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const showFeatured = activeTab === 'All' || activeTab === featured.filter
  const visibleTopics = topics.filter((topic) => activeTab === 'All' || topic.filter === activeTab)
  const showDocuments = activeTab === 'All' || activeTab === 'Documents'
  const showQualityStrip = (activeTab === 'All' || activeTab === 'Quality') && publicCerts.length > 0

  useEffect(() => {
    const revealId = window.requestAnimationFrame(() => setHeroVisible(true))
    return () => window.cancelAnimationFrame(revealId)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['res-featured', 'res-topics', 'res-quality', 'res-docs']
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setRevealed(Object.fromEntries(ids.map((id) => [id, true])))
      return
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
      revealObserver.disconnect()
    }
  }, [activeTab])

  const openTopic = (topic: Topic) => {
    navigate(topic.page, topic.hash)
  }

  return (
    <div className="resources-page">
      {/* Hero Section */}
      <section
        className={`resources-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)] ${heroVisible ? 'is-visible' : ''}`}
      >
        <video
          className="resources-hero-video absolute inset-0 h-full w-full object-cover"
          src={videos.capabilities}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          ref={(node) => {
            if (node) node.playbackRate = 0.5
          }}
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.5
          }}
          onPlay={(e) => {
            e.currentTarget.playbackRate = 0.5
          }}
        />
        <div className="absolute inset-0 bg-navy/75" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full min-w-0 px-6 xl:px-12 py-20">
          <div className="resources-eyebrow flex items-center gap-3 mb-3">
            <div className="resources-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Knowledge & Resources</span>
          </div>
          <h1 className="resources-heading font-display font-black text-white text-4xl sm:text-5xl lg:text-7xl uppercase leading-[1.08] tracking-tight mb-6 max-w-5xl">
            Engineering Insights & Resources
          </h1>
          <p className="resources-lede text-steel max-w-2xl w-full min-w-0 text-base sm:text-lg leading-relaxed">
            Access {shortName.value} aerospace manufacturing capabilities, technical specifications, aero-engine tooling expertise, quality compliance documentation, and engineering publications.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Filter Tabs */}
      <nav className="resources-filter" aria-label="Resource filters">
        <div className="resources-filter-inner max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="resources-filter-track" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`resources-filter-btn ${activeTab === tab ? 'is-active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Featured Resource */}
      {showFeatured && (
        <section
          id="res-featured"
          className={`resources-featured py-16 lg:py-24 ${revealed['res-featured'] ? 'is-visible' : ''}`}
        >
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
            <button
              type="button"
              onClick={() => openTopic(featured)}
              className="resources-featured-card group grid lg:grid-cols-2"
            >
              <div className="resources-featured-media">
                <div className="resources-featured-well">
                  <img
                    src={featured.img}
                    alt={featured.alt}
                    className="w-full h-full object-cover object-[center_48%] resources-featured-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="resources-featured-overlay opacity-20" />
                <div className="resources-featured-scan" aria-hidden="true" />
                <div className="resources-corner resources-corner--tl" />
                <div className="resources-corner resources-corner--tr" />
                <div className="resources-corner resources-corner--bl" />
                <div className="resources-corner resources-corner--br" />
              </div>
              <div className="resources-featured-copy flex flex-col justify-center p-8 sm:p-12">
                <div className="font-mono text-xs text-orange uppercase tracking-[0.16em] mb-3">{featured.category}</div>
                <h2 className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-4xl uppercase leading-tight mb-4">{featured.title}</h2>
                <p className="text-steel text-sm sm:text-base leading-relaxed mb-8">{featured.excerpt}</p>
                <span className="resources-cta-label">
                  {featured.cta} <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* Technical Information Cards (Balanced 4x2 Grid) */}
      {visibleTopics.length > 0 && (
        <section
          id="res-topics"
          className={`resources-topics py-16 lg:py-24 ${revealed['res-topics'] ? 'is-visible' : ''}`}
        >
          <div className="resources-topics-grid-bg" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Engineering Topics</span>
            </div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl uppercase mb-10">Technical Information</h2>
            <div className="resources-topic-grid">
              {visibleTopics.map((topic, index) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => openTopic(topic)}
                  className="resources-card group"
                  style={{ '--resources-stagger': `${Math.min(index, 7) * 70}ms` } as CSSProperties}
                >
                  <div className="resources-card-media">
                    <div className="resources-card-well">
                      <img
                        src={topic.img}
                        alt={topic.alt}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover ${topic.position ?? 'object-center'} resources-card-img`}
                      />
                    </div>
                    <div className="resources-card-overlay" />
                    <div className="resources-card-sheen" aria-hidden="true" />
                    <div className="resources-corner resources-corner--tl" />
                    <div className="resources-corner resources-corner--br" />
                    <div className="resources-card-label font-mono text-[10px] text-cyan uppercase tracking-widest">
                      {topic.category}
                    </div>
                  </div>
                  <div className="resources-card-body flex-1 flex flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="font-display font-bold text-white text-base sm:text-lg uppercase leading-tight mb-2">{topic.title}</h3>
                      <p className="text-steel text-xs sm:text-sm leading-relaxed mb-4">{topic.excerpt}</p>
                    </div>
                    <span className="resources-cta-label resources-cta-label--sm mt-auto">
                      {topic.cta} <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certified Processes */}
      {showQualityStrip && (
        <section
          id="res-quality"
          className={`resources-quality py-16 lg:py-20 ${revealed['res-quality'] ? 'is-visible' : ''}`}
        >
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12 w-full">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Quality Reference</span>
            </div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl uppercase mb-8">Certified Processes</h2>
            <div className="resources-cert-grid">
              {publicCerts.map((cert, index) => (
                <button
                  key={cert.code}
                  type="button"
                  onClick={() => navigate('quality')}
                  className="resources-cert group p-6 sm:p-8"
                  style={{ '--resources-stagger': `${index * 80}ms` } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="font-mono text-xs text-cyan uppercase tracking-widest font-semibold">{cert.code}</span>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ● Verified QMS
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl uppercase mb-2">{cert.name}</h3>
                  <p className="text-steel text-sm leading-relaxed mb-4">{cert.details[0]?.[1]}</p>
                  <span className="resources-cta-label resources-cta-label--sm">
                    View Quality Assurance & Compliance <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Available on Request Documents */}
      {showDocuments && (
        <section
          id="res-docs"
          className={`resources-docs py-16 lg:py-24 ${revealed['res-docs'] ? 'is-visible' : ''}`}
        >
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Documents</span>
            </div>
            <h2 className="font-display font-bold text-navy text-3xl sm:text-4xl uppercase mb-3">Available on Request</h2>
            <p className="text-mid max-w-2xl leading-relaxed mb-10 text-sm sm:text-base">
              These technical documents are verified and issued directly by our engineering compliance office. Contact the {shortName.value} team to request authorized access.
            </p>
            <div className="resources-doc-grid">
              {requestableDocuments.map((doc, index) => {
                const copy = documentCopy[doc.id] ?? {
                  summary: 'Contact our team to request this technical document.',
                  format: 'Document',
                  docType: 'Technical Document',
                }
                return (
                  <article
                    key={doc.id}
                    className="resources-doc flex flex-col justify-between"
                    style={{ '--resources-stagger': `${index * 80}ms` } as CSSProperties}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="resources-doc-icon" aria-hidden="true">
                            <DocIcon />
                          </div>
                          <span className="font-mono text-[11px] text-blue uppercase tracking-widest font-semibold">{copy.docType}</span>
                        </div>
                        <span className="font-mono text-[11px] text-navy/70 bg-navy/5 border border-navy/15 px-2.5 py-1 rounded font-semibold">
                          {copy.format}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-navy text-xl uppercase leading-tight mb-2">{doc.title}</h3>
                      <p className="text-mid text-sm leading-relaxed mb-6">{copy.summary}</p>
                    </div>

                    <div className="pt-4 border-t border-navy/10 mt-auto">
                      <button
                        type="button"
                        onClick={() => navigate('contact')}
                        className="btn-chamfer group w-full bg-navy hover:bg-orange text-white font-bold text-xs sm:text-sm tracking-wide px-5 py-3.5 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm"
                      >
                        Request Document Access <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section
        id="res-cta"
        className="bg-orange py-16 sm:py-20 lg:py-24 text-center"
      >
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-white/80 uppercase tracking-widest mb-3">
            Aerospace Engineering Consultation
          </div>
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl uppercase mb-4 tracking-tight">
            Discuss Your Technical & Tooling Requirements
          </h2>
          <p className="text-white/85 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Connect directly with our aerospace engineering and manufacturing team in Bengaluru and Ajman. We evaluate component drawings, tooling specifications, and RFQ packages with rapid turnaround and full NDA confidentiality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="btn-chamfer group bg-white text-orange hover:bg-off font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg"
            >
              Submit Technical Enquiry <AR className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate('quote')}
              className="btn-chamfer group bg-navy hover:bg-navy/90 text-white font-bold text-sm tracking-wide px-8 py-4 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Request RFQ / Drawing Review
            </button>
          </div>
          <div className="font-mono text-xs text-white/70">
            Typical technical evaluation within 24–48 hours · AS9100 Rev D & ISO 9001 Certified Processes
          </div>
        </div>
      </section>
    </div>
  )
}
