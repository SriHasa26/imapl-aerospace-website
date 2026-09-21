export type FieldErrors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/

export const ACCEPTED_DRAWING_TYPES = ['.pdf', '.step', '.stp', '.dxf', '.iges', '.igs']
export const MAX_DRAWING_BYTES = 50 * 1024 * 1024

export function trim(value: string) {
  return value.trim()
}

export function required(value: string, label: string) {
  if (!trim(value)) return `${label} is required.`
  return ''
}

export function minMax(value: string, label: string, min: number, max: number) {
  const text = trim(value)
  if (!text) return ''
  if (text.length < min) return `${label} must be at least ${min} characters.`
  if (text.length > max) return `${label} must be ${max} characters or fewer.`
  return ''
}

export function emailFormat(value: string) {
  const text = trim(value)
  if (!text) return ''
  if (!EMAIL_RE.test(text)) return 'Enter a valid email address.'
  return ''
}

export function phoneFormat(value: string) {
  const text = trim(value)
  if (!text) return ''
  if (!PHONE_RE.test(text)) return 'Enter a valid phone number, including country code.'
  return ''
}

export function firstError(...messages: string[]) {
  return messages.find(Boolean) || ''
}

export function drawingFileError(file: File | null) {
  if (!file) return ''
  const name = file.name.toLowerCase()
  const allowed = ACCEPTED_DRAWING_TYPES.some((ext) => name.endsWith(ext))
  if (!allowed) return `Use a ${ACCEPTED_DRAWING_TYPES.join(', ')} file.`
  if (file.size > MAX_DRAWING_BYTES) return 'File must be 50 MB or smaller.'
  return ''
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const fieldClass =
  'w-full min-h-12 bg-navy border border-border-dark px-4 py-3 text-sm text-white placeholder-steel/50 focus:outline-none focus-visible:border-cyan focus-visible:ring-1 focus-visible:ring-cyan transition-colors'
export const labelClass =
  'font-mono text-[11px] text-steel uppercase tracking-widest block mb-2'
export const errorClass = 'mt-1.5 font-mono text-[11px] text-red-400'
