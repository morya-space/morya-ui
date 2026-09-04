import type { WdSizeInput } from '../../shared/types'

export interface InputColorProps {
  modelValue?: string
  disabled?: boolean
  id?: string
  label?: string
  invalid?: boolean
  size?: WdSizeInput
  /** Preset hex colors shown under the input. */
  swatches?: string[]
}

export interface InputColorEmits {
  (event: 'update:modelValue', value: string): void
}
