import type { TableItem } from '../types'
import type { EmitsEventName } from './internal'
import { stripSyntheticFields } from '../core/utils'

export function useClickRow(
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const emitRow = (
    eventName: 'row-click' | 'row-dblclick',
    item: TableItem,
    index: number,
    nativeEvent: Event,
  ) => {
    emits(eventName, { row: stripSyntheticFields(item), index }, nativeEvent)
  }

  const clickRow = (item: TableItem, index: number, event: Event) => {
    emitRow('row-click', item, index, event)
  }

  const dblClickRow = (item: TableItem, index: number, event: Event) => {
    emitRow('row-dblclick', item, index, event)
  }

  return { clickRow, dblClickRow }
}
