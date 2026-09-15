import type { RootPassThrough } from '../../shared/passThrough'
import type { IconName } from '../Icon/types'

/** Result page / outcome status. `warn` and `danger` are aliases. */
export type ResultStatus =
  | 'success'
  | 'info'
  | 'warning'
  | 'warn'
  | 'error'
  | 'danger'
  | '403'
  | '404'
  | '500'

export interface ResultProps {
  pt?: RootPassThrough
  /** Outcome status. Drives default icon, tone, and locale title. */
  status?: ResultStatus
  /** Title. Defaults to a locale string for the current `status`. */
  title?: string
  /** Supporting description. */
  description?: string
  /** Override the status icon. */
  icon?: IconName
}
