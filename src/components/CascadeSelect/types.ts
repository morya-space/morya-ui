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
  label?: string
  helpText?: string
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: WdSizeInput
  fluid?: boolean
  /** Show clear button when a value is selected. */
  clearable?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface CascadeSelectEmits {
  (event: 'update:modelValue', value: CascadeSelectValue): void
  (event: 'clear'): void
}
