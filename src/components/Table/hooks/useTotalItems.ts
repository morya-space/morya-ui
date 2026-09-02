import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import type { TableFilterOption, TableItem } from '../types'
import type { ClientSortOptions, EmitsEventName } from './internal'
import { computed, watch } from 'vue'
import { getItemValue } from '../utils'

export function useTotalItems(
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<TableFilterOption[] | null>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<TableItem[]>,
  itemsSelected: Ref<TableItem[] | null>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const generateSearchingTarget = (item: TableItem): string => {
    if (typeof searchField.value === 'string' && searchField.value !== '') {
      return String(getItemValue(searchField.value, item))
    }
    if (Array.isArray(searchField.value)) {
      return searchField.value.map((field) => String(getItemValue(field, item))).join('')
    }
    return Object.values(item).join(' ')
  }

  const itemsSearching = computed(() => {
    if (!isServerSideMode.value && searchValue.value !== '') {
      const regex = new RegExp(searchValue.value, 'i')
      return items.value.filter((item) => regex.test(generateSearchingTarget(item)))
    }
    return items.value
  })

  const itemsFiltering = computed(() => {
    let itemsFiltered = [...itemsSearching.value]
    if (filterOptions.value) {
      for (const option of filterOptions.value) {
        itemsFiltered = itemsFiltered.filter((item) => {
          const { field, comparison, criteria } = option
          const itemValue = getItemValue(String(field), item)
          if (typeof comparison === 'function') {
            return comparison(itemValue, criteria as string)
          }
          switch (comparison) {
            case '=': return itemValue === criteria
            case '!=': return itemValue !== criteria
            case '>': return Number(itemValue) > Number(criteria)
            case '<': return Number(itemValue) < Number(criteria)
            case '<=': return Number(itemValue) <= Number(criteria)
            case '>=': return Number(itemValue) >= Number(criteria)
            case 'between': {
              const nums = criteria as [number, number]
              const num = Number(itemValue)
              return num >= Math.min(...nums) && num <= Math.max(...nums)
            }
            case 'in': return (criteria as unknown[]).includes(itemValue)
            default: return itemValue === criteria
          }
        })
      }
    }
    return itemsFiltered
  })

  watch(itemsFiltering, (newVal) => {
  }, { immediate: true, deep: true })

  function recursionMultiSort(
    sortByArr: string[],
    sortDescArr: boolean[],
    itemsToSort: TableItem[],
    index: number,
  ): TableItem[] {
    const sortByKey = sortByArr[index]!
    const sortDesc = sortDescArr[index]!
    const sorted = (index === 0
      ? itemsToSort
      : recursionMultiSort(sortByArr, sortDescArr, itemsToSort, index - 1)
    ).sort((a, b) => {
      for (let i = 0; i < index; i += 1) {
        if (getItemValue(sortByArr[i]!, a) !== getItemValue(sortByArr[i]!, b)) {
          return 0
        }
      }
      const left = getItemValue(sortByKey, a)
      const right = getItemValue(sortByKey, b)
      const leftText = String(left ?? '')
      const rightText = String(right ?? '')
      if (leftText < rightText) return sortDesc ? 1 : -1
      if (leftText > rightText) return sortDesc ? -1 : 1
      return 0
    })
    return sorted
  }

  const totalItems = computed(() => {
    if (isServerSideMode.value) return items.value
    if (clientSortOptions.value === null) return itemsFiltering.value
    const { sortBy, sortDesc } = clientSortOptions.value
    const itemsFilteringSorted = [...itemsFiltering.value]
    if (multiSort.value && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (sortBy.length === 0) return itemsFilteringSorted
      return recursionMultiSort(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1)
    }
    return itemsFilteringSorted.sort((a, b) => {
      const left = String(getItemValue(sortBy as string, a) ?? '')
      const right = String(getItemValue(sortBy as string, b) ?? '')
      if (left < right) return sortDesc ? 1 : -1
      if (left > right) return sortDesc ? -1 : 1
      return 0
    })
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
    const isAlreadyChecked = item.checkbox as boolean | undefined
    const nextItem = { ...item }
    delete nextItem.checkbox
    delete nextItem.index
    if (!isAlreadyChecked) {
      selectItemsComputed.value = [nextItem, ...selectItemsComputed.value]
      emits('selectRow', nextItem)
    } else {
      selectItemsComputed.value = selectItemsComputed.value.filter(
        (selected) => JSON.stringify(selected) !== JSON.stringify(nextItem),
      )
      emits('deselectRow', nextItem)
    }
  }

  return {
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  }
}
