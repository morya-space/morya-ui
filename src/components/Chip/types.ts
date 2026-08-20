import type { IconName } from '../Icon/types'

export interface ChipProps {
  /** Chip text. */
  label?: string
  /** Leading icon from WiIcon. */
  icon?: IconName
  /** Leading image URL. */
  image?: string
  /** Show remove (×) control. */
  removable?: boolean
  /** Disable interaction. */
  disabled?: boolean
}

export interface ChipEmits {
  (event: 'remove', value: MouseEvent): void
}
