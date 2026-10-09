import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput, MTagType } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type ChipType = MTagType
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
  type?: ChipType
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: ChipSize
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}

export interface ChipEmits {
  (event: 'remove', value: MouseEvent): void
}
