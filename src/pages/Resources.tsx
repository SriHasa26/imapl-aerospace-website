import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { NavigateFn, Page } from '../App'
import { images } from '../content/assets'
import { isTechnicalPhoto, photoClass, productWellClass } from '../content/imagePresentation'
import { description, officialName, shortName } from '../content/company'
import {
  isUnpublishedCatalogItem,
  resources as resourceRecords,
} from '../content/resources'
import { publishedCertifications } from '../content/quality'
import { productFamilies } from '../content/products'
import { capabilities } from '../content/capabilities'
import { isPublishable } from '../content/types'

interface Props { navigate: NavigateFn }

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
  imgMod?: string
}

function familyDescription(id: string, fallback: string): string {
  const family = productFamilies.find((item) => item.id === id && isPublishable(item.verificationStatus))
  return family?.description ?? family?.shortDescription ?? fallback
}

function capabilityDescription(id: string, fallback: string): string {
  const record = capabilities.find((item) => item.id === id && isPublishable(item.verificationStatus))
  return record?.description ?? fallback
}

const publicCerts = publishedCertifications.filter((cert) => isPublishable(cert.verificationStatus))
const requestableDocuments = resourceRecords.filter(isUnpublishedCatalogItem)

const documentCopy: Record<string, { summary: string; format: string }> = {
  'capability-statement': {
    summary: 'An overview of IMAPL aerospace manufacturing, engineering capabilities, facilities, and quality systems.',
    format: 'PDF',
  },
  'rfq-template': {
    summary: 'A structured format for submitting manufacturing and tooling quote requests.',
    format: 'Spreadsheet',
  },
  sqr: {
    summary: 'Contact our team to request this technical document.',
    format: 'PDF',
  },
  'legacy-supplier-terms': {
    summary: 'Supplier terms published on the IMAPL For Suppliers page. The file is not stored on this website.',
    format: 'PDF',
  },
}

const featured: Topic = {
  id: 'featured-manufacturing',
  filter: 'Engineering',
  category: 'Featured Resource',
  title: 'Manufacturing Excellence for Aerospace',
  excerpt: capabilityDescription(
    'cnc-machining',
    'Explore IMAPL engineering capabilities, precision machining, tooling solutions, and manufacturing infrastructure.',
  ),
  img: images.manufacturingImage,
  alt: 'IMAPL aerospace manufacturing shop floor',
  cta: 'Explore Capabilities',
  page: 'capabilities',
  hash: '#cap-01',
}

const topics: Topic[] = [
  {
    id: 'company-profile',
    filter: 'Company',
    category: 'Company',
    title: officialName.value,
    excerpt: description.value,
    img: images.aboutHeroImage,
    alt: 'IMAPL engineering discussion',
    cta: 'View Company Profile',
    page: 'about',
    imgMod: 'resources-card-img--high',
  },
  {
    id: 'aero-engine-tooling',
    filter: 'Engineering',
    category: 'Aero Engine Tooling',
    title: 'Aero-Engine Tooling',
    excerpt: familyDescription('aero-engine-tooling', 'Airframe and aero-engine tooling family.'),
    img: images.productAeroEngineTooling,
    alt: 'Aero-engine tooling',
    cta: 'View Products',
    page: 'products',
    hash: '#engine',
    imgMod: 'resources-card-img--low',
  },
  {
    id: 'precision-components',
    filter: 'Engineering',
    category: 'Precision Machining',
    title: 'Precision Aerospace Components',
    excerpt: familyDescription('precision-components', 'Precision aerospace component machining.'),
    img: images.precisionComponents,
    alt: 'Precision aerospace component',
    cta: 'View Products',
    page: 'products',
    hash: '#airframe',
  },
  {
    id: 'mro-tooling',
    filter: 'Engineering',
    category: 'MRO Tooling',
    title: 'MRO Tooling Solutions',
    excerpt: familyDescription('mro-tooling', 'MRO tooling solutions.'),
    img: images.mroTooling,
    alt: 'MRO engine stand tooling',
    cta: 'View Products',
    page: 'products',
    hash: '#engine',
  },
  {
    id: 'jigs-fixtures',
    filter: 'Engineering',
    category: 'Aerospace Assembly',
    title: 'Jigs & Fixtures',
    excerpt: familyDescription('jigs-fixtures', 'Jigs and fixtures for listed manufacturing and inspection operations.'),
    img: images.jigsFixtures,
    alt: 'Manufacturing jig and fixture',
    cta: 'View Products',
    page: 'products',
    hash: '#gse',
  },
  {
    id: 'quality',
    filter: 'Quality',
    category: 'Quality & Certifications',
    title: 'Quality-Driven Manufacturing',
    excerpt: publicCerts.length > 0
      ? publicCerts.map((cert) => cert.code).join(' · ')
      : 'Inspection, load testing, and part marking processes.',
    img: images.qualityImage,
    alt: 'Mitutoyo CMM inspection at IMAPL',
    cta: 'View Quality',
    page: 'quality',
  },
  {
    id: 'facilities',
    filter: 'Company',
    category: 'Facilities',
    title: 'Aerospace Manufacturing',
    excerpt: 'CNC machining, precision inspection systems, and process-driven manufacturing workflows.',
    img: images.facilityGalleryImage,
    alt: 'IMAPL manufacturing facility',
    cta: 'View Facilities',
    page: 'facilities',
  },
]

export default function Resources({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const showFeatured = activeTab === 'All' || activeTab === featured.filter
  const visibleTopics = topics.filter((topic) => activeTab === 'All' || topic.filter === activeTab)
  const showDocuments = activeTab === 'All' || activeTab === 'Documents'
  const showQualityStrip = (activeTab === 'All' || activeTab === 'Quality') && publicCerts.length > 0

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ids = ['res-featured', 'res-topics', 'res-quality', 'res-docs', 'res-cta']
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
  }, [activeTab])

  const openTopic = (topic: Topic) => {
    navigate(topic.page, topic.hash)
  }

  return (
    <div className="resources-page">
      <section
        ref={heroRef}
        className={`resources-hero relative overflow-hidden ${heroVisible ? 'is-visible' : ''}`}
      >
        <div className="resources-hero-ambient" aria-hidden="true" />
        <div className="resources-hero-grid" aria-hidden="true" />
        <div className="resources-hero-scan" aria-hidden="true" />
        <span className="resources-hero-dot resources-hero-dot--a" aria-hidden="true" />
        <span className="resources-hero-dot resources-hero-dot--b" aria-hidden="true" />
        <span className="resources-hero-dot resources-hero-dot--c" aria-hidden="true" />
        <div className="resources-hero-coords" aria-hidden="true">
          <span>LIB 01</span>
          <span>DOC / ENG</span>
          <span>REF {shortName.value}</span>
        </div>
        <div className="relative max-w-[1440px] mx-auto w-full min-w-0 px-6 xl:px-12">
          <div className="resources-crumb font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Resources</span>
          </div>
          <div className="resources-eyebrow flex items-center gap-3 mb-3">
            <div className="resources-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Knowledge & Resources</span>
          </div>
          <h1 className="resources-heading font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Engineering<br />Insights &{' '}
            <br className="sm:hidden" />
            Resources
          </h1>
          <p className="resources-lede text-steel max-w-2xl w-full min-w-0 text-lg leading-relaxed">
            Explore {shortName.value} manufacturing capabilities, technical information, aerospace tooling expertise, company publications, and engineering insights.
          </p>
        </div>
      </section>

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

      {showFeatured && (
        <section
          id="res-featured"
          className={`resources-featured ${revealed['res-featured'] ? 'is-visible' : ''}`}
        >
          <div className="resources-featured-ambient" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <button
              type="button"
              onClick={() => openTopic(featured)}
              className="resources-featured-card"
            >
              <div className="resources-featured-media">
                <div className={['resources-featured-well', productWellClass(featured.img)].filter(Boolean).join(' ')}>
                  <img
                    src={featured.img}
                    alt={featured.alt}
                    className={`${photoClass(featured.img, isTechnicalPhoto(featured.img) ? 'photo' : 'decorative')} resources-featured-img`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="resources-featured-overlay" />
                <div className="resources-featured-scan" aria-hidden="true" />
                <div className="resources-corner resources-corner--tl" />
                <div className="resources-corner resources-corner--tr" />
                <div className="resources-corner resources-corner--bl" />
                <div className="resources-corner resources-corner--br" />
              </div>
              <div className="resources-featured-copy">
                <div className="font-mono text-[11px] text-orange uppercase tracking-[0.16em] mb-4">{featured.category}</div>
                <h2 className="font-display font-bold text-white text-3xl lg:text-4xl uppercase leading-tight mb-4">{featured.title}</h2>
                <p className="text-steel leading-relaxed mb-8">{featured.excerpt}</p>
                <span className="resources-cta-label">
                  {featured.cta} <AR />
                </span>
              </div>
            </button>
          </div>
        </section>
      )}

      {visibleTopics.length > 0 && (
        <section
          id="res-topics"
          className={`resources-topics ${revealed['res-topics'] ? 'is-visible' : ''}`}
        >
          <div className="resources-topics-grid-bg" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Engineering Topics</span>
            </div>
            <h2 className="font-display font-bold text-white text-4xl uppercase mb-10">Technical Information</h2>
            <div className="resources-topic-grid">
              {visibleTopics.map((topic, index) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => openTopic(topic)}
                  className="resources-card"
                  style={{ '--resources-stagger': `${Math.min(index, 5) * 80}ms` } as CSSProperties}
                >
                  <div className="resources-card-media">
                    <div className={['resources-card-well', productWellClass(topic.img)].filter(Boolean).join(' ')}>
                      <img
                        src={topic.img}
                        alt={topic.alt}
                        loading="lazy"
                        decoding="async"
                        className={`${photoClass(topic.img, isTechnicalPhoto(topic.img) ? 'photo' : 'decorative')} resources-card-img ${topic.imgMod ?? ''}`}
                      />
                    </div>
                    <div className="resources-card-overlay" />
                    <div className="resources-card-sheen" aria-hidden="true" />
                    <div className="resources-corner resources-corner--tl" />
                    <div className="resources-corner resources-corner--br" />
                    <div className="resources-card-label font-mono text-[11px] text-cyan uppercase tracking-widest">
                      {topic.category}
                    </div>
                  </div>
                  <div className="resources-card-body">
                    <h3 className="font-display font-bold text-white text-lg uppercase leading-tight mb-2">{topic.title}</h3>
                    <p className="text-steel text-sm leading-relaxed mb-4">{topic.excerpt}</p>
                    <span className="resources-cta-label resources-cta-label--sm">
                      {topic.cta} <AR />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {showQualityStrip && (
        <section
          id="res-quality"
          className={`resources-quality ${revealed['res-quality'] ? 'is-visible' : ''}`}
        >
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Quality Reference</span>
            </div>
            <h2 className="font-display font-bold text-white text-4xl uppercase mb-8">Certified Processes</h2>
            <div className="resources-cert-grid">
              {publicCerts.map((cert, index) => (
                <button
                  key={cert.code}
                  type="button"
                  onClick={() => navigate('quality')}
                  className="resources-cert"
                  style={{ '--resources-stagger': `${index * 80}ms` } as CSSProperties}
                >
                  <div className="font-mono text-[11px] text-cyan uppercase tracking-widest mb-3">{cert.code}</div>
                  <h3 className="font-display font-bold text-white text-xl uppercase mb-2">{cert.name}</h3>
                  <p className="text-steel text-sm leading-relaxed mb-4">{cert.details[0]?.[1]}</p>
                  <span className="resources-cta-label resources-cta-label--sm">
                    View Quality <AR />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {showDocuments && (
        <section
          id="res-docs"
          className={`resources-docs ${revealed['res-docs'] ? 'is-visible' : ''}`}
        >
          <div className="resources-docs-ambient" aria-hidden="true" />
          <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Documents</span>
            </div>
            <h2 className="font-display font-bold text-navy text-4xl uppercase mb-3">Available on Request</h2>
            <p className="text-mid max-w-2xl leading-relaxed mb-10">
              These technical documents are not stored as public files on this website. Contact the {shortName.value} team to request a copy.
            </p>
            <div className="resources-doc-grid">
              {requestableDocuments.map((doc, index) => {
                const copy = documentCopy[doc.id] ?? {
                  summary: 'Contact our team to request this technical document.',
                  format: 'Document',
                }
                return (
                  <article
                    key={doc.id}
                    className="resources-doc"
                    style={{ '--resources-stagger': `${index * 80}ms` } as CSSProperties}
                  >
                    <div className="resources-doc-icon" aria-hidden="true">
                      <DocIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] text-blue uppercase tracking-widest mb-2">{doc.type}</div>
                      <h3 className="font-display font-bold text-navy text-lg uppercase leading-tight mb-2">{doc.title}</h3>
                      <p className="text-mid text-sm leading-relaxed mb-4">{copy.summary}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] text-steel uppercase tracking-widest">{copy.format} · On request</span>
                        <button
                          type="button"
                          onClick={() => navigate('contact')}
                          className="resources-doc-btn"
                        >
                          Request Document <AR />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section
        id="res-cta"
        className={`resources-cta ${revealed['res-cta'] ? 'is-visible' : ''}`}
      >
        <div className="resources-cta-ambient" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="resources-cta-panel">
            <div className="resources-eyebrow flex items-center gap-3 mb-3">
              <div className="resources-eyebrow-rule h-px bg-orange" />
              <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Technical Enquiries</span>
            </div>
            <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">Need Technical Information?</h2>
            <p className="text-steel max-w-xl leading-relaxed mb-8">
              Contact our engineering team for product, capability, and manufacturing enquiries.
            </p>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="bg-orange hover:bg-orange-light text-white font-medium text-sm px-8 py-4 flex items-center gap-2 transition-colors"
            >
              Contact {shortName.value} <AR />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
