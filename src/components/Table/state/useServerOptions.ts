import type { Ref, WritableComputedRef } from 'vue'
import type { TableServerOptions, TableSortType } from '../types'
import type { EmitsEventName, ServerOptionsComputed } from './internal'
import { computed } from 'vue'

function asSortArrays(
  sortBy: string | string[] | null,
  sortType: TableSortType | TableSortType[] | null,
): { sortBy: string[]; sortType: TableSortType[] } {
  const by = Array.isArray(sortBy)
    ? [...sortBy]
    : sortBy
      ? [sortBy]
      : []
  const type = Array.isArray(sortType)
    ? [...sortType]
    : sortType
      ? [sortType]
      : []
  return { sortBy: by, sortType: type }
}

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
    if (multiSort.value) {
      const { sortBy, sortType } = asSortArrays(
        serverOptionsComputed.value.sortBy,
        serverOptionsComputed.value.sortType,
      )
      const index = sortBy.findIndex((val) => val === newSortBy)
      if (index === -1 && newSortType !== null) {
        sortBy.push(newSortBy)
        sortType.push(newSortType)
      } else if (newSortType === null) {
        if (index !== -1) {
          sortBy.splice(index, 1)
          sortType.splice(index, 1)
        }
      } else if (index === -1) {
        sortBy.push(newSortBy)
        sortType.push(newSortType)
      } else {
        sortType[index] = newSortType
      }
      serverOptionsComputed.value = {
        ...serverOptionsComputed.value,
        sortBy,
        sortType,
      }
      return
    }

    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      sortBy: newSortType !== null ? newSortBy : undefined,
      sortType: newSortType ?? undefined,
    }
  }

  return {
    serverOptionsComputed,
    updateServerOptionsPage,
    updateServerOptionsSort,
    updateServerOptionsRowsPerPage,
  }
}
