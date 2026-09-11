import type { RootPassThrough } from '../../shared/passThrough'
import type { CSSProperties, StyleValue } from 'vue'

export type ScrollbarDirection = 'top' | 'bottom' | 'left' | 'right'

export type ScrollbarAriaOrientation = 'horizontal' | 'vertical'

export interface ScrollbarScrollPayload {
  scrollTop: number
  scrollLeft: number
}

export type ScrollbarClassValue =
  | string
  | string[]
  | Record<string, boolean>
  | Array<string | Record<string, boolean> | null | undefined | false>

export interface ScrollbarProps {
  pt?: RootPassThrough
  /** Viewport height. */
  height?: string | number
  /** Max viewport height; content-sized up to this cap (disables default fill layout). */
  maxHeight?: string | number
  /** Viewport width. */
  width?: string | number
  /** Max viewport width; content-sized up to this cap (disables default fill layout). */
  maxWidth?: string | number
  /**
   * Size to content up to a CSS `max-height` / `max-width` on the root.
   * Use for dropdown panels; pair with `max-height` on the root class, not `height: 100%` fill.
   */
  fitContent?: boolean
  /** Use the browser native scrollbar instead of custom thumbs. */
  native?: boolean
  /** Style of the scroll wrap container. */
  wrapStyle?: StyleValue
  /** Class of the scroll wrap container. */
  wrapClass?: ScrollbarClassValue
  /** Style of the view (content) element. */
  viewStyle?: StyleValue
  /** Class of the view (content) element. */
  viewClass?: ScrollbarClassValue
  /** Skip ResizeObserver updates when container size is static. */
  noresize?: boolean
  /** HTML tag for the view element. */
  tag?: string
  /** Always show scrollbar thumbs (otherwise hover / drag). */
  always?: boolean
  /** `none` keeps thumbs visible; `hover` shows them on hover. `always` still wins. */
  trigger?: 'hover' | 'none'
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
  /** aria-multiselectable of the view element. */
  ariaMultiselectable?: boolean
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
