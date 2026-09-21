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
    id: 'event-lamp',
    image: '/images/gallery/activities/imapl-event-01.png',
    title: 'Company Gathering',
    category: 'Events',
    alt: 'People lighting a ceremonial lamp at an IMAPL gathering',
  },
  {
    id: 'event-rebrand',
    image: '/images/gallery/activities/imapl-event-02.png',
    title: 'Company Gathering',
    category: 'Events',
    alt: 'People on stage at an IMAPL company gathering',
  },
  {
    id: 'event-audience',
    image: '/images/gallery/activities/imapl-event-03.jpg',
    title: 'Company Gathering',
    category: 'Events',
    alt: 'IMAPL employees applauding together at a company gathering',
  },
  {
    id: 'team-games',
    image: '/images/gallery/activities/imapl-team-activity-02.jpg',
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL employees taking part in a group activity',
  },
  {
    id: 'celebration-festival-frame',
    image: '/images/gallery/activities/imapl-celebration-01.jpg',
    title: 'Festival Celebration',
    category: 'Celebrations',
    alt: 'IMAPL employees posing together during a festival celebration',
    featured: true,
  },
  {
    id: 'celebration-diwali-sweets',
    image: '/images/gallery/activities/imapl-celebration-02.jpg',
    title: 'Festival Celebration',
    category: 'Celebrations',
    alt: 'IMAPL employees together during a Diwali celebration',
  },
  {
    id: 'event-team-visitors',
    image: '/images/gallery/activities/imapl-event-04.jpg',
    title: 'Company Gathering',
    category: 'Events',
    alt: 'IMAPL employees standing together at a company gathering',
  },
  {
    id: 'team-sports',
    image: '/images/gallery/activities/imapl-team-activity-01.jpg',
    title: 'Team Activity',
    category: 'Team Activities',
    alt: 'IMAPL employees together during a sports team activity',
    featured: true,
  },
  {
    id: 'celebration-diwali-group',
    image: '/images/gallery/activities/imapl-celebration-03.jpg',
    title: 'Festival Celebration',
    category: 'Celebrations',
    alt: 'IMAPL employees celebrating together during Diwali',
  },
  {
    id: 'celebration-festival-offering',
    image: '/images/gallery/activities/imapl-celebration-04.jpg',
    title: 'Festival Celebration',
    category: 'Celebrations',
    alt: 'IMAPL employees taking part in a festival celebration',
  },
]

export type FeaturedVideo = {
  id: string
  kind: 'youtube'
  videoId: string
  title: string
  category: GalleryFilter
  description: string
}

export const featuredVideos: FeaturedVideo[] = [
  {
    id: 'annual-sports-day',
    kind: 'youtube',
    videoId: 'LwSKB3Wreho',
    title: 'Annual Day & Sports Day Highlights',
    category: 'Celebrations',
    description: 'Team celebration and sports moments from IMAPL Annual Day and Sports Day.',
  },
  {
    id: 'womens-day',
    kind: 'youtube',
    videoId: 'RJKj_p_0HDw',
    title: 'Women’s Day Celebration',
    category: 'Celebrations',
    description: 'IMAPL employees together during a Women’s Day celebration.',
  },
  {
    id: 'rebrand-event',
    kind: 'youtube',
    videoId: 'qRYyLoIM7nY',
    title: 'Rebranding Event Highlights',
    category: 'Events',
    description: 'Highlights from the IMAPL rebranding event.',
  },
]
