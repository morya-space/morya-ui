import type { RootPassThrough } from '../../shared/passThrough'
export interface PickListProps {
  pt?: RootPassThrough
  source?: unknown[]
  target?: unknown[]
  dataKey?: string
  sourceHeader?: string
  targetHeader?: string
  /** Empty state message; defaults to locale `emptyMessage`. */
  emptyMessage?: string
}

export interface PickListEmits {
  (event: 'update:source', value: unknown[]): void
  (event: 'update:target', value: unknown[]): void
}
