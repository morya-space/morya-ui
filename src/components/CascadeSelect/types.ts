import type { WdAppendTo } from '../../shared/overlay'
import type { WdSizeInput } from '../../shared/types'

export interface CascadeSelectOption {
  label: string
  value: string | number
  children?: CascadeSelectOption[]
  disabled?: boolean
}

export type CascadeSelectValue = string | number | null

export interface CascadeSelectProps {
  modelValue?: CascadeSelectValue
  options: CascadeSelectOption[]
  placeholder?: string
  disabled?: boolean
  size?: WdSizeInput
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface CascadeSelectEmits {
  (event: 'update:modelValue', value: CascadeSelectValue): void
}
