import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import type { MultipleSelectStatus } from './internal'
import { computed } from 'vue'
import {
  buildSelectedKeySet,
  isItemInSelection,
} from '../core/utils'

export function usePageItems(
  currentPaginationNumber: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<TableItem[]>,
  rowsPerPageRef: Ref<number>,
  selectItemsComputed: Ref<TableItem[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<TableItem[]>,
  totalItemsLength: ComputedRef<number>,
  rowKey: Ref<string>,
) {
  const currentPageFirstIndex = computed(
    () => (currentPaginationNumber.value - 1) * rowsPerPageRef.value + 1,
  )

  const currentPageLastIndex = computed(() => {
    if (isServerSideMode.value) {
      return Math.min(totalItemsLength.value, currentPaginationNumber.value * rowsPerPageRef.value)
    }
    return Math.min(totalItems.value.length, currentPaginationNumber.value * rowsPerPageRef.value)
  })

  const itemsInPage = computed(() => {
    if (isServerSideMode.value) return items.value
    return totalItems.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value)
  })

  /**
   * Identity-preserving alias of `itemsInPage`. Row indices used to be injected
   * as a synthetic `__m_index` field here, but that created a new object per row
   * on every page/sort/filter change — invalidating `<tr :key>` diffing and
   * forcing a full page re-render. The index column is now computed in the
   * template from `currentPageFirstIndex + bodyRowIndex(index)`.
   */
  const pageItems = itemsInPage

  const selectedKeySet = computed(() =>
    buildSelectedKeySet(selectItemsComputed.value, rowKey.value),
  )

  const isItemSelected = (item: TableItem) =>
    isItemInSelection(
      item,
      selectItemsComputed.value,
      selectedKeySet.value,
      rowKey.value,
    )

  /** Header checkbox status is scoped to the current page. */
  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    const page = itemsInPage.value
    if (page.length === 0 || selectItemsComputed.value.length === 0) return 'noneSelected'

    let selectedOnPage = 0
    for (const item of page) {
      if (isItemSelected(item)) selectedOnPage += 1
    }
    if (selectedOnPage === 0) return 'noneSelected'
    if (selectedOnPage === page.length) return 'allSelected'
    return 'partSelected'
  })

  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems,
    itemsInPage,
    isItemSelected,
    selectedKeySet,
  }
}
