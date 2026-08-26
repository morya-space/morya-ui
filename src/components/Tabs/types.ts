export type TabsType = 'line' | 'card'

export interface TabItem {
  label: string
  value: string
  disabled?: boolean
  /** When set, overrides the Tabs `closable` prop for this item. */
  closable?: boolean
}

export interface TabsProps {
  modelValue?: string
  tabs: TabItem[]
  type?: TabsType
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
