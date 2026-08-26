import type { WiSizeInput } from '../../shared/types'

export interface InputOtpProps {
  modelValue?: string
  length?: number
  disabled?: boolean
  integerOnly?: boolean
  /** Mask each digit. */
  mask?: boolean
  size?: WiSizeInput
  /** Gap between cells. Number is pixels. */
  gap?: string | number
}

export interface InputOtpEmits {
  (event: 'update:modelValue', value: string): void
}
