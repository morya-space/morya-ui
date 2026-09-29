import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import type { TableHeader, TableSortMode, TableSortType } from '../types'
import type { ClientSortOptions, EmitsEventName, HeaderForRender, ServerOptionsComputed } from '../state/internal'
import { computed, ref, watch } from 'vue'
import { SYNTHETIC } from './keys'

/** 选择列默认宽度（容纳标准 MCheckbox / MRadio + focus ring） */
export const DEFAULT_SELECTION_COLUMN_WIDTH = 48

export interface UseHeadersOptions {
  showIndexSymbol: Ref<string>
  checkboxColumnWidth: Ref<number | null>
  expandColumnWidth: Ref<number>
  fixedCheckbox: Ref<boolean>
  fixedExpand: Ref<boolean>
  fixedIndex: Ref<boolean>
  headers: Ref<TableHeader[]>
  ifHasExpandSlot: ComputedRef<boolean>
  indexColumnWidth: Ref<number>
  selectionColumn: ComputedRef<'checkbox' | 'radio' | null>
  isServerSideMode: ComputedRef<boolean>
  mustSort: Ref<boolean>
  serverOptionsComputed: WritableComputedRef<ServerOptionsComputed | null>
  showIndex: Ref<boolean>
  sortBy: Ref<string | string[]>
  sortType: Ref<TableSortType | TableSortType[]>
  multiSort: Ref<boolean>
  sortMode: Ref<TableSortMode>
  updateServerOptionsSort: (newSortBy: string, newSortType: TableSortType | null) => void
  emits: (event: EmitsEventName, ...args: unknown[]) => void
}

export function useHeaders(options: UseHeadersOptions) {
  const {
    showIndexSymbol,
    checkboxColumnWidth,
    expandColumnWidth,
    fixedCheckbox,
    fixedExpand,
    fixedIndex,
    headers,
    ifHasExpandSlot,
    indexColumnWidth,
    selectionColumn,
    isServerSideMode,
    mustSort,
    serverOptionsComputed,
    showIndex,
    sortBy,
    sortType,
    multiSort,
    sortMode,
    updateServerOptionsSort,
    emits,
  } = options
  const hasFixedColumnsFromUser = computed(() => headers.value.some((header) => header.fixed))
  const leftFixedHeadersFromUser = computed(() =>
    hasFixedColumnsFromUser.value
      ? headers.value.filter((header) => header.fixed && header.fixed !== 'right')
      : [],
  )
  const rightFixedHeadersFromUser = computed(() =>
    hasFixedColumnsFromUser.value ? headers.value.filter((header) => header.fixed === 'right') : [],
  )
  const unFixedHeaders = computed(() => headers.value.filter((header) => !header.fixed))

  const generateClientSortOptions = (
    sortByValue: string | string[],
    sortTypeValue: TableSortType | TableSortType[],
  ): ClientSortOptions | null => {
    if (Array.isArray(sortByValue) && Array.isArray(sortTypeValue)) {
      return {
        sortBy: sortByValue,
        sortDesc: sortTypeValue.map((val) => val === 'desc'),
      }
    }
    if (sortByValue !== '') {
      return {
        sortBy: sortBy.value,
        sortDesc: sortType.value === 'desc',
      }
    }
    return null
  }

  const internalClientSortOptions = ref<ClientSortOptions | null>(
    generateClientSortOptions(sortBy.value, sortType.value),
  )

  watch([sortBy, sortType], () => {
    if (sortMode.value === 'emit') return
    internalClientSortOptions.value = generateClientSortOptions(sortBy.value, sortType.value)
  })

  /**
   * In `emit` sort mode the parent owns sorting: indicators derive from the
   * controlled `sortField`/`sortOrder` props and internal state is never mutated.
   */
  const clientSortOptions = computed<ClientSortOptions | null>({
    get: () =>
      sortMode.value === 'emit'
        ? generateClientSortOptions(sortBy.value, sortType.value)
        : internalClientSortOptions.value,
    set: (value) => {
      internalClientSortOptions.value = value
    },
  })

  const headersForRender = computed((): HeaderForRender[] => {
    const orderedHeaders = [
      ...leftFixedHeadersFromUser.value,
      ...unFixedHeaders.value,
      ...rightFixedHeadersFromUser.value,
    ] as HeaderForRender[]

    const headersSorting = orderedHeaders.map((header) => {
      const headerSorting: HeaderForRender = {
        ...header,
        resizable: header.resizable,
        filterable: header.filterable,
        filters: header.filters,
        editable: header.editable,
        minWidth: header.minWidth,
      }
      if (headerSorting.sortable) headerSorting.sortType = 'none'

      if (serverOptionsComputed.value) {
        if (
          Array.isArray(serverOptionsComputed.value.sortBy)
          && Array.isArray(serverOptionsComputed.value.sortType)
          && serverOptionsComputed.value.sortBy.includes(headerSorting.value)
        ) {
          const index = serverOptionsComputed.value.sortBy.indexOf(headerSorting.value)
          headerSorting.sortType = serverOptionsComputed.value.sortType[index]!
        } else if (
          headerSorting.value === serverOptionsComputed.value.sortBy
          && serverOptionsComputed.value.sortType
        ) {
          headerSorting.sortType = serverOptionsComputed.value.sortType as TableSortType
        }
      }

      if (
        clientSortOptions.value
        && Array.isArray(clientSortOptions.value.sortBy)
        && Array.isArray(clientSortOptions.value.sortDesc)
        && clientSortOptions.value.sortBy.includes(headerSorting.value)
      ) {
        const index = clientSortOptions.value.sortBy.indexOf(headerSorting.value)
        headerSorting.sortType = clientSortOptions.value.sortDesc[index] ? 'desc' : 'asc'
      } else if (clientSortOptions.value && headerSorting.value === clientSortOptions.value.sortBy) {
        headerSorting.sortType = clientSortOptions.value.sortDesc ? 'desc' : 'asc'
      }

      return headerSorting
    })

    const headersWithExpand: HeaderForRender[] = ifHasExpandSlot.value
      ? [{
          text: '',
          value: SYNTHETIC.expand,
          fixed: fixedExpand.value || hasFixedColumnsFromUser.value,
          width: expandColumnWidth.value,
        }, ...headersSorting]
      : headersSorting

    const headersWithIndex: HeaderForRender[] = showIndex.value
      ? [{
          text: showIndexSymbol.value,
          value: SYNTHETIC.index,
          fixed: fixedIndex.value || hasFixedColumnsFromUser.value,
          width: indexColumnWidth.value,
        }, ...headersWithExpand]
      : headersWithExpand

    const selectionHeader: HeaderForRender[] =
      selectionColumn.value === 'checkbox'
        ? [{
            text: 'checkbox',
            value: SYNTHETIC.checkbox,
            fixed: fixedCheckbox.value || hasFixedColumnsFromUser.value,
            width: checkboxColumnWidth.value ?? DEFAULT_SELECTION_COLUMN_WIDTH,
          }]
        : selectionColumn.value === 'radio'
          ? [{
              text: '',
              value: SYNTHETIC.radio,
              fixed: fixedCheckbox.value || hasFixedColumnsFromUser.value,
              width: checkboxColumnWidth.value ?? DEFAULT_SELECTION_COLUMN_WIDTH,
            }]
          : []

    return selectionHeader.length
      ? [...selectionHeader, ...headersWithIndex]
      : headersWithIndex
  })

  const headerColumns = computed(() => headersForRender.value.map((header) => header.value))

  const updateSortField = (newSortBy: string, oldSortType: TableSortType | 'none') => {
    let newSortType: TableSortType | null = null
    if (oldSortType === 'none') newSortType = 'asc'
    else if (oldSortType === 'asc') newSortType = 'desc'
    else newSortType = mustSort.value ? 'asc' : null

    if (isServerSideMode.value) {
      updateServerOptionsSort(newSortBy, newSortType)
    }

    if (sortMode.value !== 'emit') {
      if (multiSort.value) {
        const current = internalClientSortOptions.value
        let sortByList: string[]
        let sortDescList: boolean[]
        if (
          current
          && Array.isArray(current.sortBy)
          && Array.isArray(current.sortDesc)
        ) {
          sortByList = [...current.sortBy]
          sortDescList = [...current.sortDesc]
        } else if (current && typeof current.sortBy === 'string') {
          sortByList = [current.sortBy]
          sortDescList = [Boolean(current.sortDesc)]
        } else {
          sortByList = []
          sortDescList = []
        }

        const index = sortByList.indexOf(newSortBy)
        if (index === -1) {
          if (newSortType !== null) {
            sortByList.push(newSortBy)
            sortDescList.push(newSortType === 'desc')
          }
        } else if (newSortType === null) {
          sortByList.splice(index, 1)
          sortDescList.splice(index, 1)
        } else {
          sortDescList[index] = newSortType === 'desc'
        }

        internalClientSortOptions.value = sortByList.length
          ? { sortBy: sortByList, sortDesc: sortDescList }
          : null
      } else if (newSortType === null) {
        internalClientSortOptions.value = null
      } else {
        internalClientSortOptions.value = {
          sortBy: newSortBy,
          sortDesc: newSortType === 'desc',
        }
      }
    }

    emits('sort', { sortField: newSortBy, sortOrder: newSortType })
  }

  const isMultiSorting = (headerValue: string): boolean => {
    if (serverOptionsComputed.value && Array.isArray(serverOptionsComputed.value.sortBy)) {
      return serverOptionsComputed.value.sortBy.includes(headerValue)
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.includes(headerValue)
    }
    return false
  }

  const getMultiSortNumber = (headerValue: string) => {
    if (serverOptionsComputed.value && Array.isArray(serverOptionsComputed.value.sortBy)) {
      return serverOptionsComputed.value.sortBy.indexOf(headerValue) + 1
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.indexOf(headerValue) + 1
    }
    return false
  }

  return {
    clientSortOptions,
    headerColumns,
    headersForRender,
    updateSortField,
    isMultiSorting,
    getMultiSortNumber,
  }
}
