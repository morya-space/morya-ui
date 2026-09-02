import { describe, expect, it } from 'vitest'
import { normalizeColumnDefinition, normalizeColumnList, normalizeFixed } from './normalize'

describe('Table normalize', () => {
  it('maps columns to internal headers', () => {
    expect(normalizeColumnDefinition({ key: 'name', label: '姓名', sortable: true })).toEqual({
      text: '姓名',
      value: 'name',
      sortable: true,
      fixed: false,
      width: undefined,
      minWidth: 80,
      align: undefined,
      render: undefined,
      showOverflowTooltip: undefined,
    })
  })

  it('normalizes column lists', () => {
    expect(normalizeColumnList([{ key: 'name', label: 'Name', width: 120 }])).toEqual([
      {
        text: 'Name',
        value: 'name',
        width: 120,
        minWidth: undefined,
        fixed: false,
        sortable: undefined,
        align: undefined,
        render: undefined,
        showOverflowTooltip: undefined,
      },
    ])
  })

  it('normalizes fixed left columns', () => {
    expect(normalizeFixed('left')).toBe(true)
    expect(normalizeFixed('right')).toBe(false)
  })
})
