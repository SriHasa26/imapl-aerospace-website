import { useEffect, useRef, useState, type CSSProperties } from "react"
import type { Page } from "../App"
import SitePhoto from "../components/SitePhoto"
import { videos } from "../content/assets"
import {
  productCatalog,
  productFilterHashes,
  productImageSrc,
  publicProductFilterTabs,
  type ProductFilterCategory,
} from "../content/products"
import { productFrameStyle } from "../content/imagePresentation"

interface Props {
  navigate: (page: Page) => void
  hash?: string
}

function SL({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-6 h-px bg-orange" />
      <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">
        {text}
      </span>
    </div>
  )
}

function AR({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3.5 h-3.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

const catalogueCategories = new Set(
  productCatalog.map((product) => product.category),
)

export default function Products({ navigate, hash = "" }: Props) {
  const [activeCat, setActiveCat] = useState<"All" | ProductFilterCategory>(
    "All",
  )
  const [gridVisible, setGridVisible] = useState(false)
  const gridRef = useRef<HTMLElement>(null)
  const categories = publicProductFilterTabs()
  const filtered =
    activeCat === "All"
      ? productCatalog
      : productCatalog.filter((product) => product.category === activeCat)

  useEffect(() => {
    const key = hash.replace("#", "").toLowerCase()
    const fromHash: ProductFilterCategory | undefined = key
      ? productFilterHashes[key]
      : undefined
    if (fromHash && catalogueCategories.has(fromHash)) {
      setActiveCat(fromHash)
    }
  }, [hash])

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setGridVisible(true)
      return
    }
    const node = gridRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    )
    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="products-page">
      {/* Hero */}
      <section className="products-hero relative overflow-hidden flex flex-col min-h-[calc(100svh-4.5rem)]">
        <video
          className="products-hero-video absolute inset-0 h-full w-full object-cover"
          src={videos.products}
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
        <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />
        <div className="products-hero-ambient" aria-hidden="true" />
        <div className="products-hero-grid" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col justify-center max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <SL text="Product Lines" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6 sm:whitespace-nowrap">
            Built for Critical Applications
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Precision aerospace components, aero-engine tooling, MRO tooling,
            ground support equipment, and engineered jigs and fixtures for
            aerospace and defence applications.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[48px] sm:h-[68px] lg:h-[88px] block">
            <path d="M0,52 C420,104 860,58 1440,40 L1440,100 L0,100 Z" fill="#163A66" />
          </svg>
        </div>
      </section>

      {/* Filter bar */}
      <section className="products-filter">
        <div className="products-filter-inner max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="products-filter-track">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`products-filter-btn shrink-0 font-mono text-xs uppercase tracking-widest px-5 py-4 border-r border-border-dark focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan ${
                  activeCat === cat ? "is-active" : ""
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section
        ref={gridRef}
        className={`products-showcase ${gridVisible ? "is-visible" : ""} scroll-mt-32`}
      >
        <div className="products-showcase-ambient" aria-hidden="true" />
        <div className="products-showcase-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="products-grid">
            {filtered.map((product, index) => {
              const img = productImageSrc(product.image)
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate("quote")}
                  className="products-card"
                  style={
                    {
                      "--products-stagger": `${Math.min(index, 7) * 55}ms`,
                      ...productFrameStyle(img),
                    } as CSSProperties
                  }
                >
                  <div
                    className={`products-card-media ${
                      img ? "im-media-product-light im-catalog-fill" : "im-media-product"
                    }`}
                  >
                    {img ? (
                      <SitePhoto
                        src={img}
                        alt={product.name}
                        frame="card"
                        className="products-card-img im-photo-hover"
                      />
                    ) : (
                      <div
                        className="products-card-fallback"
                        aria-hidden="true"
                      />
                    )}
                    <div className="absolute top-3 left-3 font-mono text-[11px] text-cyan border border-cyan/30 px-2 py-1 bg-navy/70 uppercase tracking-wider z-[2]">
                      {product.categoryLabel.toUpperCase()}
                    </div>
                  </div>
                  <div className="products-card-body">
                    <div className="font-mono text-[11px] text-steel uppercase tracking-widest mb-1.5">
                      {product.eyebrow}
                    </div>
                    <h3 className="font-display font-bold text-white text-lg uppercase leading-tight mb-2 products-card-title">
                      {product.name}
                    </h3>
                    <p className="text-steel text-sm leading-relaxed products-card-copy">
                      {product.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-steel">
              No products in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Custom manufacturing */}
      <section className="bg-orange min-h-screen flex items-center py-20 sm:py-24">
        <div className="w-full max-w-[1440px] mx-auto px-6 xl:px-12 text-center">
          <h2 className="font-display font-bold text-white text-[clamp(1.75rem,2.8vw,2.5rem)] uppercase leading-[1.05] tracking-tight mb-5 sm:mb-6 text-balance">
            CUSTOM MANUFACTURING. BUILT AROUND YOUR REQUIREMENTS.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            From customer drawings and specifications to manufacturing planning
            and delivery, IMA develops tailored solutions for complex aerospace
            tooling, precision components, and assemblies.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              type="button"
              onClick={() => navigate("quote")}
              className="btn-chamfer group inline-flex min-h-[3.25rem] items-center justify-center gap-2 border border-transparent bg-white px-8 py-4 text-sm font-bold tracking-wide text-orange transition-all duration-200 hover:-translate-y-0.5 hover:bg-off focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Submit an RFQ
              <AR className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate("capabilities")}
              className="btn-chamfer inline-flex min-h-[3.25rem] items-center justify-center border border-white/35 bg-transparent px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Capabilities
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
