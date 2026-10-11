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

/**
 * Remove transient table meta fields before emitting row payloads.
 * Only strips `__m_`-prefixed synthetic columns — never user data fields.
 */
export function stripSyntheticFields(item: TableItem): TableItem {
  const next = { ...item }
  delete next[SYNTHETIC.index]
  delete next[SYNTHETIC.checkbox]
  delete next[SYNTHETIC.radio]
  delete next[SYNTHETIC.expand]
  return next
}

let sameTableItemFallbackWarned = false

/**
 * Row identity comparison. Prefers `rowKey` values; falls back to reference equality.
 *
 * Rows without a usable `rowKey` value cannot be reliably matched — a missing key
 * means selection/expansion/current-row state may break silently. In dev builds we
 * warn once and fall back to reference equality (the safest deterministic check).
 * JSON.stringify comparison was removed: it was O(n·size), key-order-sensitive,
 * and silently dropped function/undefined fields, causing flaky identity matches.
 */
export function sameTableItem(a: TableItem, b: TableItem, rowKey = 'id'): boolean {
  if (a === b) return true
  const aKey = a[rowKey]
  const bKey = b[rowKey]
  const aUsable = typeof aKey === 'string' || typeof aKey === 'number'
  const bUsable = typeof bKey === 'string' || typeof bKey === 'number'
  if (aUsable && bUsable) return aKey === bKey
  if (aUsable || bUsable) return false
  if (import.meta.env.DEV && !sameTableItemFallbackWarned) {
    sameTableItemFallbackWarned = true
    console.warn(
      `[MTable] Rows are missing a usable \`rowKey\` field (expected string|number at "${rowKey}"). `
      + 'Selection, expansion, and current-row state may not persist correctly. '
      + 'Set `rowKey` to a unique field on your row data.',
    )
  }
  return false
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
