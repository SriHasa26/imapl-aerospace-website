import { images } from './assets'
import { socialLinks } from './contact'

export const galleryCategories = [
  'All',
  'Team Activities',
  'Events',
  'Celebrations',
  'Training & Engagement',
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
    title: 'Group Photograph',
    category: 'Team Activities',
    alt: 'IMAPL employees gathered together for a group photograph',
    featured: true,
  },
  {
    id: 'training-session',
    image: images.careersCultureImage,
    title: 'Training Session',
    category: 'Training & Engagement',
    alt: 'IMAPL employees seated together during a training session',
    featured: true,
  },
  {
    id: 'team-group',
    image: images.aboutHeritageImage,
    title: 'Group Photograph',
    category: 'Team Activities',
    alt: 'IMAPL employees together in a group photograph',
  },
  {
    id: 'team-seated',
    image: images.aboutTeamSeatedImage,
    title: 'Group Photograph',
    category: 'Team Activities',
    alt: 'IMAPL employees seated and standing together for a group photograph',
  },
  {
    id: 'team-gathering',
    image: images.careersGroupImage,
    title: 'Team Gathering',
    category: 'Team Activities',
    alt: 'IMAPL employees gathered together as a group',
  },
  {
    id: 'careers-team',
    image: images.careersImage,
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL employees together in the workplace',
  },
]

export const imaplYoutubeChannel =
  socialLinks.find((item) => item.value.network === 'YouTube')?.value.url
  ?? null

/**
 * TODO: Official IMAPL YouTube video IDs for employee activities, events or
 * celebrations are not stored in this repository. Only the channel URL
 * https://www.youtube.com/@ignitingmindsaerospace was found.
 * Do not embed manufacturing or capability videos in this section.
 */
export const pendingYoutubeVideos: Array<{ videoId: null; note: string }> = [
  {
    videoId: null,
    note: 'TODO: provide official IMAPL YouTube video IDs for employee activities, events or celebrations.',
  },
]

export type FeaturedVideo =
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
  ...(imaplYoutubeChannel
    ? [{
        id: 'youtube-channel',
        kind: 'youtube-channel' as const,
        href: imaplYoutubeChannel,
        poster: images.aboutTeamSeatedImage,
        title: 'IMAPL on YouTube',
        category: 'Team Activities' as const,
        description: 'Official Igniting Minds Aerospace YouTube channel.',
      }]
    : []),
]
