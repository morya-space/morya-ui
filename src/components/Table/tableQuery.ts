import type { TableFilterOption, TableItem } from './types'
import { getItemValue, sameTableItem } from './utils'

/** Compare two cell values; numeric when both sides are numbers, lexical otherwise. */
export function compareTableValues(left: unknown, right: unknown, sortDesc: boolean): number {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) return sortDesc ? 1 : -1
    if (left > right) return sortDesc ? -1 : 1
    return 0
  }
  const leftText = String(left ?? '')
  const rightText = String(right ?? '')
  if (leftText < rightText) return sortDesc ? 1 : -1
  if (leftText > rightText) return sortDesc ? -1 : 1
  return 0
}

/** Match a cell value against a simple filters-map criteria. */
export function matchesFilterCriteria(itemValue: unknown, criteria: unknown): boolean {
  if (typeof criteria === 'function') {
    return (criteria as (value: unknown) => boolean)(itemValue)
  }
  if (Array.isArray(criteria)) return criteria.includes(itemValue)
  return itemValue === criteria || String(itemValue ?? '') === String(criteria)
}

/** Match a row against one structured filter option. */
export function matchesFilterOption(item: TableItem, option: TableFilterOption): boolean {
  const { field, comparison, criteria } = option
  const itemValue = getItemValue(String(field), item)
  if (typeof comparison === 'function') {
    return comparison(itemValue, criteria as string)
  }
  switch (comparison) {
    case '=':
      return itemValue === criteria
    case '!=':
      return itemValue !== criteria
    case '>':
      return Number(itemValue) > Number(criteria)
    case '<':
      return Number(itemValue) < Number(criteria)
    case '<=':
      return Number(itemValue) <= Number(criteria)
    case '>=':
      return Number(itemValue) >= Number(criteria)
    case 'between': {
      const nums = criteria as [number, number]
      const num = Number(itemValue)
      return num >= Math.min(...nums) && num <= Math.max(...nums)
    }
    case 'in':
      return (criteria as unknown[]).includes(itemValue)
    default:
      return itemValue === criteria
  }
}

/** Apply `filters` map and optional `filterOptions` list. */
export function filterTableItems(
  items: TableItem[],
  filters?: Record<string, unknown> | null,
  filterOptions?: TableFilterOption[] | null,
): TableItem[] {
  let next = [...items]
  if (filters) {
    for (const [field, criteria] of Object.entries(filters)) {
      if (criteria == null || criteria === '') continue
      next = next.filter((item) => matchesFilterCriteria(getItemValue(field, item), criteria))
    }
  }
  if (filterOptions) {
    for (const option of filterOptions) {
      next = next.filter((item) => matchesFilterOption(item, option))
    }
  }
  return next
}

/** Build the searchable text blob for one row. */
export function buildSearchTarget(
  item: TableItem,
  searchField: string | string[],
): string {
  if (typeof searchField === 'string' && searchField !== '') {
    return String(getItemValue(searchField, item))
  }
  if (Array.isArray(searchField)) {
    return searchField.map((field) => String(getItemValue(field, item))).join('')
  }
  return Object.values(item).join(' ')
}

/** Case-insensitive substring search across configured fields. */
export function searchTableItems(
  items: TableItem[],
  searchValue: string,
  searchField: string | string[] = '',
): TableItem[] {
  if (!searchValue) return items
  const needle = searchValue.toLowerCase()
  return items.filter((item) => buildSearchTarget(item, searchField).toLowerCase().includes(needle))
}

function recursionMultiSort(
  sortByArr: string[],
  sortDescArr: boolean[],
  itemsToSort: TableItem[],
  index: number,
): TableItem[] {
  const sortByKey = sortByArr[index]!
  const sortDesc = sortDescArr[index]!
  const sorted = (index === 0
    ? itemsToSort
    : recursionMultiSort(sortByArr, sortDescArr, itemsToSort, index - 1)
  ).sort((a, b) => {
    for (let i = 0; i < index; i += 1) {
      if (getItemValue(sortByArr[i]!, a) !== getItemValue(sortByArr[i]!, b)) {
        return 0
      }
    }
    return compareTableValues(getItemValue(sortByKey, a), getItemValue(sortByKey, b), sortDesc)
  })
  return sorted
}

/** Client-side single- or multi-column sort. Returns a new array. */
export function sortTableItems(
  items: TableItem[],
  sortBy: string | string[],
  sortDesc: boolean | boolean[],
  multiSort = false,
): TableItem[] {
  const next = [...items]
  if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
    if (sortBy.length === 0) return next
    return recursionMultiSort(sortBy, sortDesc, next, sortBy.length - 1)
  }
  return next.sort((a, b) =>
    compareTableValues(
      getItemValue(sortBy as string, a),
      getItemValue(sortBy as string, b),
      sortDesc as boolean,
    ),
  )
}

/** Toggle one expanded-row key. */
export function toggleExpandedRowKeys(
  keys: Array<string | number>,
  key: string | number,
): { next: Array<string | number>; expanded: boolean } {
  const index = keys.indexOf(key)
  if (index === -1) {
    return { next: [...keys, key], expanded: true }
  }
  return {
    next: keys.filter((existing) => existing !== key),
    expanded: false,
  }
}

/**
 * Compute the next multi-select selection for a row toggle.
 * Strips transient `checkbox` / `index` fields from the toggled row.
 */
export function toggleSelectedItems(
  selected: TableItem[],
  item: TableItem,
  rowKey = 'id',
): { next: TableItem[]; selected: boolean; row: TableItem } {
  const row = { ...item }
  delete row.checkbox
  delete row.index
  const isAlreadyChecked = Boolean(item.checkbox)
  if (!isAlreadyChecked) {
    return { next: [row, ...selected], selected: true, row }
  }
  return {
    next: selected.filter((entry) => !sameTableItem(entry, row, rowKey)),
    selected: false,
    row,
  }
}
