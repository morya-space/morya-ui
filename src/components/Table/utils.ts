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
