export interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

export interface GalleryProps {
  /** Plain urls or `{ src, alt, caption }` objects. */
  images: Array<string | GalleryImage>
  activeIndex?: number
}

export interface GalleryEmits {
  (event: 'update:activeIndex', value: number): void
}
