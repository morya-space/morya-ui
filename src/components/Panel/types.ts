import type { WiSizeInput } from '../../shared/types'

export type PanelSize = WiSizeInput

export interface PanelProps {
  header?: string
  toggleable?: boolean
  /** Collapsed state. Prefer `v-model` / `modelValue` when both are used. */
  collapsed?: boolean
  /** Alias of `collapsed` for `v-model`. */
  modelValue?: boolean
  size?: PanelSize
}

export interface PanelEmits {
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}
