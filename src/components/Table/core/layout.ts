import type { ComputedRef, Ref } from 'vue'
import type { HeaderForRender } from '../state/internal'
import type {
  TableBodyItemClassName,
  TableHeader,
  TableItem,
  TableSpanMethod,
  TableTextDirection,
} from '../types'
import { computed } from 'vue'
import { isSyntheticColumn } from '../columns/keys'

export interface BodyCellDescriptor {
  column: string
  columnIndex: number
  rowspan: number
  colspan: number
  visible: boolean
}

export function resolveCellAlignClass(
  column: string,
  columnAlignMap: Map<string, 'start' | 'center' | 'end'>,
  bodyTextDirection: TableTextDirection,
) {
  const columnAlign = columnAlignMap.get(column)
  const direction = columnAlign ?? bodyTextDirection
  if (direction === 'center') return 'm-table__cell--center'
  if (direction === 'right' || direction === 'end') return 'm-table__cell--right'
  return undefined
}

export function resolveSpanResult(
  item: TableItem,
  column: string,
  rowIndex: number,
  columnIndex: number,
  spanMethod: TableSpanMethod | null | undefined,
  headersForRender: HeaderForRender[],
): { rowspan: number; colspan: number } {
  if (!spanMethod) return { rowspan: 1, colspan: 1 }
  const header = headersForRender.find((entry) => entry.value === column) as TableHeader | undefined
  const result = spanMethod({
    row: item,
    column: header ?? { text: column, value: column },
    rowIndex,
    columnIndex,
  })
  if (Array.isArray(result)) {
    return { rowspan: result[0] ?? 1, colspan: result[1] ?? 1 }
  }
  if (result && typeof result === 'object') {
    return {
      rowspan: result.rowspan ?? 1,
      colspan: result.colspan ?? 1,
    }
  }
  return { rowspan: 1, colspan: 1 }
}

/** Build per-cell span descriptors once per row (avoids repeated spanMethod calls). */
export function buildRowCells(
  item: TableItem,
  rowIndex: number,
  headerColumns: string[],
  spanMethod: TableSpanMethod | null | undefined,
  headersForRender: HeaderForRender[],
): BodyCellDescriptor[] {
  if (!spanMethod) {
    return headerColumns.map((column, columnIndex) => ({
      column,
      columnIndex,
      rowspan: 1,
      colspan: 1,
      visible: true,
    }))
  }
  return headerColumns.map((column, columnIndex) => {
    const span = resolveSpanResult(item, column, rowIndex, columnIndex, spanMethod, headersForRender)
    return {
      column,
      columnIndex,
      rowspan: span.rowspan,
      colspan: span.colspan,
      visible: span.rowspan > 0 && span.colspan > 0,
    }
  })
}

export function useDisplayHeaderRows(
  headerRows: ComputedRef<TableHeader[][]>,
  headersForRender: ComputedRef<HeaderForRender[]>,
) {
  function enrichHeaderRow(row: TableHeader[]): HeaderForRender[] {
    return row.map((header) => {
      const isGroup = (header.colspan ?? 1) > 1
      const rendered = headersForRender.value.find((item) => item.value === header.value)
      if (!rendered || isGroup) {
        return {
          text: header.text,
          value: header.value,
          width: header.width,
          minWidth: header.minWidth,
          fixed: header.fixed,
          colspan: header.colspan,
          rowspan: header.rowspan,
          sortable: false,
          filterable: false,
          resizable: false,
        }
      }
      return {
        ...rendered,
        colspan: header.colspan,
        rowspan: header.rowspan,
        width: rendered.width ?? header.width,
        minWidth: rendered.minWidth ?? header.minWidth,
      }
    })
  }

  return computed((): HeaderForRender[][] => {
    if (headerRows.value.length <= 1) {
      return [headersForRender.value]
    }
    const depth = headerRows.value.length
    const [first, ...rest] = headerRows.value
    const synthetic = headersForRender.value
      .filter((header) => isSyntheticColumn(header.value))
      .map((header) => ({
        ...header,
        rowspan: depth,
        colspan: 1,
      }))
    return [[...synthetic, ...enrichHeaderRow(first ?? [])], ...rest.map(enrichHeaderRow)]
  })
}

export function bodyItemClassNameOf(
  bodyItemClassName: TableBodyItemClassName,
  column: string,
  rowNumber: number,
) {
  return typeof bodyItemClassName === 'string'
    ? bodyItemClassName
    : bodyItemClassName(column, rowNumber)
}

export function getColStyleForHeader(
  header: HeaderForRender,
  sourceHeaders: TableHeader[],
  fixedHeaderCount: number,
  useFixedLayout: boolean,
) {
  const source = sourceHeaders.find((item) => item.value === header.value)
  const width = header.width ?? source?.width ?? (fixedHeaderCount ? 100 : null)
  if (width && useFixedLayout) return `width: ${width}px; min-width: ${width}px;`
  const minWidth = header.minWidth ?? source?.minWidth
  if (minWidth && useFixedLayout) return `min-width: ${minWidth}px;`
  return undefined
}

export function getFixedDistanceStyle(
  column: string,
  type: 'td' | 'th',
  fixedColumnsInfos: Array<{ value: string; distance: number; fixed?: boolean | 'left' | 'right' }>,
  hasFixedHeaders: boolean,
) {
  if (!hasFixedHeaders) return undefined
  const columnInfo = fixedColumnsInfos.find((info) => info.value === column)
  if (columnInfo) {
    const side = columnInfo.fixed === 'right' ? 'right' : 'left'
    return `${side}: ${columnInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`
  }
  return undefined
}
