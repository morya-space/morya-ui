import type { MAppendTo } from '../../shared/overlay'
import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface AutoCompleteOption {
  label: string
  value: string
}

export type AutoCompleteSuggestion = string | AutoCompleteOption

export interface AutoCompleteProps extends MNativeInputProps {
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
  size?: MSizeInput
  loading?: boolean
  clearable?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface AutoCompleteEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
  (event: 'clear'): void
}
