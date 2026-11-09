import { useState } from 'react'
import type { Page } from '../App'
import { images, photoObjectClass } from '../content/assets'
import { publicWorkAreas, shortName } from '../content/company'
import {
  isPublicArticle,
  isPublicDownload,
  isUnpublishedCatalogItem,
  prototypeDownloads,
  prototypeResourceArticles,
  resources as resourceRecords,
} from '../content/resources'
import { isPublishable } from '../content/types'

interface Props { navigate: (page: Page) => void }

function AR() {
  return <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
}

const tabs = ['All', 'News', 'Case Studies', 'White Papers', 'Downloads'] as const
type Tab = typeof tabs[number]

const publicArticles = [
  ...resourceRecords.filter(isPublicArticle),
  ...prototypeResourceArticles.filter((article) => isPublishable(article.verificationStatus)),
]

const publicDownloads = [
  ...resourceRecords.filter(isPublicDownload),
  ...prototypeDownloads.filter((item) => isPublishable(item.verificationStatus) && item.verificationStatus !== 'MISSING'),
]

const unpublishedCatalog = resourceRecords.filter(isUnpublishedCatalogItem)

const noticeImages = [
  images.manufacturingImage,
  images.precisionComponents,
  images.qualityImage,
  images.facilityImage,
  images.aeroEngineTooling,
  images.mroTooling,
]

const noticeCards = publicWorkAreas.slice(0, 3).map((area, index) => ({
  type: 'Notice',
  title: area,
  excerpt: 'Published news, case studies, and technical documents are being updated. No downloadable file is attached to this notice.',
  img: noticeImages[index] ?? images.manufacturingImage,
}))

function tabMatches(tab: Tab, type: string): boolean {
  if (tab === 'All') return true
  if (tab === 'News') return type === 'News'
  if (tab === 'Case Studies') return type === 'Case Study'
  if (tab === 'White Papers') return type === 'White Paper' || type === 'Technical Document'
  return false
}

export default function Resources({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const articleCards = publicArticles.filter((item) => tabMatches(activeTab, item.type))
  const showNotices = articleCards.length === 0 && activeTab !== 'Downloads'
  const showDownloads = activeTab === 'Downloads' || activeTab === 'All'

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-canvas overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Resources</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-cyan" />
            <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Resources</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            News, Insights<br />& Case Studies
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Published documents from {shortName.value} will appear here when files exist and publication is authorised. Resources are currently being updated.
          </p>
        </div>
      </section>

      {/* Tab filter */}
      <section className="bg-canvas-mid border-b border-border-dark">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 font-mono text-[9px] uppercase tracking-widest px-5 py-4 border-r border-border-dark transition-colors ${
                  activeTab === tab ? 'text-cyan bg-canvas-raised' : 'text-steel hover:text-white hover:bg-canvas-raised'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resource grid */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          {articleCards.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-px bg-border-dark">
              {articleCards.map((item, i) => (
                <div
                  key={item.title}
                  className={`bg-canvas-mid text-left ${i === 0 && activeTab === 'All' ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <div className={i === 0 && activeTab === 'All' ? 'p-10' : 'p-6'}>
                    <div className="font-mono text-[8px] text-cyan border border-cyan/30 px-2 py-1 uppercase tracking-wider inline-block mb-4">
                      {item.type}
                    </div>
                    <h3 className={`font-display font-bold text-white uppercase leading-tight mb-3 ${i === 0 && activeTab === 'All' ? 'text-3xl' : 'text-lg'}`}>
                      {item.title}
                    </h3>
                    {'excerpt' in item && item.excerpt && (
                      <p className="text-steel text-sm leading-relaxed">{item.excerpt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNotices && (
            <div className="grid lg:grid-cols-3 gap-px bg-border-dark">
              {noticeCards.map((item, i) => (
                <div
                  key={item.title}
                  className={`bg-canvas-mid text-left ${i === 0 && activeTab === 'All' ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <div className={`overflow-hidden relative bg-navy ${i === 0 && activeTab === 'All' ? 'aspect-[16/9]' : 'aspect-video'}`}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className={`w-full h-full ${photoObjectClass(item.img)} opacity-60`}
                    />
                    <div className="absolute top-3 left-3 font-mono text-[8px] text-cyan border border-cyan/30 px-2 py-1 bg-navy/70 uppercase tracking-wider">
                      {item.type}
                    </div>
                  </div>
                  <div className={i === 0 && activeTab === 'All' ? 'p-10' : 'p-6'}>
                    <h3 className={`font-display font-bold text-white uppercase leading-tight mb-3 ${i === 0 && activeTab === 'All' ? 'text-3xl' : 'text-lg'}`}>
                      {item.title}
                    </h3>
                    <p className="text-steel text-sm leading-relaxed mb-4">{item.excerpt}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-steel">
                      {activeTab === 'All' ? 'Resources are being updated' : `No published ${activeTab.toLowerCase()}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Downloads section */}
          {showDownloads && (
            <div className={articleCards.length > 0 || showNotices ? 'mt-12' : ''}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-cyan" />
                <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">Downloads</span>
              </div>
              {publicDownloads.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
                  {publicDownloads.map(dl => (
                    <a
                      key={'id' in dl ? dl.id : dl.name}
                      href={'href' in dl ? dl.href : undefined}
                      className="bg-canvas-mid p-6 text-left flex items-start gap-4 hover:bg-canvas-raised transition-colors group"
                    >
                      <div className="w-10 h-12 border border-border-dark flex items-center justify-center shrink-0 group-hover:border-cyan transition-colors">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-steel group-hover:text-cyan transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 16V8M8 12l4 4 4-4M5 20h14" />
                          <rect x="3" y="3" width="18" height="14" rx="1" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[8px] text-cyan uppercase tracking-wider mb-1">{'type' in dl ? dl.type : dl.tag}</div>
                        <div className="text-sm font-medium text-white group-hover:text-cyan transition-colors leading-snug mb-1">{dl.title ?? dl.name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dark">
                  {unpublishedCatalog.length > 0 ? unpublishedCatalog.map(dl => (
                    <div
                      key={dl.id}
                      className="bg-canvas-mid p-6 text-left flex items-start gap-4"
                    >
                      <div className="w-10 h-12 border border-border-dark flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-steel" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="5" y="3" width="14" height="18" rx="1" />
                          <path d="M8 8h8M8 12h8M8 16h5" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[8px] text-cyan uppercase tracking-wider mb-1">{dl.type}</div>
                        <div className="text-sm font-medium text-white leading-snug mb-1">{dl.title}</div>
                        <div className="font-mono text-[9px] text-steel">Not published — no file in this site</div>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-canvas-mid p-8 sm:col-span-2 lg:col-span-3">
                      <h3 className="font-display font-bold text-white text-xl uppercase mb-2">No published downloads</h3>
                      <p className="text-steel text-sm leading-relaxed">
                        Certificate PDFs, brochures, and technical files are not available on this site yet. No download link is provided.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / contact */}
      <section className="bg-off py-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="border border-border-light p-10 lg:p-14 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-blue" />
              <span className="font-mono text-[10px] text-blue uppercase tracking-[0.2em]">Updates</span>
            </div>
            <h2 className="font-display font-bold text-navy text-4xl uppercase mb-3">Stay Informed</h2>
            <p className="text-mid mb-6">
              There is no newsletter subscription on this site. Use Contact to send an enquiry.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="bg-navy hover:bg-navy-light text-white font-medium text-sm px-6 py-3 transition-colors"
            >
              Contact the Team
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
