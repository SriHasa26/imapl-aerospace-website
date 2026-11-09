/**
 * Central image registry. Replace these paths when new company photographs arrive.
 * Do not hard-wire temporary CDN URLs in page components.
 */

export const images = {
  brandLogo: '/images/brand/imapl-logo.png',
  brandLogoAlt: 'Igniting Minds Aerospace',
  favicon: '/images/brand/imapl-favicon.png',

  heroImage: '/images/facilities/facility.png',
  productsImage: '/images/products/precision-components.png',
  qualityImage: '/images/quality/quality-inspection.png',
  facilityImage: '/images/facilities/facility.png',
  manufacturingImage: '/images/capabilities/manufacturing.png',
  machiningImage: '/images/capabilities/machining.png',
  careersImage: '/images/careers/careers.jpg',
  careersCultureImage: '/images/general/workshop.jpg',
  aboutHeroImage: '/images/capabilities/manufacturing.png',
  aboutHeritageImage: '/images/facilities/facility.png',
  qualityHeroImage: '/images/quality/quality-inspection.png',
  facilityTeamImage: '/images/careers/careers.jpg',
  facilityGalleryImage: '/images/facilities/facility-3.jpg',
  cncMachineImage: '/images/capabilities/cnc-machine.png',
  weldDetailImage: '/images/capabilities/machining-2.png',

  precisionComponents: '/images/products/precision-components.png',
  aeroEngineComponents: '/images/products/aero-engine-components.png',
  structuralComponent: '/images/products/movement-trolley.png',
  multiAxisComponents: '/images/products/multi-axis-components.png',
  aeroEngineTooling: '/images/products/aero-engine-tooling-2.png',
  gse: '/images/products/gse.png',
  gseStreamers: '/images/products/aero-engine-tooling.png',
  jigsFixtures: '/images/products/jigs-fixtures.png',
  mroTooling: '/images/products/mro-tooling.png',
} as const

export type ImageKey = keyof typeof images

/**
 * Studio cut-outs on black. In framed cards, contain the whole subject
 * so machinery and components are not cropped. Full-bleed backgrounds still cover.
 */
const studioContainSrcs = new Set<string>([
  images.machiningImage,
  images.cncMachineImage,
  images.qualityImage,
  images.qualityHeroImage,
  images.productsImage,
  images.precisionComponents,
  images.aeroEngineComponents,
  images.structuralComponent,
  images.multiAxisComponents,
  images.aeroEngineTooling,
  images.gse,
  images.gseStreamers,
  images.jigsFixtures,
  images.mroTooling,
])

/** Subject-aware object-position. Unlisted photographs use object-center. */
const photoPositionBySrc: Record<string, string> = {
  [images.manufacturingImage]: 'object-[50%_72%]',
  [images.careersImage]: 'object-[50%_38%]',
  [images.careersCultureImage]: 'object-top',
  [images.facilityGalleryImage]: 'object-[50%_32%]',
}

export type PhotoVariant = 'frame' | 'bleed'

/**
 * Tailwind object-fit + object-position for a registered photograph path.
 * `frame` is for aspect-ratio cards; `bleed` is for full-bleed decorative backgrounds.
 */
export function photoObjectClass(src: string, variant: PhotoVariant = 'frame'): string {
  const position = photoPositionBySrc[src] ?? 'object-center'
  if (variant === 'bleed') {
    return `object-cover ${position}`
  }
  const fit = studioContainSrcs.has(src) ? 'object-contain' : 'object-cover'
  return `${fit} ${position}`
}
