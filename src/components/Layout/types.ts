import type { CSSProperties } from 'vue'
import type { ScrollbarProps } from '../Scrollbar/types'

export type LayoutPosition = 'static' | 'absolute'
export type LayoutSiderPlacement = 'left' | 'right'
export type LayoutCollapseMode = 'width' | 'transform'
/** `true` / `'bar'` → bar trigger; `'arrow-circle'` / `'arrow'` → circle arrow. */
export type LayoutTrigger = boolean | 'bar' | 'arrow' | 'arrow-circle'

export interface LayoutProps {
  /** Soft background for nested content areas. */
  embedded?: boolean
  /** Position mode. */
  position?: LayoutPosition
  /** Enable horizontal sider layout (row flex). */
  hasSider?: boolean
  /** Sider side when `hasSider`. */
  siderPlacement?: LayoutSiderPlacement
  /**
   * Use the browser native scrollbar (default).
   * Set `false` to wrap content with `WiScrollbar`.
   */
  nativeScrollbar?: boolean
  /** Extra props forwarded to `WiScrollbar` when `nativeScrollbar` is false. */
  scrollbarProps?: Partial<ScrollbarProps>
  /** Extra class on the scroll / content wrapper. */
  contentClass?: string
  /** Extra style on the scroll / content wrapper. */
  contentStyle?: string | CSSProperties
}

export interface LayoutHeaderProps {
  bordered?: boolean
  inverted?: boolean
  position?: LayoutPosition
}

export interface LayoutFooterProps {
  bordered?: boolean
  inverted?: boolean
  position?: LayoutPosition
}

export interface LayoutContentProps {
  /** Soft background. */
  embedded?: boolean
  position?: LayoutPosition
  /**
   * Use the browser native scrollbar (default).
   * Set `false` to wrap content with `WiScrollbar`.
   */
  nativeScrollbar?: boolean
  /** Extra props forwarded to `WiScrollbar` when `nativeScrollbar` is false. */
  scrollbarProps?: Partial<ScrollbarProps>
  contentClass?: string
  contentStyle?: string | CSSProperties
}

export interface LayoutSiderProps {
  bordered?: boolean
  inverted?: boolean
  position?: LayoutPosition
  /** Expanded width (always applied as `width`; collapse uses `max-width`). */
  width?: number | string
  /** Collapsed max-width. */
  collapsedWidth?: number
  /** Controlled collapsed state (`v-model:collapsed`). */
  collapsed?: boolean
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean
  /**
   * `transform` (default): keep content width, clip with max-width.
   * `width`: shrink content with the sider.
   */
  collapseMode?: LayoutCollapseMode
  /** Show sider content while collapsed. */
  showCollapsedContent?: boolean
  showTrigger?: LayoutTrigger
  triggerClass?: string
  triggerStyle?: string | CSSProperties
  collapsedTriggerClass?: string
  collapsedTriggerStyle?: string | CSSProperties
  /**
   * Use the browser native scrollbar (default).
   * Set `false` to wrap content with `WiScrollbar`.
   */
  nativeScrollbar?: boolean
  /** Extra props forwarded to `WiScrollbar` when `nativeScrollbar` is false. */
  scrollbarProps?: Partial<ScrollbarProps>
  contentClass?: string
  contentStyle?: string | CSSProperties
}

export interface LayoutSiderEmits {
  (event: 'update:collapsed', value: boolean): void
  (event: 'collapse'): void
  (event: 'expand'): void
  (event: 'after-enter'): void
  (event: 'after-leave'): void
  (event: 'scroll', eventPayload: Event): void
}

export interface LayoutScrollEmits {
  (event: 'scroll', eventPayload: Event): void
}

export interface LayoutExpose {
  scrollTo: {
    (options: ScrollToOptions): void
    (x: number, y: number): void
  }
}
