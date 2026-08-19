import type { WdAppendTo } from '../../shared/overlay'
import type { WdSizeInput } from '../../shared/types'

export interface TreeSelectNode {
  key: string
  label: string
  children?: TreeSelectNode[]
  disabled?: boolean
}

export interface TreeSelectProps {
  options: TreeSelectNode[]
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  size?: WdSizeInput
  selectionMode?: 'single'
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface TreeSelectEmits {
  (event: 'update:modelValue', value: string | null): void
}
