import type { MouseEvent } from 'react'
import type { Page } from './App'

export function hrefFor(page: Page, hash?: string) {
  const path = page === 'home' ? '/' : `/${page}`
  if (!hash) return path
  return `${path}${hash.startsWith('#') ? hash : `#${hash}`}`
}

export function shouldSpaNavigate(event: MouseEvent) {
  return !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
}
