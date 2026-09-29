import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

/** Alert tone. Maps to semantic `--m-color-*` (error → danger). */
export type AlertSeverity = 'info' | 'success' | 'warning' | 'error'

export type AlertSize = MSizeInput

export interface AlertProps {
  pt?: RootPassThrough
  /** Semantic color and default icon. Default `info`. */
  severity?: AlertSeverity
  /** Title text. Prefer `#title` slot for custom markup. */
  title?: string
  /** Description text. Prefer default slot for custom markup. */
  description?: string
  /** Show leading icon. Default `true`. */
  showIcon?: boolean
  /** Show close control. Default `false`. */
  closable?: boolean
  /** Visual density. */
  size?: AlertSize
  /** Full-bleed banner style (weaker border). Default `false`. */
  banner?: boolean
}

export interface AlertEmits {
  close: []
}
