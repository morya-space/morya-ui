import type { WdSizeInput } from '../../shared/types'

export type CardSize = WdSizeInput

export interface CardProps {
  title?: string
  subtitle?: string
  ariaLabel?: string
  /** Heading level for the title element. Defaults to `2`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: CardSize
  /** Draw a border. Defaults to `true`. */
  bordered?: boolean
  /** Elevate on hover. */
  hoverable?: boolean
}
