import type { ComputedRef, Ref } from 'vue'
import type { TableClickEventType, TableItem } from '../types'
import type { EmitsEventName } from './internal'

export function useClickRow(
  clickEventType: Ref<TableClickEventType>,
  isMultipleSelectable: ComputedRef<boolean>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const clickRow = (
    item: TableItem,
    index: number,
    clickType: TableClickEventType,
    event: Event,
  ) => {
    if (clickEventType.value !== clickType) return
    const row = { ...item } as TableItem
    if (isMultipleSelectable.value) {
      delete row.checkbox
    }
    if (showIndex.value) {
      delete row.index
    }
    emits('row-click', { row, index }, event)
  }

  return { clickRow }
}
