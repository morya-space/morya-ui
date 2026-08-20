import type { WiInputVariant, WiSizeInput } from '../../shared/types'

export interface InputProps {
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
}

export interface InputInstance {
  focus: () => void
}
