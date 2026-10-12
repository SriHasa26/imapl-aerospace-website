import { photoClass, type PhotoFrame, type PhotoRole } from '../content/imagePresentation'

interface Props {
  src: string
  alt: string
  role?: PhotoRole
  frame?: PhotoFrame
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export default function SitePhoto({
  src,
  alt,
  role = 'photo',
  frame = 'card',
  className = '',
  loading = 'lazy',
  fetchPriority,
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${photoClass(src, role, frame)}${className ? ` ${className}` : ''}`}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  )
}
