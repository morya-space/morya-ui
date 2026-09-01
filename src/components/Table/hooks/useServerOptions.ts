import type { Ref, WritableComputedRef } from 'vue'
import type { TableServerOptions, TableSortType } from '../types'
import type { EmitsEventName, ServerOptionsComputed } from './internal'
import { computed } from 'vue'

export function useServerOptions(
  serverOptions: Ref<TableServerOptions | null>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const serverOptionsComputed = computed({
    get: (): ServerOptionsComputed | null => {
      if (!serverOptions.value) return null
      const { page, rowsPerPage, sortBy, sortType } = serverOptions.value
      return {
        page,
        rowsPerPage,
        sortBy: sortBy ?? null,
        sortType: sortType ?? null,
      }
    },
    set: (value) => {
      if (value) emits('update:serverOptions', value as TableServerOptions)
    },
  }) as WritableComputedRef<ServerOptionsComputed | null>

  const updateServerOptionsPage = (page: number) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = { ...serverOptionsComputed.value, page }
    }
  }

  const updateServerOptionsRowsPerPage = (rowsPerPage: number) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = { ...serverOptionsComputed.value, page: 1, rowsPerPage }
    }
  }

  const updateServerOptionsSort = (newSortBy: string, newSortType: TableSortType | null) => {
    if (!serverOptionsComputed.value) return
    if (
      multiSort.value
      && Array.isArray(serverOptionsComputed.value.sortBy)
      && Array.isArray(serverOptionsComputed.value.sortType)
    ) {
      const index = serverOptionsComputed.value.sortBy.findIndex((val) => val === newSortBy)
      if (index === -1 && newSortType !== null) {
        serverOptionsComputed.value.sortBy.push(newSortBy)
        serverOptionsComputed.value.sortType.push(newSortType)
      } else if (newSortType === null) {
        serverOptionsComputed.value.sortBy.splice(index, 1)
        serverOptionsComputed.value.sortType.splice(index, 1)
      } else {
        serverOptionsComputed.value.sortType[index] = newSortType
      }
    } else {
      serverOptionsComputed.value = {
        ...serverOptionsComputed.value,
        sortBy: newSortType !== null ? newSortBy : null,
        sortType: newSortType,
      }
    }
  }

  return {
    serverOptionsComputed,
    updateServerOptionsPage,
    updateServerOptionsSort,
    updateServerOptionsRowsPerPage,
  }
}
