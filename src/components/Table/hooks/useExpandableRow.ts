import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import type { EmitsEventName } from './internal'
import { ref } from 'vue'

export function useExpandableRow(
  items: Ref<TableItem[]>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const expandingItemIndexList = ref<number[]>([])

  const updateExpandingItemIndexList = (
    expandingItemIndex: number,
    expandingItem: TableItem,
    event: Event,
  ) => {
    event.stopPropagation()
    const index = expandingItemIndexList.value.indexOf(expandingItemIndex)
    if (index !== -1) {
      expandingItemIndexList.value.splice(index, 1)
      emits('expand', { row: expandingItem, expanded: false })
    } else {
      const currentPageExpandIndex = items.value.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(expandingItem),
      )
      emits('expand', { row: expandingItem, expanded: true })
      expandingItemIndexList.value.push(prevPageEndIndex.value + currentPageExpandIndex)
    }
  }

  const clearExpandingItemIndexList = () => {
    expandingItemIndexList.value = []
  }

  return {
    expandingItemIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList,
  }
}
