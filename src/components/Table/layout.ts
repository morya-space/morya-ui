import type { TableColumn } from './types'

export const TABLE_DEFAULT_MIN_WIDTH = 80
export const TABLE_SELECTION_WIDTH = 48
export const TABLE_EXPAND_WIDTH = 40

export interface LayoutColumn {
  key: string
  /** Fixed width when set (not flex). */
  width?: number
  minWidth: number
  realWidth: number
  fixed?: 'left' | 'right'
  isSelection?: boolean
  isExpand?: boolean
}

export function parseSize(value?: string | number): number | undefined {
  if (value == null || value === '') return undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** –style column width layout. */
export function computeColumnLayout(
  columns: TableColumn[],
  bodyWidth: number,
  options: { fit?: boolean; selection?: boolean; expand?: boolean } = {},
): { columns: LayoutColumn[]; bodyWidth: number; scrollX: boolean } {
  const fit = options.fit !== false
  const layoutColumns: LayoutColumn[] = []

  if (options.selection) {
    layoutColumns.push({
      key: '__selection__',
      width: TABLE_SELECTION_WIDTH,
      minWidth: TABLE_SELECTION_WIDTH,
      realWidth: TABLE_SELECTION_WIDTH,
      isSelection: true,
      fixed: 'left',
    })
  }

  if (options.expand) {
    layoutColumns.push({
      key: '__expand__',
      width: TABLE_EXPAND_WIDTH,
      minWidth: TABLE_EXPAND_WIDTH,
      realWidth: TABLE_EXPAND_WIDTH,
      isExpand: true,
      fixed: 'left',
    })
  }

  for (const column of columns) {
    const width = parseSize(column.width)
    const minWidth = parseSize(column.minWidth) ?? TABLE_DEFAULT_MIN_WIDTH
    layoutColumns.push({
      key: column.key,
      width,
      minWidth,
      realWidth: width ?? minWidth,
      fixed: column.fixed,
    })
  }

  const flexColumns = layoutColumns.filter((column) => column.width == null && !column.isSelection && !column.isExpand)
  let bodyMinWidth = 0

  if (flexColumns.length > 0 && fit) {
    layoutColumns.forEach((column) => {
      bodyMinWidth += column.width ?? column.minWidth
    })

    if (bodyMinWidth <= bodyWidth) {
      const totalFlexWidth = bodyWidth - bodyMinWidth
      if (flexColumns.length === 1) {
        flexColumns[0]!.realWidth = flexColumns[0]!.minWidth + totalFlexWidth
      } else {
        const allColumnsWidth = flexColumns.reduce((sum, column) => sum + column.minWidth, 0)
        const flexWidthPerPixel = totalFlexWidth / allColumnsWidth
        let noneFirstWidth = 0
        flexColumns.forEach((column, index) => {
          if (index === 0) return
          const flexWidth = Math.floor(column.minWidth * flexWidthPerPixel)
          noneFirstWidth += flexWidth
          column.realWidth = column.minWidth + flexWidth
        })
        flexColumns[0]!.realWidth =
          flexColumns[0]!.minWidth + totalFlexWidth - noneFirstWidth
      }
      return {
        columns: layoutColumns,
        bodyWidth: Math.max(bodyMinWidth, bodyWidth),
        scrollX: false,
      }
    }

    flexColumns.forEach((column) => {
      column.realWidth = column.minWidth
    })
    return {
      columns: layoutColumns,
      bodyWidth: Math.max(bodyMinWidth, bodyWidth),
      scrollX: true,
    }
  }

  layoutColumns.forEach((column) => {
    column.realWidth = column.width ?? column.minWidth
    bodyMinWidth += column.realWidth
  })

  return {
    columns: layoutColumns,
    bodyWidth: bodyMinWidth,
    scrollX: bodyMinWidth > bodyWidth,
  }
}

export function computeFixedOffsets(columns: LayoutColumn[]) {
  const left: Record<string, number> = {}
  const right: Record<string, number> = {}
  let leftAcc = 0
  for (const column of columns) {
    if (column.fixed === 'left') {
      left[column.key] = leftAcc
      leftAcc += column.realWidth
    }
  }
  let rightAcc = 0
  for (let i = columns.length - 1; i >= 0; i -= 1) {
    const column = columns[i]!
    if (column.fixed === 'right') {
      right[column.key] = rightAcc
      rightAcc += column.realWidth
    }
  }
  return { left, right }
}
