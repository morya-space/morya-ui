import type { CSSProperties } from 'vue'
import type { PassThroughPart, RootPassThrough } from '../../shared/passThrough'

export type SplitterLayout = 'horizontal' | 'vertical'

/** Size: percent `0–100`, ratio `0–1`, or pixel string like `'120px'`. */
export type SplitterSize = number | string

/** Pass-through parts for Splitter DOM nodes. */
export type SplitterPassThrough = RootPassThrough &
  Partial<Record<'gutter' | 'panel1' | 'panel2', PassThroughPart>>

export interface SplitterProps {
  pt?: SplitterPassThrough
  /** Split direction. Prefer this name; `direction` is an alias. */
  layout?: SplitterLayout
  /** Alias of `layout`. */
  direction?: SplitterLayout
  /**
   * Controlled primary pane size.
   * - number `> 1` → percent (0–100)
   * - number `≤ 1` → ratio (0–1)
   * - string → CSS length, e.g. `'120px'`
   */
  size?: SplitterSize
  /** Uncontrolled initial size when `size` is omitted. Default `50` (%). */
  defaultSize?: SplitterSize
  /** Minimum primary size (same unit family as `size`). */
  min?: SplitterSize
  /** Maximum primary size (same unit family as `size`). */
  max?: SplitterSize
  /** Disable drag and keyboard resize. */
  disabled?: boolean
  /** Gutter thickness in px (also used for drag usable-size math). */
  resizeTriggerSize?: number
  /** Extra class on the gutter / resize trigger. */
  resizeTriggerClass?: string
  /** Extra style on the gutter / resize trigger. */
  resizeTriggerStyle?: string | CSSProperties
  pane1Class?: string
  pane1Style?: string | CSSProperties
  pane2Class?: string
  pane2Style?: string | CSSProperties
}

export interface SplitterEmits {
  (event: 'update:size', value: SplitterSize): void
  (event: 'resize', value: SplitterSize): void
  (event: 'drag-start', eventPayload: Event): void
  (event: 'drag-move', eventPayload: Event): void
  (event: 'drag-end', eventPayload: Event): void
}
