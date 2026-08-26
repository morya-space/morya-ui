import type { CSSProperties } from 'vue'

export type SplitterLayout = 'horizontal' | 'vertical'

/** Size: percent `0–100`, ratio `0–1`, or pixel string like `'120px'`. */
export type SplitterSize = number | string

export interface SplitterProps {
  /** Split direction. Prefer this name; `direction` is a Naive-compatible alias. */
  layout?: SplitterLayout
  /** Alias of `layout` (Naive `n-split` naming). */
  direction?: SplitterLayout
  /**
   * Controlled primary pane size.
   * - number `> 1` → percent (0–100), Wi legacy
   * - number `≤ 1` → ratio (0–1), Naive-compatible
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
  /** Gutter thickness in px. */
  resizeTriggerSize?: number
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
