import type { WiInputVariant, WiSizeInput } from '../../shared/types'

export interface InputProps {
  modelValue?: string
  label?: string
  helpText?: string
  /** Marks the field invalid. */
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel'
  /** Size aligned with InputText; also accepts legacy sm/md/lg. */
  size?: WiSizeInput
  /** Visual variant; default outlined. */
  variant?: WiInputVariant
  /** Full-width input. */
  fluid?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  /** Native maxlength. */
  maxlength?: number
  /** Show character count (with maxlength when set). */
  showCount?: boolean
}

export interface InputEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
}

export interface InputInstance {
  focus: () => void
  blur: () => void
  select: () => void
}
