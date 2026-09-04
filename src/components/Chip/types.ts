import type { WdSizeInput, WdTagSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type ChipSeverity = WdTagSeverity | 'warning'
export type ChipSize = WdSizeInput

export interface ChipProps {
  /** Chip text. */
  label?: string
  /** Leading icon from WdIcon. */
  icon?: IconName
  /** Leading image URL. */
  image?: string
  /** Show remove (×) control. */
  removable?: boolean
  /** Disable interaction. */
  disabled?: boolean
  /** Semantic color. */
  severity?: ChipSeverity
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: ChipSize
}

export interface ChipEmits {
  (event: 'remove', value: MouseEvent): void
}
