import type { WiInputVariant, WiSizeInput } from '../../shared/types'

export interface TextareaProps {
  modelValue?: string
  label?: string
  helpText?: string
  /** Prefer over `error`. Marks the field invalid. */
  invalid?: boolean
  /** @deprecated Prefer `invalid`. */
  error?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Grow height to fit content . */
  autoResize?: boolean
  /** Size aligned with Textarea; also accepts legacy sm/md/lg. */
  size?: WiSizeInput
  /** Visual variant; default outlined. */
  variant?: WiInputVariant
  /** Full-width textarea. */
  fluid?: boolean
  disabled?: boolean
  readonly?: boolean
}

export interface TextareaEmits {
  (event: 'update:modelValue', value: string): void
}
