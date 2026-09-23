import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type CardSize = MSizeInput
/** When to show the elevation shadow. */
export type CardShadow = 'never' | 'hover' | 'always'

export interface CardProps {
  pt?: RootPassThrough
  title?: string
  subtitle?: string
  ariaLabel?: string
  /** Heading level for the title element. Defaults to `2`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: CardSize
  /** Draw a border. Defaults to `true`. */
  bordered?: boolean
  /** Elevation shadow timing. Defaults to `never`. */
  shadow?: CardShadow
}
