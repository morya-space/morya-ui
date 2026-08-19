export interface OrderListProps {
  modelValue?: unknown[]
  dataKey?: string
  listStyle?: string | Record<string, string>
  /** Enable drag-and-drop reorder. Defaults to true. */
  dragdrop?: boolean
}

export interface OrderListEmits {
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'reorder', value: unknown[]): void
}
