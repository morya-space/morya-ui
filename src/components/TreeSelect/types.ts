import type { WiAppendTo } from '../../shared/overlay'
import type { WiSizeInput } from '../../shared/types'
import type { TreeCheckStrategy } from '../Tree/types'

export type { TreeCheckStrategy }

export interface TreeSelectNode {
  key: string
  label: string
  children?: TreeSelectNode[]
  disabled?: boolean
}

export type TreeSelectValue = string | string[] | null

export interface TreeSelectProps {
  options: TreeSelectNode[]
  modelValue?: TreeSelectValue
  placeholder?: string
  disabled?: boolean
  size?: WiSizeInput
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
  appendTo?: WiAppendTo
}

export interface TreeSelectEmits {
  (event: 'update:modelValue', value: TreeSelectValue): void
  (event: 'clear'): void
}
