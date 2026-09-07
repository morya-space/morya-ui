import type { RdAppendTo } from '../../shared/overlay'
import type { RdSizeInput } from '../../shared/types'

export interface AutoCompleteOption {
  label: string
  value: string
}

export type AutoCompleteSuggestion = string | AutoCompleteOption

export interface AutoCompleteProps {
  modelValue?: string
  suggestions?: AutoCompleteSuggestion[]
  id?: string
  label?: string
  helpText?: string
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  emptyMessage?: string
  dropdown?: boolean
  disabled?: boolean
  placeholder?: string
  size?: RdSizeInput
  loading?: boolean
  clearable?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: RdAppendTo
}

export interface AutoCompleteEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
  (event: 'clear'): void
}
