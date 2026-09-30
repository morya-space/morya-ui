import type { RootPassThrough } from '../../shared/passThrough'

export type CarouselDirection = 'horizontal' | 'vertical'
export type CarouselEffect = 'slide' | 'fade' | 'card'
export type CarouselDotType = 'dot' | 'line'
export type CarouselDotPlacement = 'top' | 'bottom' | 'left' | 'right'
export type CarouselTrigger = 'click' | 'hover'
export type CarouselSlidesPerView = number | 'auto'

export interface CarouselProps {
  pt?: RootPassThrough
  /** Controlled active index. Use with `v-model:currentIndex`. */
  currentIndex?: number
  /** Uncontrolled initial index. */
  defaultIndex?: number
  /** Show prev/next arrows. */
  showArrow?: boolean
  /** Show indicator dots. */
  showDots?: boolean
  /** Indicator shape. */
  dotType?: CarouselDotType
  /** Indicator placement around the slides. */
  dotPlacement?: CarouselDotPlacement
  /** How many slides are visible (slide effect). */
  slidesPerView?: number | 'auto'
  /** Gap between slides in px (slide effect). */
  spaceBetween?: number
  /** Center the active slide (slide effect). */
  centeredSlides?: boolean
  direction?: CarouselDirection
  autoplay?: boolean
  /** Autoplay interval in ms. */
  interval?: number
  /** Loop around the ends. */
  loop?: boolean
  /** Transition effect. */
  effect?: CarouselEffect
  /** How dots activate a slide. */
  trigger?: CarouselTrigger
  /** Allow touch swipe. */
  touchable?: boolean
  /** Allow mouse drag. */
  draggable?: boolean
  /** Allow mouse wheel to change slides. */
  mousewheel?: boolean
  /** Allow arrow keys when the carousel is focused. */
  keyboard?: boolean
  /** Transition duration in ms. */
  transitionDuration?: number
}

export interface CarouselEmits {
  'update:currentIndex': [currentIndex: number, lastIndex: number]
}

export interface CarouselInstance {
  prev: () => void
  next: () => void
  to: (index: number) => void
  getCurrentIndex: () => number
}

export interface CarouselArrowSlotProps {
  prev: () => void
  next: () => void
  total: number
  currentIndex: number
}

export interface CarouselDotsSlotProps {
  total: number
  currentIndex: number
  to: (index: number) => void
}

export interface CarouselItemProps {
  pt?: RootPassThrough
}

export const M_CAROUSEL_ITEM_FLAG = '__mCarouselItem' as const
