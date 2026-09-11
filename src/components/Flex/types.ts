import type { RootPassThrough } from '../../shared/passThrough'
import type { MFlexAlign, MFlexJustify, MGapSize } from '../../shared/gap'

export type FlexAlign = MFlexAlign
export type FlexJustify = MFlexJustify
export type FlexSize = MGapSize

export interface FlexProps {
  pt?: RootPassThrough
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
