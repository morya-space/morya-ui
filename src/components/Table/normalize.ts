import type { TableColumnDefinition, TableHeader, TableSortType } from './types'

export const DEFAULT_COLUMN_MIN_WIDTH = 80

export function normalizeAlign(
  align?: TableColumnDefinition['align'],
): 'start' | 'center' | 'end' | undefined {
  if (!align) return undefined
  if (align === 'left' || align === 'start') return 'start'
  if (align === 'right' || align === 'end') return 'end'
  return 'center'
}

export function normalizeFixed(fixed?: boolean | 'left' | 'right'): boolean {
  return fixed === true || fixed === 'left'
}

export function normalizeColumnDefinition(column: TableColumnDefinition): TableHeader {
  return {
    text: column.label,
    value: column.key,
    sortable: column.sortable,
    fixed: normalizeFixed(column.fixed),
    width: column.width,
    minWidth: column.minWidth ?? (column.width ? undefined : DEFAULT_COLUMN_MIN_WIDTH),
    align: normalizeAlign(column.align),
    render: column.render,
    showOverflowTooltip: column.showOverflowTooltip,
  }
}

export function normalizeColumnList(columns: TableColumnDefinition[]): TableHeader[] {
  return columns.map(normalizeColumnDefinition)
}

export function resolveSortOrder(
  sortOrder?: TableSortType | TableSortType[] | null,
): TableSortType | TableSortType[] {
  return sortOrder ?? 'asc'
}

export function resolveSortField(
  sortField?: string | string[] | null,
): string | string[] {
  return sortField ?? ''
}
