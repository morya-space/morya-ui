import type { TableItem } from './types'

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

/**
 * Row identity comparison. Prefers `rowKey` values; falls back to deep JSON
 * comparison when either row lacks a usable key.
 */
export function sameTableItem(a: TableItem, b: TableItem, rowKey = 'id'): boolean {
  const aKey = a[rowKey]
  const bKey = b[rowKey]
  const aUsable = typeof aKey === 'string' || typeof aKey === 'number'
  const bUsable = typeof bKey === 'string' || typeof bKey === 'number'
  if (aUsable && bUsable) return aKey === bKey
  return JSON.stringify(a) === JSON.stringify(b)
}
