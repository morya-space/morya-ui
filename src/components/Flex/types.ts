import type { WkFlexAlign, WkFlexJustify, WkGapSize } from '../../shared/gap'

export type FlexAlign = WkFlexAlign
export type FlexJustify = WkFlexJustify
export type FlexSize = WkGapSize

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
