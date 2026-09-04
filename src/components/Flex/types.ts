import type { WdFlexAlign, WdFlexJustify, WdGapSize } from '../../shared/gap'

export type FlexAlign = WdFlexAlign
export type FlexJustify = WdFlexJustify
export type FlexSize = WdGapSize

export interface FlexProps {
  /** Cross-axis alignment. */
  align?: FlexAlign
  /** Main-axis alignment. */
  justify?: FlexJustify
  /** Use `inline-flex` instead of `flex`. */
  inline?: boolean
  /** Column direction. */
  vertical?: boolean
  /** Reverse main axis. */
  reverse?: boolean
  /** Gap between items. */
  size?: FlexSize
  /** Allow wrapping (ignored when `vertical`). */
  wrap?: boolean
}
