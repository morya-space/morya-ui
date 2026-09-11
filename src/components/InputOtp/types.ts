import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface InputOtpProps {
  modelValue?: string
  length?: number
  disabled?: boolean
  invalid?: boolean
  integerOnly?: boolean
  /** Mask each digit. */
  mask?: boolean
  label?: string
  size?: MSizeInput
  /** Gap between cells. Number is pixels. */
  gap?: string | number
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}

export interface InputOtpEmits {
  (event: 'update:modelValue', value: string): void
}
