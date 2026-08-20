import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface ScrollbarContext {
  scrollbarElement: HTMLDivElement | undefined
  wrapElement: HTMLDivElement | undefined
  contentId: string
}

export const scrollbarContextKey: InjectionKey<ScrollbarContext> = Symbol('wiScrollbar')

/** Internal shape used when providing refs via reactive(). */
export type ScrollbarProvideSource = {
  scrollbarElement: Ref<HTMLDivElement | undefined>
  wrapElement: Ref<HTMLDivElement | undefined>
  contentId: ComputedRef<string>
}
