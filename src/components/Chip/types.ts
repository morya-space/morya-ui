import type { MSizeInput, MTagSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type ChipSeverity = MTagSeverity | 'warning'
export type ChipSize = MSizeInput

export interface ChipProps {
  /** Chip text. */
  label?: string
  /** Leading icon from MIcon. */
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
