import type { WiTextareaAutosize } from '../../shared/componentDefaults'
import type { WiInputVariant, WiSizeInput } from '../../shared/types'

export type { WiTextareaAutosize }

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
  /**
   * Auto-grow height. Pass `{ minRows, maxRows }` to clamp.
   * Boolean `true` is equivalent to unbounded grow.
   */
  autosize?: WiTextareaAutosize
  /** @deprecated Prefer `autosize`. */
  autoResize?: boolean
  /** Size aligned with Textarea; also accepts legacy sm/md/lg. */
  size?: WiSizeInput
  /** Visual variant; default outlined. */
  variant?: WiInputVariant
  /** Full-width textarea. */
  fluid?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
}

export interface TextareaEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
}

export interface TextareaInstance {
  focus: () => void
}
