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
  qualityTeamImage: '/images/facilities/facility-2.jpg',
  facilityTeamImage: '/images/careers/careers.jpg',
  facilityGalleryImage: '/images/facilities/facility-3.jpg',
  cncMachineImage: '/images/capabilities/cnc-machine.png',

  precisionComponents: '/images/products/precision-components.png',
  aeroEngineComponents: '/images/products/aero-engine-components.png',
  structuralComponent: '/images/products/movement-trolley.png',
  multiAxisComponents: '/images/products/multi-axis-components.png',
  aeroEngineTooling: '/images/products/aero-engine-tooling-2.png',
  gse: '/images/products/aero-engine-tooling.png',
  gseStreamers: '/images/products/gse.png',
  jigsFixtures: '/images/products/jigs-fixtures.png',
  mroTooling: '/images/products/mro-tooling.png',
} as const

export type ImageKey = keyof typeof images
