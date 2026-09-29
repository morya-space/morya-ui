import type { TableItem } from '../types'
import { SYNTHETIC } from '../columns/keys'

export function getItemValue(column: string, item: TableItem): unknown {
  if (column.includes('.')) {
    const keys = column.split('.')
    let content: unknown = item
    for (const key of keys) {
      if (content && typeof content === 'object') {
        content = (content as Record<string, unknown>)[key]
      } else {
        return ''
      }
    }
    return content ?? ''
  }
  return item[column] ?? ''
}

export function generateColumnContent(column: string, item: TableItem): string {
  const content = getItemValue(column, item)
  return Array.isArray(content) ? content.join(',') : String(content ?? '')
}

export function resolveRowKey(
  item: TableItem,
  index: number,
  rowKey = 'id',
): string | number {
  const value = item[rowKey]
  if (typeof value === 'string' || typeof value === 'number') return value
  return index
}

/** Remove transient table meta fields before emitting row payloads. */
export function stripSyntheticFields(item: TableItem): TableItem {
  const next = { ...item }
  delete next[SYNTHETIC.index]
  delete next[SYNTHETIC.checkbox]
  delete next.index
  delete next.checkbox
  return next
}

/**
 * Row identity comparison. Prefers `rowKey` values; falls back to reference,
 * then deep JSON when either row lacks a usable key.
 */
export function sameTableItem(a: TableItem, b: TableItem, rowKey = 'id'): boolean {
  if (a === b) return true
  const aKey = a[rowKey]
  const bKey = b[rowKey]
  const aUsable = typeof aKey === 'string' || typeof aKey === 'number'
  const bUsable = typeof bKey === 'string' || typeof bKey === 'number'
  if (aUsable && bUsable) return aKey === bKey
  if (aUsable || bUsable) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Collect usable rowKey values into a Set for O(1) selection lookups. */
export function buildSelectedKeySet(
  selected: TableItem[],
  rowKey = 'id',
): Set<string | number> {
  const set = new Set<string | number>()
  for (const item of selected) {
    const value = item[rowKey]
    if (typeof value === 'string' || typeof value === 'number') set.add(value)
  }
  return set
}

export function isItemInSelection(
  item: TableItem,
  selected: TableItem[],
  selectedKeys: Set<string | number>,
  rowKey = 'id',
): boolean {
  const value = item[rowKey]
  if (typeof value === 'string' || typeof value === 'number') {
    return selectedKeys.has(value)
  }
  return selected.some((entry) => sameTableItem(entry, item, rowKey))
}
