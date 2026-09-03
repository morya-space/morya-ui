import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import type { MultipleSelectStatus } from './internal'
import { computed } from 'vue'
import { sameTableItem } from '../utils'

export function usePageItems(
  currentPaginationNumber: Ref<number>,
  isMultipleSelectable: ComputedRef<boolean>,
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

  const itemsWithIndex = computed(() => {
    if (!showIndex.value) return itemsInPage.value
    return itemsInPage.value.map((item, index) => ({
      index: currentPageFirstIndex.value + index,
      ...item,
    }))
  })

  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    if (selectItemsComputed.value.length === 0) return 'noneSelected'

    const isNoneSelected = selectItemsComputed.value.every((itemSelected) =>
      totalItems.value.every((item) => !sameTableItem(itemSelected, item, rowKey.value)),
    )
    if (isNoneSelected) return 'noneSelected'

    if (selectItemsComputed.value.length === totalItems.value.length) {
      const isAllSelected = selectItemsComputed.value.every((itemSelected) =>
        totalItems.value.some((item) => sameTableItem(itemSelected, item, rowKey.value)),
      )
      return isAllSelected ? 'allSelected' : 'partSelected'
    }

    return 'partSelected'
  })

  const pageItems = computed(() => {
    if (!isMultipleSelectable.value) return itemsWithIndex.value
    if (multipleSelectStatus.value === 'allSelected') {
      return itemsWithIndex.value.map((item) => ({ checkbox: true, ...item }))
    }
    if (multipleSelectStatus.value === 'noneSelected') {
      return itemsWithIndex.value.map((item) => ({ checkbox: false, ...item }))
    }
    return itemsWithIndex.value.map((item) => {
      const clone = { ...item }
      delete clone.index
      const isSelected = selectItemsComputed.value.some((selectItem) =>
        sameTableItem(selectItem, clone as TableItem, rowKey.value),
      )
      return { checkbox: isSelected, ...item }
    })
  })

  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems,
  }
}
