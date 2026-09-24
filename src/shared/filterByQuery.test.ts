import { describe, expect, it } from 'vitest'
import {
  filterItemsByLabel,
  filterItemsByLabelOrValue,
  normalizeFilterQuery,
  textMatchesQuery,
} from './filterByQuery'

describe('filterByQuery', () => {
  it('normalizes and matches text', () => {
    expect(normalizeFilterQuery('  Foo ')).toBe('foo')
    expect(textMatchesQuery('FooBar', 'bar')).toBe(true)
    expect(textMatchesQuery('FooBar', '')).toBe(true)
  })

  it('filters by label and label/value', () => {
    const items = [
      { label: 'Apple', value: 'a1' },
      { label: 'Banana', value: 'b2' },
    ]
    expect(filterItemsByLabel(items, 'an').map((item) => item.value)).toEqual(['b2'])
    expect(filterItemsByLabelOrValue(items, 'a1').map((item) => item.value)).toEqual(['a1'])
    expect(filterItemsByLabel(items, '  ')).toBe(items)
  })
})
