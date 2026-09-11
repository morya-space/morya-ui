import type { MAppendTo } from '../../shared/overlay'
import type { MNativeComboboxFieldProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { TreeCheckStrategy } from '../Tree/types'

export type { TreeCheckStrategy }

export interface TreeSelectNode {
  key: string
  label: string
  children?: TreeSelectNode[]
  disabled?: boolean
}

export type TreeSelectValue = string | string[] | null

export interface TreeSelectProps extends MNativeComboboxFieldProps {
  options: TreeSelectNode[]
  modelValue?: TreeSelectValue
  id?: string
  label?: string
  helpText?: string
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  disabled?: boolean
  size?: MSizeInput
  /** Keep for compatibility; `multiple` is the switch. */
  selectionMode?: 'single' | 'multiple'
  multiple?: boolean
  /** Show checkboxes (implies cascade like Tree). */
  checkable?: boolean
  checkStrictly?: boolean
  checkStrategy?: TreeCheckStrategy
  clearable?: boolean
  filterable?: boolean
  /** Show ancestor labels for the selected leaf. */
  showPath?: boolean
  separator?: string
  maxTagCount?: number
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface TreeSelectEmits {
  (event: 'update:modelValue', value: TreeSelectValue): void
  (event: 'clear'): void
}
