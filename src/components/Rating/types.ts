import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface RatingProps {
  modelValue?: number
  stars?: number
  disabled?: boolean
  readonly?: boolean
  label?: string
  invalid?: boolean
  helpText?: string
  errorMessage?: string
  size?: MSizeInput
  /** Show a clear control. Defaults to `true`. */
  clearable?: boolean | null
  /** Allow 0.5 increments. */
  allowHalf?: boolean
  /** Accessible label for the slider root. Falls back to the locale string. */
  ariaLabel?: string
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface RatingEmits {
  (event: 'update:modelValue', value: number): void
}
