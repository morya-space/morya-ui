import type { WiSizeInput } from '../../shared/types'

export type SwitchSize = WiSizeInput

export interface SwitchProps {
  modelValue?: boolean
  label?: string
  /** Native input id. */
  id?: string
  /** Alias of `id` . */
  inputId?: string
  name?: string
  value?: string
  size?: SwitchSize
  /** Show a spinner and block toggles. */
  loading?: boolean
  /** Text shown when checked. */
  checkedText?: string
  /** Text shown when unchecked. */
  uncheckedText?: string
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface SwitchEmits {
  (event: 'update:modelValue', value: boolean): void
}
