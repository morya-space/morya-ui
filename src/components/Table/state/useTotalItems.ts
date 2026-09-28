import type { ComputedRef, Ref } from 'vue'
import type { TableFilterOption, TableItem } from '../types'
import type { ClientSortOptions, EmitsEventName } from './internal'
import { computed } from 'vue'
import {
  filterTableItems,
  searchTableItems,
  sortTableItems,
  toggleSelectedItems,
} from '../core/tableQuery'
import { SYNTHETIC } from '../columns/keys'
import { sameTableItem } from '../core/utils'

function stripRowMeta(item: TableItem): TableItem {
  const next = { ...item }
  delete next[SYNTHETIC.index]
  delete next[SYNTHETIC.checkbox]
  delete next.index
  delete next.checkbox
  return next
}

export function useTotalItems(
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<TableFilterOption[] | null>,
  filters: Ref<Record<string, unknown> | null>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<TableItem[]>,
  itemsSelected: Ref<TableItem[] | null>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverTotal: Ref<number>,
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
    isServerSideMode.value ? serverTotal.value : totalItems.value.length,
  )

  const selectItemsComputed = computed({
    get: () => itemsSelected.value ?? [],
    set: (value) => emits('update:selection', value),
  })

  /** Select / deselect rows on the current page only (matches locale `selectAllPage`). */
  const toggleSelectAll = (isChecked: boolean, pageRows: TableItem[]) => {
    const key = rowKey.value
    const pageClean = pageRows.map(stripRowMeta)
    if (isChecked) {
      const next = [...selectItemsComputed.value]
      for (const row of pageClean) {
        if (!next.some((selected) => sameTableItem(selected, row, key))) {
          next.push(row)
        }
      }
      selectItemsComputed.value = next
      emits('select-all')
      return
    }
    selectItemsComputed.value = selectItemsComputed.value.filter(
      (selected) => !pageClean.some((row) => sameTableItem(selected, row, key)),
    )
  }

  const toggleSelectItem = (item: TableItem) => {
    const { next, selected, row } = toggleSelectedItems(
      selectItemsComputed.value,
      stripRowMeta(item),
      rowKey.value,
    )
    selectItemsComputed.value = next
    emits(selected ? 'select-row' : 'deselect-row', row)
  }

  return {
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  }
}
