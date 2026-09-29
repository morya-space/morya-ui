import { describe, expect, it } from 'vitest'
import {
  applyColumnOrder,
  buildHeaderRows,
  filterColumnTree,
  normalizeAlign,
  normalizeColumnDefinition,
  normalizeColumnList,
  normalizeFixed,
  resolveVisibleColumns,
} from './normalize'

describe('table normalize', () => {
  it('maps columns to internal headers', () => {
    expect(normalizeColumnDefinition({ key: 'name', label: '姓名', sortable: true })).toEqual({
      text: '姓名',
      value: 'name',
      sortable: true,
      fixed: undefined,
      width: undefined,
      minWidth: 80,
      align: undefined,
      render: undefined,
      showOverflowTooltip: undefined,
      resizable: undefined,
      filterable: undefined,
      filters: undefined,
      children: undefined,
    })
  })

  it('normalizes column lists', () => {
    expect(normalizeColumnList([{ key: 'name', label: 'Name', width: 120 }])).toEqual([
      {
        text: 'Name',
        value: 'name',
        width: 120,
        minWidth: undefined,
        fixed: undefined,
        sortable: undefined,
        align: undefined,
        render: undefined,
        showOverflowTooltip: undefined,
        resizable: undefined,
        filterable: undefined,
        filters: undefined,
        children: undefined,
      },
    ])
  })

  it('normalizes fixed directions', () => {
    expect(normalizeFixed('left')).toBe('left')
    expect(normalizeFixed(true)).toBe('left')
    expect(normalizeFixed('right')).toBe('right')
    expect(normalizeFixed(false)).toBeUndefined()
    expect(normalizeFixed(undefined)).toBeUndefined()
  })

  it('normalizes align left/right to start/end', () => {
    expect(normalizeAlign('left')).toBe('start')
    expect(normalizeAlign('right')).toBe('end')
    expect(normalizeAlign('start')).toBe('start')
    expect(normalizeAlign('end')).toBe('end')
    expect(normalizeAlign('center')).toBe('center')
    expect(normalizeAlign(undefined)).toBeUndefined()
  })

  it('flattens nested columns and builds multi-header rows', () => {
    const columns = [
      {
        key: 'info',
        label: 'Info',
        children: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
        ],
      },
      { key: 'score', label: 'Score' },
    ]
    expect(normalizeColumnList(columns).map((column) => column.value)).toEqual([
      'name',
      'role',
      'score',
    ])
    const rows = buildHeaderRows(columns)
    expect(rows).toHaveLength(2)
    expect(rows[0]!.map((cell) => [cell.text, cell.colspan, cell.rowspan])).toEqual([
      ['Info', 2, 1],
      ['Score', 1, 2],
    ])
    expect(rows[1]!.map((cell) => cell.value)).toEqual(['name', 'role'])
  })

  it('hides columns and reorders leaves', () => {
    const columns = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C' },
    ]
    expect(filterColumnTree(columns, ['b']).map((column) => column.key)).toEqual(['a', 'c'])
    expect(applyColumnOrder(columns, ['c', 'a']).map((column) => column.key)).toEqual([
      'c',
      'a',
      'b',
    ])
    expect(
      resolveVisibleColumns(columns, {
        hiddenColumns: ['b'],
        columnOrder: ['c', 'a'],
        columnWidths: { c: 140 },
      }).map((column) => ({ key: column.key, width: column.width })),
    ).toEqual([
      { key: 'c', width: 140 },
      { key: 'a', width: undefined },
    ])
  })
})
