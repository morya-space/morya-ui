import type { ComputedRef, Ref } from 'vue'
import type { TableClickEventType, TableItem } from '../types'
import type { EmitsEventName } from './internal'

export function useClickRow(
  clickEventType: Ref<TableClickEventType>,
  isMultipleSelectable: ComputedRef<boolean>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const clickRow = (item: TableItem, clickType: TableClickEventType, event: Event) => {
    if (clickEventType.value !== clickType) return
    const clickRowArgument = { ...item } as TableItem & {
      isSelected?: boolean
      indexInCurrentPage?: number
    }
    if (isMultipleSelectable.value) {
      clickRowArgument.isSelected = item.checkbox as boolean | undefined
      delete clickRowArgument.checkbox
    }
    if (showIndex.value) {
      clickRowArgument.indexInCurrentPage = item.index as number | undefined
      delete clickRowArgument.index
    }
    emits('clickRow', clickRowArgument, event)
  }

  return { clickRow }
}
