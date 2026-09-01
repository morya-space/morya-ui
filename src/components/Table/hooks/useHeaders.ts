import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import type { TableHeader, TableItem, TableServerOptions, TableSortType } from '../types'
import type { ClientSortOptions, EmitsEventName, HeaderForRender, ServerOptionsComputed } from './internal'
import { computed, ref } from 'vue'

/** 选择列默认宽度（容纳标准 WiCheckbox / WiRadio + focus ring） */
export const DEFAULT_SELECTION_COLUMN_WIDTH = 48

export function useHeaders(
  showIndexSymbol: Ref<string>,
  checkboxColumnWidth: Ref<number | null>,
  expandColumnWidth: Ref<number>,
  fixedCheckbox: Ref<boolean>,
  fixedExpand: Ref<boolean>,
  fixedIndex: Ref<boolean>,
  headers: Ref<TableHeader[]>,
  ifHasExpandSlot: ComputedRef<boolean>,
  indexColumnWidth: Ref<number>,
  selectionColumn: ComputedRef<'checkbox' | 'radio' | null>,
  isServerSideMode: ComputedRef<boolean>,
  mustSort: Ref<boolean>,
  serverOptionsComputed: WritableComputedRef<ServerOptionsComputed | null>,
  showIndex: Ref<boolean>,
  sortBy: Ref<string | string[]>,
  sortType: Ref<TableSortType | TableSortType[]>,
  multiSort: Ref<boolean>,
  updateServerOptionsSort: (newSortBy: string, newSortType: TableSortType | null) => void,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const hasFixedColumnsFromUser = computed(() => headers.value.some((header) => header.fixed))
  const fixedHeadersFromUser = computed(() =>
    hasFixedColumnsFromUser.value ? headers.value.filter((header) => header.fixed) : [],
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

  const clientSortOptions = ref<ClientSortOptions | null>(
    generateClientSortOptions(sortBy.value, sortType.value),
  )

  const headersForRender = computed((): HeaderForRender[] => {
    const fixedHeaders = [...fixedHeadersFromUser.value, ...unFixedHeaders.value] as HeaderForRender[]

    const headersSorting = fixedHeaders.map((header) => {
      const headerSorting: HeaderForRender = { ...header }
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
          value: 'expand',
          fixed: fixedExpand.value || hasFixedColumnsFromUser.value,
          width: expandColumnWidth.value,
        }, ...headersSorting]
      : headersSorting

    const headersWithIndex: HeaderForRender[] = showIndex.value
      ? [{
          text: showIndexSymbol.value,
          value: 'index',
          fixed: fixedIndex.value || hasFixedColumnsFromUser.value,
          width: indexColumnWidth.value,
        }, ...headersWithExpand]
      : headersWithExpand

    const selectionHeader: HeaderForRender[] =
      selectionColumn.value === 'checkbox'
        ? [{
            text: 'checkbox',
            value: 'checkbox',
            fixed: fixedCheckbox.value || hasFixedColumnsFromUser.value,
            width: checkboxColumnWidth.value ?? DEFAULT_SELECTION_COLUMN_WIDTH,
          }]
        : selectionColumn.value === 'radio'
          ? [{
              text: '',
              value: 'radio',
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

    if (
      clientSortOptions.value
      && Array.isArray(clientSortOptions.value.sortBy)
      && Array.isArray(clientSortOptions.value.sortDesc)
    ) {
      const index = clientSortOptions.value.sortBy.indexOf(newSortBy)
      if (index === -1) {
        if (newSortType !== null) {
          clientSortOptions.value.sortBy.push(newSortBy)
          clientSortOptions.value.sortDesc.push(newSortType === 'desc')
        }
      } else if (newSortType === null) {
        clientSortOptions.value.sortDesc.splice(index, 1)
        clientSortOptions.value.sortBy.splice(index, 1)
      } else {
        clientSortOptions.value.sortDesc[index] = newSortType === 'desc'
      }
    } else if (newSortType === null) {
      clientSortOptions.value = null
    } else {
      clientSortOptions.value = {
        sortBy: newSortBy,
        sortDesc: newSortType === 'desc',
      }
    }

    emits('updateSort', { sortType: newSortType, sortBy: newSortBy })
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
