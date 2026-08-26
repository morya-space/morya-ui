export interface PaginationProps {
  /** Current page (1-based). Use with `v-model`. */
  modelValue?: number
  totalRecords: number
  rows?: number
  /** Alias of `rows` (Naive `page-size`). `pageSize` wins when both are set. */
  pageSize?: number
  pageLinkSize?: number
  disabled?: boolean
  /** Show a page-size `<select>` (Naive `show-size-picker`). */
  showSizePicker?: boolean
  /** Options for `showSizePicker`. */
  pageSizes?: number[]
  /** Jump-to-page input (Naive `show-quick-jumper`). */
  showQuickJumper?: boolean
  /** Compact prev / current / next (Naive `simple`). */
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
