import type { WdAppendTo } from '../../shared/overlay'
import type { WdSizeInput } from '../../shared/types'

export type DatePickerValue = string | Date | null

export interface DatePickerProps {
  modelValue?: DatePickerValue
  label?: string
  disabled?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: WdSizeInput
  minDate?: DatePickerValue
  maxDate?: DatePickerValue
  placeholder?: string
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: string | null): void
}
