import { describe, expect, it } from 'vitest'
import {
  compareTableValues,
  filterTableItems,
  matchesFilterCriteria,
  searchTableItems,
  sortTableItems,
  toggleExpandedRowKeys,
  toggleSelectedItems,
} from './tableQuery'

const rows = [
  { id: 1, name: 'Ann', age: 30, role: 'admin' },
  { id: 2, name: 'Bob', age: 22, role: 'user' },
  { id: 3, name: 'Cara', age: 27, role: 'user' },
]

describe('tableQuery', () => {
  it('compares numeric and lexical values', () => {
    expect(compareTableValues(1, 2, false)).toBeLessThan(0)
    expect(compareTableValues(1, 2, true)).toBeGreaterThan(0)
    expect(compareTableValues('b', 'a', false)).toBeGreaterThan(0)
  })

  it('matches filter criteria and filter options', () => {
    expect(matchesFilterCriteria('admin', 'admin')).toBe(true)
    expect(matchesFilterCriteria('admin', ['admin', 'user'])).toBe(true)
    expect(matchesFilterCriteria(5, (value: unknown) => Number(value) > 3)).toBe(true)
    expect(
      filterTableItems(rows, { role: 'user' }, [{ field: 'age', comparison: '>', criteria: 25 }]),
    ).toEqual([{ id: 3, name: 'Cara', age: 27, role: 'user' }])
  })

  it('searches and sorts rows', () => {
    expect(searchTableItems(rows, 'bo', 'name').map((row) => row.id)).toEqual([2])
    expect(sortTableItems(rows, 'age', true).map((row) => row.id)).toEqual([1, 3, 2])
    expect(
      sortTableItems(rows, ['role', 'age'], [false, true], true).map((row) => row.id),
    ).toEqual([1, 3, 2])
  })

  it('toggles expanded keys and selection lists', () => {
    expect(toggleExpandedRowKeys([1], 2)).toEqual({ next: [1, 2], expanded: true })
    expect(toggleExpandedRowKeys([1, 2], 1)).toEqual({ next: [2], expanded: false })

    const selected = toggleSelectedItems([], { id: 1, name: 'Ann', checkbox: false })
    expect(selected.selected).toBe(true)
    expect(selected.row).toEqual({ id: 1, name: 'Ann' })
    expect(selected.next).toEqual([{ id: 1, name: 'Ann' }])
    const removed = toggleSelectedItems(selected.next, { id: 1, name: 'Ann', checkbox: true })
    expect(removed.selected).toBe(false)
    expect(removed.next).toEqual([])
  })
})
