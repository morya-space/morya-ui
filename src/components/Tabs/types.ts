export interface TabItem {
  label: string
  value: string
  disabled?: boolean
}

export interface TabsProps {
  modelValue?: string
  tabs: TabItem[]
}

export interface TabsEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
