import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { MAppendTo } from '../../shared/overlay'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'

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
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
  /**
   * Virtualize suggestions. Default auto-enables when there are 80+ items.
   * Pass `false` to always render the full list; `true` to always virtualize.
   */
  virtual?: boolean
}

export interface AutoCompleteEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
  (event: 'clear'): void
}
