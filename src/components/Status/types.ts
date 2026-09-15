import type { MSizeInput, MTagSeverity } from '../../shared/types'

export type StatusSeverity = MTagSeverity | 'warning'
export type StatusSize = MSizeInput

export interface StatusProps {
  /** Status text. Ignored when default slot has content. */
  label?: string
  /**
   * Semantic color. Defaults to `secondary` (neutral).
   * Legacy `warning` is normalized to `warn`.
   */
  severity?: StatusSeverity
  /** Pulse animation on the status dot. */
  processing?: boolean
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: StatusSize
  /** Custom color. Overrides `severity` when set. */
  color?: string
}
