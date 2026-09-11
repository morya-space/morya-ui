import type { MTextareaAutosize } from '../../shared/componentDefaults'
import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MInputVariant, MSizeInput } from '../../shared/types'

export type { MTextareaAutosize }

export interface TextareaProps extends MNativeInputProps {
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
  autosize?: MTextareaAutosize
  /** Size aligned with Textarea; also accepts legacy sm/md/lg. */
  size?: MSizeInput
  /** Visual variant; default outlined. */
  variant?: MInputVariant
  /** Full-width textarea. */
  fluid?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
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
