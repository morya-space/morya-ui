import type { WdAppendTo } from '../../shared/overlay'
import type { WdSizeInput } from '../../shared/types'

export interface AutoCompleteProps {
  modelValue?: string
  suggestions?: string[]
  dropdown?: boolean
  disabled?: boolean
  placeholder?: string
  size?: WdSizeInput
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface AutoCompleteEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
}
