export interface CarouselProps {
  value: unknown[]
  numVisible?: number
  circular?: boolean
  autoplay?: boolean
  /** Autoplay interval in ms. Defaults to `3000`. */
  interval?: number
  showArrows?: boolean
  showIndicators?: boolean
}

export interface CarouselEmits {
  (event: 'update:page', value: number): void
}
