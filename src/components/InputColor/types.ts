import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface InputColorProps extends MNativeInputProps {
  modelValue?: string
  disabled?: boolean
  id?: string
  label?: string
  invalid?: boolean
  size?: MSizeInput
  /** Preset hex colors shown under the input. */
  swatches?: string[]
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface InputColorEmits {
  (event: 'update:modelValue', value: string): void
}
