import type { WiAppendTo } from '../../shared/overlay'
import type { WiSizeInput } from '../../shared/types'

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
  size?: WiSizeInput
  selectionMode?: 'single'
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface TreeSelectEmits {
  (event: 'update:modelValue', value: string | null): void
}
