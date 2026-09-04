import type { WdSizeInput } from '../../shared/types'

export interface InputOtpProps {
  modelValue?: string
  length?: number
  disabled?: boolean
  invalid?: boolean
  integerOnly?: boolean
  /** Mask each digit. */
  mask?: boolean
  label?: string
  size?: WdSizeInput
  /** Gap between cells. Number is pixels. */
  gap?: string | number
}

export interface InputOtpEmits {
  (event: 'update:modelValue', value: string): void
}
