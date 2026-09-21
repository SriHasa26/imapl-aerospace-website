import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { photoClass } from '../content/imagePresentation'
import {
  featuredVideos,
  galleryCategories,
  galleryItems,
  type FeaturedVideo,
  type GalleryCategory,
  type GalleryItem,
} from '../content/careersGallery'

interface Props {
  visible?: boolean
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 15.5v17l14-8.5-14-8.5Z" fill="currentColor" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ArrowIcon({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {dir === 'prev' ? <path d="M10 3 5 8l5 5" /> : <path d="M6 3l5 5-5 5" />}
    </svg>
  )
}

function youtubeThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export default function LifeAtImapl({ visible = false }: Props) {
  const headingId = useId()
  const lightboxTitleId = useId()
  const videoTitleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [category, setCategory] = useState<GalleryCategory>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [activeVideo, setActiveVideo] = useState<FeaturedVideo | null>(null)

  const filtered = useMemo(
    () => (category === 'All' ? galleryItems : galleryItems.filter((item) => item.category === category)),
    [category],
  )

  useEffect(() => {
    setLightbox(null)
  }, [category])

  const activeItem = lightbox !== null ? filtered[lightbox] : null

  useEffect(() => {
    if (lightbox === null && !activeVideo) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox(null)
        setActiveVideo(null)
      }
      if (lightbox === null) return
      if (event.key === 'ArrowRight') setLightbox((index) => (index === null ? index : (index + 1) % filtered.length))
      if (event.key === 'ArrowLeft') setLightbox((index) => (index === null ? index : (index - 1 + filtered.length) % filtered.length))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox, activeVideo, filtered.length])

  const openItem = (item: GalleryItem) => {
    const index = filtered.findIndex((entry) => entry.id === item.id)
    if (index >= 0) setLightbox(index)
  }

  const onFilterKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = event.key === 'ArrowRight'
      ? (index + 1) % galleryCategories.length
      : (index - 1 + galleryCategories.length) % galleryCategories.length
    setCategory(galleryCategories[next])
  }

  const openVideo = (video: FeaturedVideo) => {
    if (video.kind === 'youtube-channel') return
    setActiveVideo(video)
  }

  return (
    <section
      id="car-gallery"
      className={`careers-gallery ${visible ? 'is-visible' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="careers-gallery-grid" aria-hidden="true" />
      <div className="relative max-w-[1440px] mx-auto px-6 xl:px-12">
        <div className="careers-eyebrow flex items-center gap-3 mb-3">
          <div className="careers-eyebrow-rule h-px bg-orange" />
          <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Life at IMAPL</span>
        </div>
        <h2 id={headingId} className="font-display font-bold text-white text-4xl uppercase mb-4">
          Where People, Precision & Progress Come Together
        </h2>
        <p className="text-steel max-w-2xl leading-relaxed mb-10">
          Discover the people, activities and culture of Igniting Minds Aerospace Private Limited.
        </p>

        <div className="careers-gallery-filters" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((item, index) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              onKeyDown={(event) => onFilterKey(event, index)}
              className={`products-filter-btn shrink-0 font-mono text-xs uppercase tracking-widest px-5 py-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan ${
                category === item ? 'is-active' : ''
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="careers-gallery-mosaic">
            {filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className={`careers-gallery-tile ${item.featured ? 'is-featured' : ''}`}
                style={{ '--careers-stagger': `${Math.min(index, 8) * 60}ms` } as CSSProperties}
                aria-label={`${item.title}, ${item.category}. Open larger view`}
              >
                <span className="careers-gallery-well">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className={`${photoClass(item.image, 'decorative')} careers-gallery-img`}
                  />
                </span>
                <span className="careers-gallery-overlay">
                  <span className="font-mono text-[11px] text-cyan uppercase tracking-widest">{item.category}</span>
                  <span className="font-display font-bold text-white text-lg uppercase">{item.title}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-steel text-sm leading-relaxed border border-border-dark bg-navy-mid px-5 py-8">
            No confirmed photographs are published in this category.
          </p>
        )}

        {featuredVideos.length > 0 && (
        <div className="careers-gallery-videos">
          <div className="careers-eyebrow flex items-center gap-3 mb-3">
            <div className="careers-eyebrow-rule h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Featured Videos</span>
          </div>
          <h3 className="font-display font-bold text-white text-3xl uppercase mb-4">Inside IMAPL</h3>
          <p className="text-steel max-w-2xl leading-relaxed mb-8">
            Explore the people, team activities and culture of Igniting Minds Aerospace through video.
          </p>
          <div className="careers-video-grid">
            {featuredVideos.map((video, index) => {
              const poster = video.kind === 'youtube' ? youtubeThumb(video.videoId) : video.poster
              const isExternal = video.kind === 'youtube-channel'
              const sharedClass = 'careers-video-card'
              const style = { '--careers-stagger': `${index * 80}ms` } as CSSProperties
              const body = (
                <>
                  <span className="careers-video-well">
                    <img
                      src={poster}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`${photoClass(poster, 'decorative')} careers-gallery-img`}
                    />
                    <span className="careers-video-play" aria-hidden="true">
                      <PlayIcon />
                    </span>
                  </span>
                  <span className="careers-video-body">
                    <span className="font-mono text-[11px] text-cyan uppercase tracking-widest">{video.category}</span>
                    <span className="font-display font-bold text-white text-xl uppercase mt-2 mb-2">{video.title}</span>
                    <span className="text-steel text-sm leading-relaxed">{video.description}</span>
                    <span className="careers-text-btn mt-4">
                      {isExternal ? 'Watch on YouTube' : 'Watch Video'} <ArrowIcon dir="next" />
                    </span>
                  </span>
                </>
              )
              if (isExternal) {
                return (
                  <a
                    key={video.id}
                    href={video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedClass}
                    style={style}
                    aria-label={`${video.title}. Watch on YouTube`}
                  >
                    {body}
                  </a>
                )
              }
              return (
                <button
                  key={video.id}
                  type="button"
                  className={sharedClass}
                  style={style}
                  onClick={() => openVideo(video)}
                  aria-label={`${video.title}. Watch video`}
                >
                  {body}
                </button>
              )
            })}
          </div>
        </div>
        )}
      </div>

      {activeItem && lightbox !== null && (
        <div className="careers-lightbox" role="dialog" aria-modal="true" aria-labelledby={lightboxTitleId}>
          <button type="button" className="careers-modal-backdrop" aria-label="Close gallery" onClick={() => setLightbox(null)} />
          <div className="careers-lightbox-panel">
            <div className="careers-lightbox-toolbar">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-cyan uppercase tracking-widest">{activeItem.category}</div>
                <h3 id={lightboxTitleId} className="font-display font-bold text-white text-xl uppercase truncate">{activeItem.title}</h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="careers-lightbox-icon-btn"
                aria-label="Close gallery"
                onClick={() => setLightbox(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="careers-lightbox-stage">
              <img
                src={activeItem.image}
                alt={activeItem.alt}
                className={photoClass(activeItem.image, 'photo', 'landscape')}
              />
            </div>
            <div className="careers-lightbox-nav">
              <button
                type="button"
                className="careers-lightbox-nav-btn"
                aria-label="Previous image"
                onClick={() => setLightbox((index) => (index === null ? 0 : (index - 1 + filtered.length) % filtered.length))}
              >
                <ArrowIcon dir="prev" /> Previous
              </button>
              <span className="font-mono text-xs text-steel tracking-widest">
                {lightbox + 1} / {filtered.length}
              </span>
              <button
                type="button"
                className="careers-lightbox-nav-btn"
                aria-label="Next image"
                onClick={() => setLightbox((index) => (index === null ? 0 : (index + 1) % filtered.length))}
              >
                Next <ArrowIcon dir="next" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeVideo && activeVideo.kind !== 'youtube-channel' && (
        <div className="careers-lightbox" role="dialog" aria-modal="true" aria-labelledby={videoTitleId}>
          <button type="button" className="careers-modal-backdrop" aria-label="Close video" onClick={() => setActiveVideo(null)} />
          <div className="careers-lightbox-panel careers-lightbox-panel--video">
            <div className="careers-lightbox-toolbar">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-cyan uppercase tracking-widest">{activeVideo.category}</div>
                <h3 id={videoTitleId} className="font-display font-bold text-white text-xl uppercase truncate">{activeVideo.title}</h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="careers-lightbox-icon-btn"
                aria-label="Close video"
                onClick={() => setActiveVideo(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="careers-video-embed">
              {activeVideo.kind === 'youtube' && (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
