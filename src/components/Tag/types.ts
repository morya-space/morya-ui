import type { WiTagSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type TagSeverity = WiTagSeverity | 'warning'

export interface TagProps {
  /** Display text. Ignored when default slot has content. */
  value?: string
  /**
   * Semantic color. Omit / `primary` for brand primary.
   * Legacy `warning` is normalized to `warn`.
   */
  severity?: TagSeverity
  /** Fully rounded corners. */
  rounded?: boolean
  /** Icon name from WiIcon. */
  icon?: IconName
}
