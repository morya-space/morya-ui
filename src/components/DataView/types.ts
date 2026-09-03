export type DataViewLayout = 'list' | 'grid'

export interface DataViewProps {
  value?: unknown[]
  layout?: DataViewLayout
  paginator?: boolean
  rows?: number
  /** Controlled page (1-based). Use with `v-model:page`; omit for uncontrolled. */
  page?: number
  /** Show loading overlay mask. */
  loading?: boolean
  /** Empty state message; defaults to locale `emptyMessage`. */
  emptyMessage?: string
  /** Disable built-in pagination controls. */
  disabled?: boolean
  /** Pass through to `WiPagination` (`show-size-picker`). */
  showSizePicker?: boolean
  /** Pass through to `WiPagination` (`page-sizes`). */
  pageSizes?: number[]
}

export interface DataViewEmits {
  (event: 'update:page', value: number): void
}
