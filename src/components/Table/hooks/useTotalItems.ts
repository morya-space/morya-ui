import type { ComputedRef, Ref } from 'vue'
import type { TableFilterOption, TableItem } from '../types'
import type { ClientSortOptions, EmitsEventName } from './internal'
import { computed } from 'vue'
import {
  filterTableItems,
  searchTableItems,
  sortTableItems,
  toggleSelectedItems,
} from '../tableQuery'

export function useTotalItems(
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<TableFilterOption[] | null>,
  filters: Ref<Record<string, unknown> | null>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<TableItem[]>,
  itemsSelected: Ref<TableItem[] | null>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  rowKey: Ref<string>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const itemsSearching = computed(() => {
    if (isServerSideMode.value || searchValue.value === '') return items.value
    return searchTableItems(items.value, searchValue.value, searchField.value)
  })

  const itemsFiltering = computed(() =>
    filterTableItems(itemsSearching.value, filters.value, filterOptions.value),
  )

  const totalItems = computed(() => {
    if (isServerSideMode.value) return items.value
    if (clientSortOptions.value === null) return itemsFiltering.value
    const { sortBy, sortDesc } = clientSortOptions.value
    return sortTableItems(itemsFiltering.value, sortBy, sortDesc, multiSort.value)
  })

  const totalItemsLength = computed(() =>
    isServerSideMode.value ? serverItemsLength.value : totalItems.value.length,
  )

  const selectItemsComputed = computed({
    get: () => itemsSelected.value ?? [],
    set: (value) => emits('update:selection', value),
  })

  const toggleSelectAll = (isChecked: boolean) => {
    selectItemsComputed.value = isChecked ? totalItems.value : []
    if (isChecked) emits('selectAll')
  }

  const toggleSelectItem = (item: TableItem) => {
    const { next, selected, row } = toggleSelectedItems(
      selectItemsComputed.value,
      item,
      rowKey.value,
    )
    selectItemsComputed.value = next
    emits(selected ? 'selectRow' : 'deselectRow', row)
  }

  return {
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  }
}
