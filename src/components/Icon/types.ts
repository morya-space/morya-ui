import type { WdSizeInput } from '../../shared/types'
import type { IconName } from './icons'

export type { IconName } from './icons'
export type IconSize = WdSizeInput

export interface IconProps {
  /** Built-in system icon. Omit when using the default slot for custom SVG / Lucide. */
  name?: IconName
  label?: string
  size?: IconSize
}
