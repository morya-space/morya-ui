import type { RootPassThrough } from '../../shared/passThrough'
import type { MSize } from '../../shared/types'

export type TabsType = 'line' | 'card'
export type TabsSize = MSize

export interface TabItem {
  label: string
  value: string
  disabled?: boolean
  /** When set, overrides the Tabs `closable` prop for this item. */
  closable?: boolean
}

export interface TabsProps {
  pt?: RootPassThrough
  modelValue?: string
  tabs: TabItem[]
  type?: TabsType
  /** Tab bar density; uses `--m-control-height-*`. */
  size?: TabsSize
  /** Center the tab list in the bar. */
  centered?: boolean
  /** Show a close button on tabs. Per-item `closable` wins. */
  closable?: boolean
  /** Show an add button after the tab list. */
  addable?: boolean
}

export interface TabsEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'close', value: string): void
  (event: 'add'): void
}
