import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import type { EmitsEventName } from './internal'
import { computed, ref } from 'vue'
import { toggleExpandedRowKeys } from '../tableQuery'
import { resolveRowKey } from '../utils'

export function useExpandableRow(
  expandedRowKeys: Ref<Array<string | number> | undefined>,
  rowKey: Ref<string>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const internalExpandedKeys = ref<Array<string | number>>([])
  const expandedKeys = computed(() => expandedRowKeys.value ?? internalExpandedKeys.value)

  const keyOf = (item: TableItem, pageIndex: number) =>
    resolveRowKey(item, prevPageEndIndex.value + pageIndex, rowKey.value)

  const isRowExpanded = (item: TableItem, pageIndex: number) =>
    expandedKeys.value.includes(keyOf(item, pageIndex))

  const toggleExpandRow = (item: TableItem, pageIndex: number, event: Event) => {
    event.stopPropagation()
    const { next, expanded } = toggleExpandedRowKeys(expandedKeys.value, keyOf(item, pageIndex))
    internalExpandedKeys.value = next
    emits('update:expandedRowKeys', next)
    emits('expand', { row: item, expanded })
  }

  return {
    expandedKeys,
    isRowExpanded,
    toggleExpandRow,
  }
}
