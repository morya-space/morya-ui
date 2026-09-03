import { describe, expect, it } from 'vitest'
import { normalizeColumnDefinition, normalizeColumnList, normalizeFixed } from './normalize'

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
})
