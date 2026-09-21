import { useEffect, useRef, useState } from 'react'
import { images, videos } from '../content/assets'

const playlist = [videos.hero, videos.heroContinuation] as const
const WARM_BEFORE_END_SEC = 8
const FIRST_PLAYBACK_RATE = 1.25
const CONTINUATION_PLAYBACK_RATE = 1

const reel = [
  { src: images.facilityImage, position: 'center 70%' },
  { src: images.facilityGalleryImage, position: 'center 42%' },
  { src: images.qualityTeamImage, position: 'center 48%' },
  { src: images.manufacturingImage, position: 'center 55%' },
] as const

const videoClass =
  'absolute inset-0 h-full w-full object-cover object-center brightness-125 saturate-[1.08] pointer-events-none'

export default function HeroBackdrop() {
  const firstRef = useRef<HTMLVideoElement>(null)
  const secondRef = useRef<HTMLVideoElement>(null)
  const refs = [firstRef, secondRef] as const
  const activeRef = useRef(0)
  const switchingRef = useRef(false)
  const warmedRef = useRef(false)

  const [active, setActive] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const applyPlaybackRate = (index: number) => {
    const node = refs[index].current
    if (!node) return
    const rate = index === 0 ? FIRST_PLAYBACK_RATE : CONTINUATION_PLAYBACK_RATE
    node.defaultPlaybackRate = rate
    node.playbackRate = rate
  }

  useEffect(() => {
    if (reduceMotion) {
      refs.forEach((ref) => {
        const node = ref.current
        if (!node) return
        node.pause()
      })
      return
    }
    const node = firstRef.current
    if (!node) return
    node.muted = true
    applyPlaybackRate(0)
    node.play().then(() => applyPlaybackRate(0)).catch(() => setVideoReady(false))
  }, [reduceMotion])

  useEffect(() => {
    return () => {
      refs.forEach((ref) => ref.current?.pause())
    }
  }, [])

  const warmNext = (index: number) => {
    if (warmedRef.current) return
    const next = refs[1 - index].current
    if (!next) return
    warmedRef.current = true
    next.preload = 'auto'
  }

  const handoff = (fromIndex: number) => {
    if (switchingRef.current || fromIndex !== activeRef.current) return
    const nextIndex = 1 - fromIndex
    const next = refs[nextIndex].current
    const current = refs[fromIndex].current
    if (!next) return

    switchingRef.current = true
    next.muted = true
    next.currentTime = 0
    applyPlaybackRate(nextIndex)

    const reveal = () => {
      applyPlaybackRate(nextIndex)
      activeRef.current = nextIndex
      setActive(nextIndex)
      setVideoReady(true)
      if (current) {
        current.pause()
        current.currentTime = 0
        current.preload = 'metadata'
        applyPlaybackRate(fromIndex)
      }
      warmedRef.current = false
      switchingRef.current = false
    }

    const playNext = () => {
      applyPlaybackRate(nextIndex)
      next.play().then(() => {
        applyPlaybackRate(nextIndex)
        reveal()
      }).catch(() => {
        switchingRef.current = false
      })
    }

    if (next.readyState >= 3) {
      playNext()
      return
    }

    next.preload = 'auto'
    const onReady = () => {
      next.removeEventListener('canplay', onReady)
      playNext()
    }
    next.addEventListener('canplay', onReady)
    if (next.readyState < 2) next.load()
  }

  const onTimeUpdate = (index: number) => {
    const node = refs[index].current
    const expected = index === 0 ? FIRST_PLAYBACK_RATE : CONTINUATION_PLAYBACK_RATE
    if (node && node.playbackRate !== expected) applyPlaybackRate(index)
    if (index !== activeRef.current) return
    if (!node || !Number.isFinite(node.duration) || node.duration <= 0) return
    if (node.currentTime >= 3 || node.duration - node.currentTime <= WARM_BEFORE_END_SEC) {
      warmNext(index)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy">
      <div className={`absolute inset-0 ${videoReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}>
        {reduceMotion ? (
          <img
            src={images.heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[center_70%] brightness-110"
          />
        ) : (
          reel.map((scene, index) => (
            <img
              key={scene.src}
              src={scene.src}
              alt=""
              aria-hidden="true"
              className="hero-reel-frame brightness-110"
              style={{ objectPosition: scene.position, animationDelay: `${index * 8}s` }}
            />
          ))
        )}
      </div>

      {!reduceMotion &&
        playlist.map((src, index) => (
          <video
            key={src}
            ref={refs[index]}
            src={src}
            aria-hidden="true"
            className={`${videoClass} ${videoReady && active === index ? 'opacity-100' : 'opacity-0'}`}
            poster={index === 0 ? images.heroImage : undefined}
            muted
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
            autoPlay={index === 0}
            disablePictureInPicture
            disableRemotePlayback
            onCanPlay={() => {
              applyPlaybackRate(index)
              if (index === 0) setVideoReady(true)
            }}
            onLoadedMetadata={() => applyPlaybackRate(index)}
            onPlaying={() => {
              applyPlaybackRate(index)
              if (index === activeRef.current) setVideoReady(true)
            }}
            onRateChange={() => {
              const node = refs[index].current
              const expected = index === 0 ? FIRST_PLAYBACK_RATE : CONTINUATION_PLAYBACK_RATE
              if (node && node.playbackRate !== expected) applyPlaybackRate(index)
            }}
            onTimeUpdate={() => onTimeUpdate(index)}
            onEnded={() => handoff(index)}
            onError={() => {
              if (index === 0) setVideoReady(false)
            }}
          />
        ))}
    </div>
  )
}
