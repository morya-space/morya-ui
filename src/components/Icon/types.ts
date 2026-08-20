import type { WiSizeInput } from '../../shared/types'
import type { IconName } from './icons'

export type { IconName } from './icons'
export type IconSize = WiSizeInput

export interface IconProps {
  /** Built-in system icon. Omit when using the default slot for custom SVG / Lucide. */
  name?: IconName
  label?: string
  size?: IconSize
}
