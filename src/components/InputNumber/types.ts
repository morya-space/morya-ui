import type { WdSizeInput } from '../../shared/types'

export type InputNumberButtonPlacement = 'both' | 'right'

export interface InputNumberProps {
  modelValue?: number | null
  label?: string
  min?: number
  max?: number
  step?: number
  /** Decimal places to round to. */
  precision?: number
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  helpText?: string
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  fluid?: boolean
  size?: WdSizeInput
  showButtons?: boolean
  /** Where increment/decrement buttons sit. Defaults to `'both'`. */
  buttonPlacement?: InputNumberButtonPlacement
  clearable?: boolean
  id?: string
}

export interface InputNumberEmits {
  (event: 'update:modelValue', value: number | null): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: number | null): void
}

export interface InputNumberInstance {
  focus: () => void
  blur: () => void
  select: () => void
}
