import type { FieldPassThrough } from '../../shared/passThrough'
import type { MFieldStatus, MInputVariant, MSizeInput } from '../../shared/types'

export interface MentionsOption {
  value: string
  label?: string
}

export type MentionsRawOption = string | MentionsOption

export interface MentionsProps {
  pt?: FieldPassThrough
  modelValue?: string
  options?: MentionsRawOption[]
  /** Trigger character(s). Default `@`. */
  prefix?: string | string[]
  /** Character appended after a completed mention. Default single space. */
  split?: string
  rows?: number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  status?: MFieldStatus
  errorMessage?: string
  helpText?: string
  id?: string
  size?: MSizeInput
  variant?: MInputVariant
  fluid?: boolean
  emptyMessage?: string
  clearable?: boolean
  /** Alias of `clearable` . `clearable` wins. */
  allowClear?: boolean
  /** Shows a spinner in the suggestion panel while options load. */
  loading?: boolean
}

export interface MentionsEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
  (event: 'select', option: MentionsOption): void
}
