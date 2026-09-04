import type { WdSizeInput, WdTagSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type TagSeverity = WdTagSeverity | 'warning'
export type TagSize = WdSizeInput

export interface TagProps {
  /** Display text. Ignored when default slot has content. */
  value?: string
  /**
   * Semantic color. Omit / `primary` for brand primary.
   * Legacy `warning` is normalized to `warn`.
   */
  severity?: TagSeverity
  /** Fully rounded corners. */
  rounded?: boolean
  /** Icon name from WdIcon. */
  icon?: IconName
  /** Show a close control. */
  closable?: boolean
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: TagSize
  /** Draw a border using the tone color. */
  bordered?: boolean
  /** Custom color. Overrides `severity` when set. */
  color?: string
  disabled?: boolean
}

export interface TagEmits {
  (event: 'close', value: MouseEvent): void
}
