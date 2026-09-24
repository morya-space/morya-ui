import { describe, expect, it } from 'vitest'
import {
  buildLookupOptions,
  buildMenuEntries,
  buildMenuRows,
  canCreateFromQuery,
  flattenOptions,
  isOptionGroup,
  normalizeSelectedValues,
  sliceVisibleTags,
  toggleSelectedValue,
} from './selectOptions'
import type { SelectOptionEntry } from './types'

const options: SelectOptionEntry[] = [
  {
    label: 'Fruit',
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  { label: 'Carrot', value: 'carrot' },
]

describe('selectOptions', () => {
  it('detects groups and flattens options', () => {
    expect(isOptionGroup(options[0]!)).toBe(true)
    expect(isOptionGroup(options[1]!)).toBe(false)
    expect(flattenOptions(options).map((option) => option.value)).toEqual([
      'apple',
      'banana',
      'carrot',
    ])
  })

  it('normalizes single and multiple model values', () => {
    expect(normalizeSelectedValues('apple', false)).toEqual(['apple'])
    expect(normalizeSelectedValues(['apple', 'banana'], true)).toEqual(['apple', 'banana'])
    expect(normalizeSelectedValues(undefined, true)).toEqual([])
    expect(normalizeSelectedValues(['apple'], false)).toEqual([])
  })

  it('builds lookup extras for created and orphan selected values', () => {
    const lookup = buildLookupOptions(options, [{ label: 'Durian', value: 'durian' }], ['ghost'])
    expect(lookup.map((option) => option.value)).toEqual([
      'apple',
      'banana',
      'carrot',
      'durian',
      'ghost',
    ])
  })

  it('filters local menu entries while keeping matching groups', () => {
    const entries = buildMenuEntries(options, [], [], 'an', false)
    expect(entries).toEqual([
      {
        label: 'Fruit',
        items: [{ label: 'Banana', value: 'banana' }],
      },
    ])
    expect(buildMenuEntries(options, [], [], 'an', true)).toEqual(options)
  })

  it('builds create rows and toggles multiple selection', () => {
    expect(canCreateFromQuery('Mango', flattenOptions(options), { tag: true, filter: true })).toBe(
      true,
    )
    expect(canCreateFromQuery('Apple', flattenOptions(options), { tag: true, filter: true })).toBe(
      false,
    )
    const rows = buildMenuRows(options, 'Mango')
    expect(rows[0]).toMatchObject({ type: 'option', option: { created: true, value: 'Mango' } })
    expect(toggleSelectedValue(['apple'], 'banana')).toEqual(['apple', 'banana'])
    expect(toggleSelectedValue(['apple', 'banana'], 'apple')).toEqual(['banana'])
  })

  it('slices visible tags for maxTagCount', () => {
    expect(sliceVisibleTags(['a', 'b', 'c'], 2)).toEqual({
      visible: ['a', 'b'],
      hiddenCount: 1,
    })
    expect(sliceVisibleTags(['a', 'b'], 5)).toEqual({ visible: ['a', 'b'], hiddenCount: 0 })
  })
})
