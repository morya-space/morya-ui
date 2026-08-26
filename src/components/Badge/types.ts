import type { WiSizeInput, WiTagSeverity } from '../../shared/types'

export type BadgeSeverity = WiTagSeverity | 'warning'

export type BadgeSize = WiSizeInput

export type BadgeOffset = [number, number]

export interface BadgeProps {
  /** Badge content. Omit for a status dot. */
  value?: string | number
  /**
   * Semantic color. Omit / `primary` for brand primary.
   * Legacy `warning` is normalized to `warn`.
   */
  severity?: BadgeSeverity
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: BadgeSize
  /** Cap numeric values; shows `{max}+` when exceeded. */
  max?: number
  /** Position offset `[x, y]` in pixels when wrapping content. */
  offset?: BadgeOffset
  /** Pulse animation. */
  processing?: boolean
}
