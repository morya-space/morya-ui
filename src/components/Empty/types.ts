import type { RootPassThrough } from '../../shared/passThrough'
import type { IconName } from '../Icon/types'

export interface EmptyProps {
  pt?: RootPassThrough
  /** Title. Defaults to locale `emptyMessage`. */
  title?: string
  /** Supporting description under the title. */
  description?: string
  /** Leading icon from MIcon. Ignored when `image` is set or `#image` / `#icon` slot is used. */
  icon?: IconName
  /** Image URL for the visual mark. Takes precedence over `icon`. */
  image?: string
}
