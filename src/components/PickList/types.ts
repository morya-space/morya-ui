export interface PickListProps {
  source?: unknown[]
  target?: unknown[]
  dataKey?: string
  sourceHeader?: string
  targetHeader?: string
}

export interface PickListEmits {
  (event: 'update:source', value: unknown[]): void
  (event: 'update:target', value: unknown[]): void
}
