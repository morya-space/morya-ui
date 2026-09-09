import type { CSSProperties } from 'vue'
import type { MFlexAlign, MFlexJustify, MGapSize } from '../../shared/gap'

export type SpaceAlign = MFlexAlign
export type SpaceJustify = MFlexJustify
export type SpaceSize = MGapSize

export interface SpaceProps {
  /** Cross-axis alignment. */
  align?: SpaceAlign
  /** Main-axis alignment. */
  justify?: SpaceJustify
  /** Use `inline-flex`. */
  inline?: boolean
  /** Column direction. */
  vertical?: boolean
  /** Reverse main axis. */
  reverse?: boolean
  /** Gap between items. */
  size?: SpaceSize
  /** Wrap each child in an item container. */
  wrapItem?: boolean
  /** Class on wrapped items (when `wrapItem`). */
  itemClass?: string
  /** Style on wrapped items (when `wrapItem`). */
  itemStyle?: string | CSSProperties
  /** Allow wrapping (ignored when `vertical`). */
  wrap?: boolean
}
