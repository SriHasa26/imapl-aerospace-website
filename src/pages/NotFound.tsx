import type { MouseEvent } from 'react'
import type { NavigateFn, Page } from '../App'
import { hrefFor, shouldSpaNavigate } from '../nav'

interface Props {
  navigate: NavigateFn
}

export default function NotFound({ navigate }: Props) {
  const go = (page: Page) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldSpaNavigate(event)) return
    event.preventDefault()
    navigate(page)
  }

  return (
    <div>
      <section className="relative pt-32 pb-28 bg-navy overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 blueprint-grid opacity-22" />
        <div className="relative max-w-[1440px] mx-auto w-full px-6 xl:px-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-orange" />
            <span className="font-mono text-xs sm:text-sm text-orange uppercase tracking-[0.16em]">Error 404</span>
          </div>
          <h1 className="font-display font-black text-white text-5xl lg:text-7xl uppercase leading-none tracking-tight mb-6">
            Page Not<br />Found
          </h1>
          <p className="text-steel max-w-xl text-lg leading-relaxed mb-10">
            The page you requested does not exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={hrefFor('home')}
              onClick={go('home')}
              className="bg-blue hover:bg-blue-light text-white font-medium text-sm px-8 py-4 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Return Home
            </a>
            <a
              href={hrefFor('capabilities')}
              onClick={go('capabilities')}
              className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-8 py-4 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              View Capabilities
            </a>
            <a
              href={hrefFor('contact')}
              onClick={go('contact')}
              className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-8 py-4 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Contact
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
