import { useEffect, useId, useRef } from 'react'
import { images } from '../content/assets'
import { photoClass } from '../content/imagePresentation'
import type { LeadershipPerson } from '../content/company'

interface Props {
  person: LeadershipPerson | null
  onClose: () => void
  portraitFocus?: Record<string, string>
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function LeadershipProfileModal({ person, onClose, portraitFocus }: Props) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!person) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [person])

  if (!person) return null

  const src = person.photo ? images[person.photo] : undefined
  const focus = portraitFocus?.[person.name] ?? 'center 16%'
  const biography = person.biography?.split('\n\n').filter(Boolean) ?? []
  const paragraphs = biography.length > 0 ? biography : (person.summary ? [person.summary] : [])

  return (
    <div className="leader-profile-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="leader-profile-backdrop" aria-label="Close profile" onClick={onClose} />
      <div className="leader-profile-panel">
        <button
          ref={closeRef}
          type="button"
          className="leader-profile-close"
          aria-label="Close profile"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <div className="leader-profile-layout">
          {src && (
            <div className="leader-profile-photo">
              <img
                src={src}
                alt={person.name}
                className={photoClass(src, 'photo', 'portrait')}
                style={{ objectPosition: focus }}
              />
            </div>
          )}
          <div className="leader-profile-copy">
            <div className="font-mono text-[11px] text-cyan uppercase tracking-widest">{person.title}</div>
            <h3 id={titleId} className="font-display font-bold text-white text-2xl lg:text-3xl uppercase mt-1 mb-6">
              {person.name}
            </h3>
            {paragraphs.length > 0 && (
              <section className="mb-6">
                <h4 className="font-mono text-[11px] text-orange uppercase tracking-widest mb-3">Professional Background</h4>
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-steel text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            )}
            {person.experience && (
              <section className="mb-6">
                <h4 className="font-mono text-[11px] text-orange uppercase tracking-widest mb-3">Leadership & Industry Experience</h4>
                <p className="text-steel text-sm leading-relaxed">{person.experience}</p>
              </section>
            )}
            {person.focusAreas && person.focusAreas.length > 0 && (
              <section>
                <h4 className="font-mono text-[11px] text-orange uppercase tracking-widest mb-3">Focus Areas</h4>
                <ul className="leader-profile-focus">
                  {person.focusAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
        <div className="leader-profile-footer">
          <button type="button" className="leader-profile-footer-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
