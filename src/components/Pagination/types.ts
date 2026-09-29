import type { RootPassThrough } from '../../shared/passThrough'
import type { MSize } from '../../shared/types'

export type PaginationSize = MSize

export interface PaginationProps {
  pt?: RootPassThrough
  /** Current page (1-based). Use with `v-model`. */
  modelValue?: number
  totalRecords: number
  rows?: number
  /** Alias of `rows`. `pageSize` wins when both are set. */
  pageSize?: number
  pageLinkSize?: number
  disabled?: boolean
  /** Control size; uses `--m-control-height-*`. */
  size?: PaginationSize
  /** Show a page-size `<select>`. */
  showSizePicker?: boolean
  /** Alias of `showSizePicker` (`showSizeChanger`). Either flag enables the picker. */
  showSizeChanger?: boolean
  /** Options for `showSizePicker`. */
  pageSizes?: number[]
  /** Jump to a page with a page select. */
  showQuickJumper?: boolean
  /** Compact prev / current / next. */
  simple?: boolean
}

export interface PaginationEmits {
  (event: 'update:modelValue', value: number): void
  (event: 'page', value: number): void
  (event: 'update:rows', value: number): void
  (event: 'update:pageSize', value: number): void
}

export interface PaginationInstance {
  /** Zero-based index of the first record on the current page: `(page - 1) * rows`. */
  first: number
  pageCount: number
}
