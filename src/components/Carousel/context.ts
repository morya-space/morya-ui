import type { InjectionKey, Ref } from 'vue'

export interface CarouselContext {
  currentIndex: Ref<number>
  total: Ref<number>
  isActive: (index: number) => boolean
  isPrev: (index: number) => boolean
  isNext: (index: number) => boolean
}

export const CAROUSEL_KEY: InjectionKey<CarouselContext> = Symbol('m-carousel')
