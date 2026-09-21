import { useEffect, useRef, useState, type CSSProperties } from "react"
import type { Page } from "../App"
import SitePhoto from "../components/SitePhoto"
import {
  productFilterHashes,
  productFamilies,
  productImageSrc,
  publicProductFilterTabs,
  publicProductSpecs,
  type ProductFilterCategory,
} from "../content/products"
import { isPublishable } from "../content/types"
import {
  isLightCatalogPhoto,
  productFrameStyle,
  productWellClass,
} from "../content/imagePresentation"

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

function AR() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

const publicFamilies = productFamilies.filter((family) =>
  isPublishable(family.verificationStatus),
)

export default function Products({ navigate, hash = "" }: Props) {
  const [activeCat, setActiveCat] = useState<"All" | ProductFilterCategory>(
    "All",
  )
  const [gridVisible, setGridVisible] = useState(false)
  const gridRef = useRef<HTMLElement>(null)
  const categories = publicProductFilterTabs(
    activeCat === "All" ? undefined : activeCat,
  )
  const filtered =
    activeCat === "All"
      ? publicFamilies
      : publicFamilies.filter((family) => family.filterCategory === activeCat)

  useEffect(() => {
    const key = hash.replace("#", "").toLowerCase()
    const fromHash: ProductFilterCategory | undefined = key
      ? productFilterHashes[key]
      : undefined
    if (fromHash) {
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
      <section className="products-hero relative overflow-hidden">
        <div className="products-hero-ambient" aria-hidden="true" />
        <div className="products-hero-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="font-mono text-xs text-steel uppercase tracking-widest mb-6 flex items-center gap-2">
            <button
              onClick={() => navigate("home")}
              className="hover:text-cyan transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-cyan">Products</span>
          </div>
          <SL text="Product Lines" />
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Built for Critical
            <br />
            Applications
          </h1>
          <p className="text-steel max-w-2xl text-lg leading-relaxed">
            Precision aerospace components, aero-engine and MRO tooling, ground
            support equipment, and jigs and fixtures.
          </p>
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
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section
        ref={gridRef}
        className={`products-showcase ${gridVisible ? "is-visible" : ""}`}
      >
        <div className="products-showcase-ambient" aria-hidden="true" />
        <div className="products-showcase-grid" aria-hidden="true" />
        <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="products-grid">
            {filtered.map((product, index) => {
              const img = productImageSrc(product.image)
              const specs = publicProductSpecs(product)
              const context = product.applications[0] ?? product.category
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
                    className={`products-card-media ${productWellClass(img) || "im-media-product"}`}
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
                    {img && !isLightCatalogPhoto(img) && (
                      <div className="products-card-overlay" />
                    )}
                    <div className="absolute top-3 left-3 font-mono text-[11px] text-cyan border border-cyan/30 px-2 py-1 bg-navy/70 uppercase tracking-wider z-[2]">
                      {product.category}
                    </div>
                  </div>
                  <div className="products-card-body">
                    <div className="font-mono text-[11px] text-steel uppercase tracking-widest mb-1.5">
                      {context}
                    </div>
                    <h3 className="font-display font-bold text-white text-lg uppercase leading-tight mb-2 products-card-title">
                      {product.name}
                    </h3>
                    <p className="text-steel text-sm leading-relaxed mb-4 products-card-copy">
                      {product.shortDescription}
                    </p>
                    {specs.length > 0 && (
                      <div className="products-card-specs border-t border-border-dark pt-3 grid grid-cols-2 gap-2">
                        {specs.map((spec) => (
                          <div key={spec.label}>
                            <div className="font-mono text-[11px] text-steel/80 uppercase tracking-wider">
                              {spec.label}
                            </div>
                            <div className="font-mono text-xs text-white mt-0.5">
                              {spec.value}
                            </div>
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
            <div className="text-center py-20 text-steel">
              No products in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Custom capability note */}
      <section className="bg-orange py-16">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-white text-4xl uppercase mb-4">
                Custom Manufacturing for Your Program
              </h2>
              <p className="text-white/70 leading-relaxed">
                Not all programs fit a catalog. Our engineering team works
                directly from your drawings, specifications, and MRD to develop
                a manufacturing plan tailored to your program requirements,
                quality standards, and delivery schedule.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("quote")}
                className="bg-white text-orange hover:bg-off font-medium text-sm px-7 py-4 flex items-center gap-2 transition-colors"
              >
                Submit RFQ <AR />
              </button>
              <button
                onClick={() => navigate("capabilities")}
                className="border border-white/30 text-white hover:bg-white/10 font-medium text-sm px-7 py-4 transition-colors"
              >
                View Capabilities
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
