import { useEffect, useState } from 'react'
import type { Page } from '../App'
import { photoObjectClass } from '../content/assets'
import {
  productFilterHashes,
  productFamilies,
  productImageSrc,
  publicProductFilterTabs,
  publicProductSpecs,
  type ProductFilterCategory,
} from '../content/products'
import { isPublishable } from '../content/types'

interface Props {
  navigate: (page: Page) => void
  hash?: string
}

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

const publicFamilies = productFamilies.filter((family) => isPublishable(family.verificationStatus))

export default function Products({ navigate, hash = '' }: Props) {
  const [activeCat, setActiveCat] = useState<'All' | ProductFilterCategory>('All')
  const categories = publicProductFilterTabs(activeCat === 'All' ? undefined : activeCat)
  const filtered = activeCat === 'All'
    ? publicFamilies
    : publicFamilies.filter((family) => family.filterCategory === activeCat)

  useEffect(() => {
    const key = hash.replace('#', '').toLowerCase()
    const fromHash: ProductFilterCategory | undefined = key ? productFilterHashes[key] : undefined
    if (fromHash) {
      setActiveCat(fromHash)
    }
  }, [hash])

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-canvas overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-50" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-[9px] text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-cyan transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan">Products</span>
          </div>
          <SL text="Product Lines" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Built for Critical<br />Applications
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Precision aerospace components, aero-engine and MRO tooling, ground support equipment, and jigs and fixtures.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-canvas-mid border-b border-border-dark">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex items-center gap-0 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`shrink-0 font-mono text-[9px] uppercase tracking-widest px-5 py-4 border-r border-border-dark transition-colors ${
                  activeCat === cat ? 'text-cyan bg-canvas-raised' : 'text-steel hover:text-white hover:bg-canvas-raised'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border-dark">
            {filtered.map(product => {
              const img = productImageSrc(product.image)
              const specs = publicProductSpecs(product)
              const context = product.applications[0] ?? product.category
              return (
                <button
                  key={product.id}
                  onClick={() => navigate('quote')}
                  className="bg-canvas-mid text-left group hover:bg-canvas-raised transition-colors duration-200"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-navy relative">
                    {img && (
                      <img
                        src={img}
                        alt={product.name}
                        className={`w-full h-full ${photoObjectClass(img)} opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500`}
                      />
                    )}
                    <div className="absolute top-3 left-3 font-mono text-[8px] text-cyan border border-cyan/30 px-2 py-1 bg-navy/70 uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[8px] text-steel uppercase tracking-widest mb-1.5">{context}</div>
                    <h3 className="font-display font-bold text-white text-lg uppercase leading-tight mb-2 group-hover:text-cyan transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-steel text-xs leading-relaxed mb-4">{product.shortDescription}</p>
                    {specs.length > 0 && (
                      <div className="border-t border-border-dark pt-3 grid grid-cols-2 gap-2">
                        {specs.map((spec) => (
                          <div key={spec.label}>
                            <div className="font-mono text-[7px] text-steel/60 uppercase tracking-wider">{spec.label}</div>
                            <div className="font-mono text-[9px] text-white mt-0.5">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-steel">No products in this category yet.</div>
          )}
        </div>
      </section>

      {/* Custom capability note */}
      <section className="bg-blue py-16">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">
                Custom Manufacturing for Your Program
              </h2>
              <p className="text-white/70 leading-relaxed">
                Not all programs fit a catalog. Our engineering team works directly from your drawings, specifications, and MRD to develop a manufacturing plan tailored to your program requirements, quality standards, and delivery schedule.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('quote')} className="bg-white text-blue hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors">
                Submit RFQ <AR />
              </button>
              <button onClick={() => navigate('capabilities')} className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-4 transition-colors">
                View Capabilities
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
