import type { CSSProperties, StyleValue } from 'vue'

export type ScrollbarDirection = 'top' | 'bottom' | 'left' | 'right'

export type ScrollbarAriaOrientation = 'horizontal' | 'vertical'

export interface ScrollbarScrollPayload {
  scrollTop: number
  scrollLeft: number
}

export interface ScrollbarProps {
  /** Viewport height. */
  height?: string | number
  /** Max viewport height; scrollbar appears only when content exceeds it. */
  maxHeight?: string | number
  /** Use the browser native scrollbar instead of custom thumbs. */
  native?: boolean
  /** Style of the scroll wrap container. */
  wrapStyle?: StyleValue
  /** Class of the scroll wrap container. */
  wrapClass?: string | string[] | Record<string, boolean>
  /** Style of the view (content) element. */
  viewStyle?: StyleValue
  /** Class of the view (content) element. */
  viewClass?: string | string[] | Record<string, boolean>
  /** Skip ResizeObserver updates when container size is static. */
  noresize?: boolean
  /** HTML tag for the view element. */
  tag?: string
  /** Always show scrollbar thumbs (otherwise hover / drag). */
  always?: boolean
  /** Minimum thumb size in pixels. */
  minSize?: number
  /** Tabindex of the wrap container. */
  tabindex?: number | string
  /** Id applied to the view element (also used for aria-controls). */
  id?: string
  /** Role of the view element. */
  role?: string
  /** aria-label of the view element. */
  ariaLabel?: string
  /** aria-orientation of the view element. */
  ariaOrientation?: ScrollbarAriaOrientation
  /** Distance (px) from an edge that triggers `end-reached`. */
  distance?: number
}

export interface ScrollbarEmits {
  (event: 'scroll', payload: ScrollbarScrollPayload): void
  (event: 'end-reached', direction: ScrollbarDirection): void
}

export interface ScrollbarInstance {
  wrapRef: HTMLDivElement | undefined
  update: () => void
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y?: number) => void)
  setScrollTop: (value: number) => void
  setScrollLeft: (value: number) => void
  handleScroll: () => void
}

export type { CSSProperties, StyleValue }
