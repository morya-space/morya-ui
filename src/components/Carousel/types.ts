export interface CarouselProps {
  value: unknown[]
  numVisible?: number
  circular?: boolean
}

export interface CarouselEmits {
  (event: 'update:page', value: number): void
}
