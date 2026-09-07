import type { RdTextareaAutosize } from '../../shared/componentDefaults'
import type { RdInputVariant, RdSizeInput } from '../../shared/types'

export type { RdTextareaAutosize }

export interface TextareaProps {
  modelValue?: string
  label?: string
  helpText?: string
  /** Marks the field invalid. */
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /**
   * Auto-grow height. Pass `{ minRows, maxRows }` to clamp.
   * Boolean `true` is equivalent to unbounded grow.
   */
  autosize?: RdTextareaAutosize
  /** Size aligned with Textarea; also accepts legacy sm/md/lg. */
  size?: RdSizeInput
  /** Visual variant; default outlined. */
  variant?: RdInputVariant
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
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
}

export interface TextareaInstance {
  focus: () => void
  blur: () => void
  select: () => void
}
