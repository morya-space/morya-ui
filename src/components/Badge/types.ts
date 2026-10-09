import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput, MTagType } from '../../shared/types'

export type BadgeType = MTagType

export type BadgeSize = MSizeInput

export type BadgeOffset = [number, number]

export interface BadgeProps {
  /** Badge content. Omit for a status dot. */
  value?: string | number
  /**
   * Semantic color. Omit / `primary` for brand primary.
   */
  type?: BadgeType
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: BadgeSize
  /** Cap numeric values; shows `{max}+` when exceeded. */
  max?: number
  /** Position offset `[x, y]` in pixels when wrapping content. */
  offset?: BadgeOffset
  /** Pulse animation. */
  processing?: boolean
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}
