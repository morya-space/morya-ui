import type { RdFlexAlign, RdFlexJustify, RdGapSize } from '../../shared/gap'

export type FlexAlign = RdFlexAlign
export type FlexJustify = RdFlexJustify
export type FlexSize = RdGapSize

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
