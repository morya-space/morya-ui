export interface GalleryProps {
  images: string[]
  activeIndex?: number
}

export interface GalleryEmits {
  (event: 'update:activeIndex', value: number): void
}
