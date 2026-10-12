import type { CSSProperties } from 'react'
import { images } from './assets'

/**
 * Shared photograph presentation standards.
 * Adjust framing in page components; do not crop or replace source assets.
 */
export const imageFrame = {
  /** Product, capability, industry, and standard content images. */
  card: 'im-photo-frame aspect-[4/3]',
  /** Wider feature photographs where 4:3 would crop the subject. */
  landscape: 'im-photo-frame aspect-[16/10]',
  /** Native-wide shop-floor and inspection photographs. */
  panorama: 'im-photo-frame aspect-[21/8]',
  /** Hero-style horizontal features and wide banners. */
  banner: 'im-photo-frame aspect-[16/7]',
  /** Official group photographs — keep the full team visible. */
  group: 'im-photo-frame aspect-[16/5]',
  /** Side-by-side people photographs. */
  pair: 'im-photo-frame aspect-[16/9]',
  /** Leadership portraits. */
  portrait: 'im-photo-frame aspect-[4/5]',
  square: 'im-photo-frame aspect-square',
} as const

export type PhotoRole = 'decorative' | 'photo'
export type PhotoFrame = keyof typeof imageFrame | 'fluid'

const technicalPhotos = new Set<string>([
  images.qualityImage,
  images.qualityHeroImage,
  images.qualityGaugeImage,
  images.cncMachineImage,
  images.precisionComponents,
  images.aeroEngineComponents,
  images.structuralComponent,
  images.multiAxisComponents,
  images.aeroEngineTooling,
  images.productAeroEngineTooling,
  images.productBrackets,
  images.gse,
  images.gseStreamers,
  images.jigsFixtures,
  images.mroTooling,
  images.airframeTooling,
  images.productPedestals,
  images.productLiftingTools,
  images.productTorquingTools,
  images.productTigWelding,
  images.productIndexingTools,
  images.productMovementTrolleys,
  images.fixtureCmm,
  images.fixtureWelding,
  images.fixtureTurning,
  images.fixtureAssembly,
  images.fixtureHeatTreatment,
  images.aluminiumLongComponent,
  images.partMarkingImage,
  images.assemblyImage,
  images.cncTurningImage,
  images.tigWeldingImage,
  images.inspectionCmmCrysta,
  images.inspectionContracer,
  images.inspectionVpp,
])

const groupPhotos = new Set<string>([
  images.aboutHeritageImage,
  images.aboutTeamSeatedImage,
  images.facilityTeamImage,
  images.careersGroupImage,
  images.overviewTeamFactory,
  images.overviewTeamSeated,
])

const portraitPhotos = new Set<string>([
  images.leadershipChakrapani,
  images.leadershipManjunatha,
  images.leadershipBeerappa,
])

const portraitEquipment = new Set<string>([
  images.qualityGaugeImage,
  images.facilityCncBayImage,
])

const peopleScenePhotos = new Set<string>([
  images.facilitySecondaryImage,
  images.qualityTeamImage,
  images.careersGroupImage,
  images.workshopImage,
  images.workshopSecondaryImage,
])

export function isTechnicalPhoto(src: string): boolean {
  return technicalPhotos.has(src)
}

/** Isolated catalog shots on a light studio background. */
export function isLightCatalogPhoto(src: string): boolean {
  return (
    src === images.gse ||
    src === images.mroTooling ||
    src === images.precisionComponents ||
    src === images.structuralComponent ||
    src === images.aeroEngineComponents ||
    src === images.productAeroEngineTooling ||
    src === images.jigsFixtures ||
    src === images.multiAxisComponents ||
    src === images.productIndexingTools ||
    src === images.productTorquingTools ||
    src === images.airframeTooling ||
    src === images.productLiftingTools ||
    src === images.inspectionCmmCrysta ||
    src === images.inspectionContracer ||
    src === images.inspectionVpp
  )
}

type ProductCardFrame = {
  fit: 'contain' | 'cover'
  zoom: number
  position?: string
}

/**
 * Per-asset product-card framing. Zoom is clipped by overflow:hidden on the
 * image well so baked-in JPEG margins can be reduced without leaving the DIV.
 */
const productCardFrames: Record<string, ProductCardFrame> = {
  [images.multiAxisComponents]: { fit: 'contain', zoom: 1.18, position: 'center' },
  [images.productIndexingTools]: { fit: 'contain', zoom: 1.2, position: 'center' },
  [images.productTorquingTools]: { fit: 'contain', zoom: 1.22, position: 'center' },
  [images.airframeTooling]: { fit: 'contain', zoom: 1.28, position: 'center' },
  [images.productLiftingTools]: { fit: 'contain', zoom: 1.22, position: 'center' },
  [images.productTigWelding]: { fit: 'cover', zoom: 1.04, position: 'center' },
  [images.jigsFixtures]: { fit: 'cover', zoom: 1.06, position: 'center' },
  [images.productMovementTrolleys]: { fit: 'cover', zoom: 1.02, position: 'center' },
  [images.productBrackets]: { fit: 'contain', zoom: 1, position: 'center' },
}

/** CSS custom properties for a product/tooling image well. */
export function productFrameStyle(src: string | undefined): CSSProperties {
  const frame = src ? productCardFrames[src] : undefined
  if (!frame) return {}
  return {
    '--im-product-fit': frame.fit,
    '--im-product-pos': frame.position ?? 'center',
    '--im-product-zoom': String(frame.zoom),
  } as CSSProperties
}

/** Light well for white-background catalog photographs. */
export function catalogFillClass(src: string): string {
  return isLightCatalogPhoto(src) ? 'im-catalog-fill' : ''
}

/** Navy well for shop-floor stills; light well for white-background catalog photos. */
export function productWellClass(src: string | undefined): string {
  if (!src) return ''
  if (isLightCatalogPhoto(src)) return ['im-media-product-light', catalogFillClass(src)].filter(Boolean).join(' ')
  if (isTechnicalPhoto(src)) return 'im-media-product'
  return ''
}

export function isPortraitEquipment(src: string): boolean {
  return portraitEquipment.has(src)
}

/**
 * object-fit / object-position for a known local photograph.
 * Decorative backgrounds always cover. Isolated product shots use contain
 * so equipment, parts, and markings stay fully visible on navy cards.
 */
export function photoClass(
  src: string,
  role: PhotoRole = 'photo',
  frame: PhotoFrame = 'card',
): string {
  const base = 'w-full h-full'

  if (role === 'decorative') {
    if (src === images.aboutHeritageImage || src === images.aboutTeamSeatedImage) {
      return `${base} object-cover object-[center_70%]`
    }
    if (src === images.facilityImage) {
      return `${base} object-cover object-[center_70%]`
    }
    if (src === images.manufacturingImage) {
      return `${base} object-cover object-[center_48%]`
    }
    if (src === images.machiningImage) {
      return `${base} object-cover object-[center_35%]`
    }
    if (src === images.aboutHeroImage) {
      return `${base} object-cover object-[center_30%]`
    }
    if (src === images.qualityImage || src === images.qualityHeroImage) {
      return `${base} object-cover object-[center_42%]`
    }
    if (src === images.qualityTeamImage || src === images.facilitySecondaryImage) {
      return `${base} object-cover object-[center_38%]`
    }
    if (src === images.careersImage) {
      return `${base} object-cover object-[center_30%]`
    }
    if (src === images.careersCultureImage) {
      return `${base} object-cover object-[center_40%]`
    }
    if (src === images.careersGroupImage) {
      return `${base} object-cover object-[center_42%]`
    }
    return `${base} object-cover object-center`
  }

  if (portraitPhotos.has(src)) {
    return `${base} object-cover object-top`
  }

  if (portraitEquipment.has(src)) {
    return `${base} object-contain object-center bg-navy`
  }

  if (groupPhotos.has(src)) {
    if (frame === 'group' || frame === 'banner' || frame === 'panorama') {
      return `${base} object-contain object-center bg-navy`
    }
    if (frame === 'pair' && src === images.aboutTeamSeatedImage) {
      return `${base} object-cover object-center`
    }
    if (src === images.careersGroupImage) {
      return `${base} object-cover object-[center_42%]`
    }
    return `${base} object-contain object-center bg-navy`
  }

  if (src === images.assemblyImage) {
    return `${base} object-contain object-center bg-navy`
  }

  if (src === images.machiningImage) {
    if (frame === 'card' || frame === 'landscape') {
      return `${base} object-cover object-[center_40%]`
    }
    return `${base} object-cover object-[center_40%]`
  }

  if (src === images.manufacturingImage) {
    if (frame === 'banner' || frame === 'panorama' || frame === 'group') {
      return `${base} object-cover object-[center_48%]`
    }
    return `${base} object-cover object-[center_48%]`
  }

  if (src === images.careersCultureImage) {
    return `${base} object-cover object-[center_45%]`
  }

  if (src === images.careersImage) {
    return `${base} object-cover object-[center_35%]`
  }

  if (src === images.qualityImage || src === images.qualityHeroImage) {
    if (frame === 'banner' || frame === 'panorama' || frame === 'landscape') {
      return `${base} object-cover object-[center_42%]`
    }
    return `${base} object-contain object-center bg-navy`
  }

  if (peopleScenePhotos.has(src)) {
    return `${base} object-cover object-[center_38%]`
  }

  if (technicalPhotos.has(src)) {
    return `${base} object-contain object-center`
  }

  if (src === images.facilityImage) {
    return `${base} object-cover object-[center_68%]`
  }

  if (src === images.facilityGalleryImage || src === images.workshopImage || src === images.workshopSecondaryImage) {
    return `${base} object-cover object-center`
  }

  if (src === images.facilityCncBayImage) {
    return `${base} object-contain object-center bg-navy`
  }

  return `${base} object-cover object-center`
}
