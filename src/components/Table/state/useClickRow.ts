import type { Ref } from 'vue'
import type { TableItem } from '../types'
import type { EmitsEventName } from './internal'
import { SYNTHETIC } from '../columns/keys'

function stripSynthetic(item: TableItem): TableItem {
  const row = { ...item }
  delete row.checkbox
  delete row.index
  delete row[SYNTHETIC.checkbox]
  delete row[SYNTHETIC.index]
  return row
}

export function useClickRow(
  isMultipleSelectable: Ref<boolean> | { value: boolean },
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const emitRow = (
    eventName: 'row-click' | 'row-dblclick',
    item: TableItem,
    index: number,
    nativeEvent: Event,
  ) => {
    emits(eventName, { row: stripSynthetic(item), index }, nativeEvent)
  }

  const clickRow = (item: TableItem, index: number, event: Event) => {
    emitRow('row-click', item, index, event)
  }

  const dblClickRow = (item: TableItem, index: number, event: Event) => {
    emitRow('row-dblclick', item, index, event)
  }

  return { clickRow, dblClickRow }
}
