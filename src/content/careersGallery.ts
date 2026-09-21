import { images, videos } from './assets'
import { socialLinks } from './contact'

export const galleryCategories = [
  'All',
  'Team Activities',
  'Training & Workshops',
  'Events & Celebrations',
  'Workplace',
  'Manufacturing',
] as const

export type GalleryCategory = (typeof galleryCategories)[number]
export type GalleryFilter = Exclude<GalleryCategory, 'All'>

export interface GalleryItem {
  id: string
  image: string
  title: string
  category: GalleryFilter
  alt: string
  featured?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'team-factory',
    image: images.overviewTeamFactory,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL team gathered on the manufacturing shop floor',
    featured: true,
  },
  {
    id: 'training-session',
    image: images.careersCultureImage,
    title: 'Training Session',
    category: 'Training & Workshops',
    alt: 'IMAPL employees in a training session',
    featured: true,
  },
  {
    id: 'engineering-discussion',
    image: images.aboutHeroImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'Engineering discussion on the shop floor at IMAPL',
  },
  {
    id: 'careers-team',
    image: images.careersImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL team members in the workplace',
  },
  {
    id: 'team-group',
    image: images.aboutHeritageImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL team group photograph in the manufacturing facility',
  },
  {
    id: 'team-seated',
    image: images.aboutTeamSeatedImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL team seated together',
  },
  {
    id: 'overview-seated',
    image: images.overviewTeamSeated,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL team in a workplace meeting area',
  },
  {
    id: 'careers-group',
    image: images.careersGroupImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'Igniting Minds Aerospace team photograph',
  },
  {
    id: 'shop-floor',
    image: images.manufacturingImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'CNC operators at work on the IMAPL shop floor',
  },
  {
    id: 'facility-cnc-bay',
    image: images.facilityCncBayImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'CNC machining bay at IMAPL',
  },
  {
    id: 'facility-gallery',
    image: images.facilityGalleryImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'IMAPL manufacturing facility',
  },
  {
    id: 'workshop',
    image: images.workshopImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'IMAPL manufacturing workshop',
  },
  {
    id: 'mro-tooling-bay',
    image: images.facilityMroToolingImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'MRO tooling workplace at IMAPL',
  },
  {
    id: 'facility-secondary',
    image: images.facilitySecondaryImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    alt: 'IMAPL facility workplace',
  },
  {
    id: 'cnc-operator',
    image: images.machiningImage,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'CNC operator at a machining centre at IMAPL',
  },
  {
    id: 'cnc-gantry',
    image: images.cncGantryBay,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'CNC gantry bay at IMAPL',
  },
  {
    id: 'assembly-ring',
    image: images.assemblyImage,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'Assembly activity at IMAPL',
  },
  {
    id: 'part-marking',
    image: images.partMarkingImage,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'Part marking activity at IMAPL',
  },
  {
    id: 'fixture-assembly',
    image: images.fixtureAssembly,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'Fixture assembly at IMAPL',
  },
  {
    id: 'quality-inspection',
    image: images.qualityHeroImage,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    alt: 'Coordinate measuring machine inspection at IMAPL',
  },
]

export const imaplYoutubeChannel =
  socialLinks.find((item) => item.value.network === 'YouTube')?.value.url
  ?? null

/**
 * TODO: Official IMAPL YouTube video IDs are not stored in this repository.
 * Only the channel URL https://www.youtube.com/@ignitingmindsaerospace was found.
 * Add confirmed video IDs here before enabling YouTube embeds.
 */
export const pendingYoutubeVideos: Array<{ videoId: null; note: string }> = [
  {
    videoId: null,
    note: 'TODO: provide official IMAPL YouTube video IDs for Featured Videos embeds.',
  },
]

export type FeaturedVideo =
  | {
      id: string
      kind: 'local'
      src: string
      poster: string
      title: string
      category: GalleryFilter
      description: string
    }
  | {
      id: string
      kind: 'youtube-channel'
      href: string
      poster: string
      title: string
      category: GalleryFilter
      description: string
    }
  | {
      id: string
      kind: 'youtube'
      videoId: string
      title: string
      category: GalleryFilter
      description: string
    }

export const featuredVideos: FeaturedVideo[] = [
  {
    id: 'local-manufacturing',
    kind: 'local',
    src: videos.hero,
    poster: images.facilityCncBayImage,
    title: 'Manufacturing Activity',
    category: 'Manufacturing',
    description: 'Workplace manufacturing activity recorded at IMAPL.',
  },
  {
    id: 'local-continuation',
    kind: 'local',
    src: videos.heroContinuation,
    poster: images.manufacturingImage,
    title: 'Workplace Activity',
    category: 'Workplace',
    description: 'Shop-floor activity recorded at IMAPL.',
  },
  ...(imaplYoutubeChannel
    ? [{
        id: 'youtube-channel',
        kind: 'youtube-channel' as const,
        href: imaplYoutubeChannel,
        poster: images.overviewTeamFactory,
        title: 'IMAPL on YouTube',
        category: 'Team Activities' as const,
        description: 'Official Igniting Minds Aerospace YouTube channel.',
      }]
    : []),
]
