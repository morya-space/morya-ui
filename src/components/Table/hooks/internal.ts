import type { TableSortType } from '../types'

export type ServerOptionsComputed = {
  page: number
  rowsPerPage: number
  sortBy: string | string[] | null
  sortType: TableSortType | TableSortType[] | null
}

export type HeaderForRender = {
  text: string
  value: string
  sortable?: boolean
  sortType?: TableSortType | 'none'
  fixed?: boolean
  width?: number
}

export type ClientSortOptions = {
  sortBy: string | string[]
  sortDesc: boolean | boolean[]
}

export type MultipleSelectStatus = 'allSelected' | 'noneSelected' | 'partSelected'

export type EmitsEventName =
  | 'clickRow'
  | 'contextmenuRow'
  | 'selectRow'
  | 'deselectRow'
  | 'expandRow'
  | 'updateSort'
  | 'update:itemsSelected'
  | 'update:serverOptions'
  | 'updateFilter'
  | 'updatePageItems'
  | 'updateTotalItems'
  | 'selectAll'

export type TableEmitFn = (event: EmitsEventName, ...args: unknown[]) => void
