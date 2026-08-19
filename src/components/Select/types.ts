import type { WdAppendTo } from '../../shared/overlay'
import type { WdSizeInput } from '../../shared/types'

export type SelectValue = string | number
export type SelectSize = WdSizeInput

export interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
}

export interface SelectProps {
  modelValue?: SelectValue | undefined
  options: SelectOption[]
  label?: string
  helpText?: string
  /** @deprecated Prefer `invalid`. */
  error?: boolean
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  fluid?: boolean
  /** Show clear button when a value is selected. */
  showClear?: boolean
  /** Empty / no-match message. Falls back to ConfigProvider `locale.emptyMessage`, then `暂无选项`. */
  emptyMessage?: string
  /** Show a filter input when the menu is open (matches option labels). */
  filter?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WdAppendTo
  placement?: 'bottom-start' | 'bottom-end'
}

export interface SelectEmits {
  (event: 'update:modelValue', value: SelectValue | undefined): void
  (event: 'change', value: SelectValue | undefined): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
}
