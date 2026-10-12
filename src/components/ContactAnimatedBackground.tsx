import { useEffect, useState } from 'react'
import ContactParticles from './ContactParticles'

export default function ContactAnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <div className="contact-animated-background" aria-hidden="true">
      {!reduceMotion && (
        <ContactParticles
          particleColors={['#ffffff', '#e8eef6', '#9ec9d6']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      )}
      <div className="contact-bg-grid" />
      <div className="contact-bg-scan" />
      <div className="contact-bg-vignette" />
      <span className="contact-bg-dot contact-bg-dot--a" />
      <span className="contact-bg-dot contact-bg-dot--b" />
      <span className="contact-bg-dot contact-bg-dot--c" />
    </div>
  )
}
