import type {
  TableColumnDefinition,
  TableColumnFilter,
  TableHeader,
  TableSortType,
} from '../types'

export const DEFAULT_COLUMN_MIN_WIDTH = 80

export function normalizeAlign(
  align?: TableColumnDefinition['align'] | 'left' | 'right',
): 'start' | 'center' | 'end' | undefined {
  if (!align) return undefined
  if (align === 'start' || align === 'left') return 'start'
  if (align === 'end' || align === 'right') return 'end'
  if (align === 'center') return 'center'
  return undefined
}

export function normalizeFixed(fixed?: boolean | 'left' | 'right'): 'left' | 'right' | undefined {
  if (fixed === true || fixed === 'left') return 'left'
  if (fixed === 'right') return 'right'
  return undefined
}

export function columnFilterLabel(filter: TableColumnFilter): string {
  return String(filter.label ?? filter.value ?? '')
}

export function normalizeColumnDefinition(column: TableColumnDefinition): TableHeader {
  const children = column.children?.length
    ? column.children.map(normalizeColumnDefinition)
    : undefined
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
    resizable: column.resizable,
    filterable: column.filterable,
    filters: column.filters,
    editable: column.editable,
    children,
  }
}

/** Flatten nested column definitions to leaf columns (body / colgroup). */
export function flattenColumnDefinitions(
  columns: TableColumnDefinition[],
): TableColumnDefinition[] {
  const leaves: TableColumnDefinition[] = []
  for (const column of columns) {
    if (column.children?.length) {
      leaves.push(...flattenColumnDefinitions(column.children))
    } else {
      leaves.push(column)
    }
  }
  return leaves
}

export function flattenHeaders(headers: TableHeader[]): TableHeader[] {
  const leaves: TableHeader[] = []
  for (const header of headers) {
    if (header.children?.length) {
      leaves.push(...flattenHeaders(header.children))
    } else {
      leaves.push(header)
    }
  }
  return leaves
}

function countLeafColumns(header: TableHeader): number {
  if (!header.children?.length) return 1
  return header.children.reduce((sum, child) => sum + countLeafColumns(child), 0)
}

function headerDepth(headers: TableHeader[]): number {
  let max = 1
  for (const header of headers) {
    if (header.children?.length) {
      max = Math.max(max, 1 + headerDepth(header.children))
    }
  }
  return max
}

/** Filter a column tree by hidden leaf keys; drop empty groups. */
export function filterColumnTree(
  columns: TableColumnDefinition[],
  hiddenColumns: string[] | null | undefined,
): TableColumnDefinition[] {
  if (!hiddenColumns?.length) return columns
  const hidden = new Set(hiddenColumns)
  const walk = (list: TableColumnDefinition[]): TableColumnDefinition[] => {
    const next: TableColumnDefinition[] = []
    for (const column of list) {
      if (column.children?.length) {
        const children = walk(column.children)
        if (children.length) next.push({ ...column, children })
      } else if (!hidden.has(column.key)) {
        next.push(column)
      }
    }
    return next
  }
  return walk(columns)
}

/**
 * Reorder leaf columns by `columnOrder` keys.
 * Nested groups are flattened into a single-level list when order is applied
 * (order is a leaf-key list).
 */
export function applyColumnOrder(
  columns: TableColumnDefinition[],
  columnOrder: string[] | null | undefined,
): TableColumnDefinition[] {
  if (!columnOrder?.length) return columns
  const leaves = flattenColumnDefinitions(columns)
  const byKey = new Map(leaves.map((column) => [column.key, column]))
  const ordered: TableColumnDefinition[] = []
  const seen = new Set<string>()
  for (const key of columnOrder) {
    const column = byKey.get(key)
    if (column && !seen.has(key)) {
      ordered.push(column)
      seen.add(key)
    }
  }
  for (const column of leaves) {
    if (!seen.has(column.key)) ordered.push(column)
  }
  return ordered
}

export function applyColumnWidths(
  columns: TableColumnDefinition[],
  columnWidths: Record<string, number> | null | undefined,
): TableColumnDefinition[] {
  if (!columnWidths) return columns
  const walk = (list: TableColumnDefinition[]): TableColumnDefinition[] =>
    list.map((column) => {
      if (column.children?.length) {
        return { ...column, children: walk(column.children) }
      }
      const width = columnWidths[column.key]
      return width != null ? { ...column, width } : column
    })
  return walk(columns)
}

/** Resolve visible leaf column definitions (hidden → order → widths). */
export function resolveVisibleColumns(
  columns: TableColumnDefinition[],
  options: {
    hiddenColumns?: string[] | null
    columnOrder?: string[] | null
    columnWidths?: Record<string, number> | null
  } = {},
): TableColumnDefinition[] {
  const filtered = filterColumnTree(columns, options.hiddenColumns)
  const ordered = applyColumnOrder(filtered, options.columnOrder)
  return applyColumnWidths(ordered, options.columnWidths)
}

export function normalizeColumnList(columns: TableColumnDefinition[]): TableHeader[] {
  return flattenColumnDefinitions(columns).map(normalizeColumnDefinition)
}

/** Build multi-row header cells with colspan/rowspan for nested columns. */
export function buildHeaderRows(columns: TableColumnDefinition[]): TableHeader[][] {
  const tree = columns.map(normalizeColumnDefinition)
  if (!tree.some((header) => header.children?.length)) {
    return [tree]
  }

  const depth = headerDepth(tree)
  const rows: TableHeader[][] = Array.from({ length: depth }, () => [])

  const walk = (headers: TableHeader[], level: number) => {
    for (const header of headers) {
      const leafCount = countLeafColumns(header)
      if (header.children?.length) {
        rows[level]!.push({
          ...header,
          colspan: leafCount,
          rowspan: 1,
          sortable: false,
          filterable: false,
          resizable: false,
        })
        walk(header.children, level + 1)
      } else {
        rows[level]!.push({
          ...header,
          colspan: 1,
          rowspan: depth - level,
        })
      }
    }
  }

  walk(tree, 0)
  return rows
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
