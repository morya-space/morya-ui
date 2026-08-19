export interface PaginationProps {
  /** Current page (1-based). Use with `v-model`. */
  modelValue?: number
  totalRecords: number
  rows?: number
  pageLinkSize?: number
  disabled?: boolean
}

export interface PaginationEmits {
  (event: 'update:modelValue', value: number): void
  (event: 'page', value: number): void
}

export interface PaginationInstance {
  /** Zero-based index of the first record on the current page: `(page - 1) * rows`. */
  first: number
  pageCount: number
}
