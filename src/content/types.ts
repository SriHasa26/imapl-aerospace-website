/**
 * Shared source-of-truth metadata for local static content.
 * Status fields are for maintainers. Do not render them on public pages.
 */

export type VerificationStatus =
  | "VERIFIED"
  | "SOURCE_SUPPORTED"
  | "OWNER_VERIFICATION_REQUIRED"
  | "CONFLICTING"
  | "HIGH_RISK"
  | "LEGACY"
  | "PROTOTYPE"
  | "MISSING"

export type ContentSourceType =
  | "OWNER_DOCUMENT"
  | "LEGACY_WEBSITE"
  | "CURRENT_PROJECT"
  | "TEMPORARY"
  | "UNKNOWN"

export interface SourceMeta {
  sourceType: ContentSourceType
  sourceRef?: string
  verificationStatus: VerificationStatus
  notes?: string
}

export interface SourcedValue<T> extends SourceMeta {
  value: T
}

export interface ConflictingValue<T> {
  verificationStatus: "CONFLICTING"
  notes: string
  candidates: SourcedValue<T>[]
}

export type MaybeConflicting<T> = SourcedValue<T> | ConflictingValue<T>

export function isConflicting<T>(field: MaybeConflicting<T>): field is ConflictingValue<T> {
  return field.verificationStatus === "CONFLICTING"
}

export function isPublishable(status: VerificationStatus): boolean {
  return status === "VERIFIED" || status === "SOURCE_SUPPORTED"
}

export const COMPANY_PROFILE_2026 =
  "IMA Company Profile 2026 (owner PDF: IMA_Company_Profile_2026_under20MB)"

export const LEGACY_SITE = "https://imapl.co.in/"
export const LEGACY_OVERVIEW = "https://imapl.co.in/overview"
export const LEGACY_LEADERSHIP = "https://imapl.co.in/leadership"
export const LEGACY_VALUES = "https://imapl.co.in/our-values"
export const LEGACY_FACILITIES = "https://imapl.co.in/manufacturing-facilities"
export const LEGACY_PRECISION = "https://imapl.co.in/precision-components"
export const LEGACY_TOOLING = "https://imapl.co.in/tooling-1"
export const LEGACY_MACHINING = "https://imapl.co.in/machining-&-fabrication"
export const LEGACY_INSPECTION = "https://imapl.co.in/inspection-1"
export const LEGACY_LOAD_TEST = "https://imapl.co.in/load-test"
export const LEGACY_PART_MARKING = "https://imapl.co.in/part-marking"
export const LEGACY_CAREERS = "https://imapl.co.in/careers"
export const LEGACY_CONTACT = "https://imapl.co.in/contact-us"
export const LEGACY_SUPPLIERS = "https://imapl.co.in/for-suppliers"
