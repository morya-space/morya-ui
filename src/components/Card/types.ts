import type { WiSizeInput } from '../../shared/types'

export type CardSize = WiSizeInput

export interface CardProps {
  title?: string
  subtitle?: string
  ariaLabel?: string
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: CardSize
  /** Draw a border. Defaults to `true`. */
  bordered?: boolean
  /** Elevate on hover. */
  hoverable?: boolean
}
