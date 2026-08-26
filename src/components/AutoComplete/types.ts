import type { WiAppendTo } from '../../shared/overlay'
import type { WiSizeInput } from '../../shared/types'

export interface AutoCompleteOption {
  label: string
  value: string
}

export type AutoCompleteSuggestion = string | AutoCompleteOption

export interface AutoCompleteProps {
  modelValue?: string
  suggestions?: AutoCompleteSuggestion[]
  dropdown?: boolean
  disabled?: boolean
  placeholder?: string
  size?: WiSizeInput
  loading?: boolean
  clearable?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface AutoCompleteEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
}
