import type { WdSizeInput } from '../../shared/types'

export type PanelSize = WdSizeInput

export interface PanelProps {
  header?: string
  toggleable?: boolean
  /** Collapsed state. Use with `v-model:collapsed`. */
  collapsed?: boolean
  /** Uncontrolled initial collapsed state when `collapsed` is omitted. */
  defaultCollapsed?: boolean
  /**
   * @deprecated Use `collapsed` / `v-model:collapsed` instead.
   * Alias of `collapsed` for legacy `v-model`.
   */
  modelValue?: boolean
  size?: PanelSize
}

export interface PanelEmits {
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}
