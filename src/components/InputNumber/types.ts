import type { WiSizeInput } from '../../shared/types'

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
  invalid?: boolean
  fluid?: boolean
  size?: WiSizeInput
  showButtons?: boolean
  /** Where increment/decrement buttons sit. Defaults to `'both'`. */
  buttonPlacement?: InputNumberButtonPlacement
  clearable?: boolean
  id?: string
}

export interface InputNumberEmits {
  (event: 'update:modelValue', value: number | null): void
}
