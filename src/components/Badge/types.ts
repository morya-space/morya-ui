import type { WiSizeInput, WiTagSeverity } from '../../shared/types'

export type BadgeSeverity = WiTagSeverity | 'warning'

export type BadgeSize = WiSizeInput

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
}
