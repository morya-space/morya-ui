import type { MSizeInput, MTagSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type TagSeverity = MTagSeverity | 'warning'
export type TagSize = MSizeInput

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
  /** Icon name from MIcon. */
  icon?: IconName
  /** Show a close control. Ignored when `checkable`. */
  closable?: boolean
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: TagSize
  /** Draw a border using the tone color (`bordered` / outlined look). */
  bordered?: boolean
  /** Custom color. Overrides `severity` when set. */
  color?: string
  disabled?: boolean
  /**
   * Toggleable tag (`checkable` + `v-model:checked`).
   * Use with `v-model:checked`.
   */
  checkable?: boolean
  /** Selected state when `checkable`. */
  checked?: boolean
}

export interface TagEmits {
  (event: 'close', value: MouseEvent): void
  (event: 'update:checked', value: boolean): void
  (event: 'change', value: boolean): void
}
