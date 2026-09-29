import { describe, expect, it } from 'vitest'
import {
  buildLookupOptions,
  buildMenuEntries,
  buildMenuRows,
  canCreateFromQuery,
  flattenOptions,
  isOptionGroup,
  matchesMenuFilter,
  normalizeOptions,
  normalizeSelectedValues,
  selectValueOf,
  sliceVisibleTags,
  toggleSelectedValue,
} from './selectOptions'
import type { SelectOptionEntry } from './types'

const options: SelectOptionEntry[] = [
  {
    label: 'Fruit',
    options: [
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
    expect(flattenOptions(options).map(option => option.value)).toEqual([
      'apple',
      'banana',
      'carrot',
    ])
  })

  it('normalizes single and multiple model values', () => {
    expect(normalizeSelectedValues('apple', false)).toEqual(['apple'])
    expect(normalizeSelectedValues(['apple', 'banana'], true)).toEqual(['apple', 'banana'])
    expect(normalizeSelectedValues(undefined, true)).toEqual([])
    // Single select keeps only the first value.
    expect(normalizeSelectedValues(['apple', 'banana'], false)).toEqual(['apple'])
  })

  it('unwraps labelInValue entries', () => {
    expect(normalizeSelectedValues({ value: 'apple', label: 'Apple' }, false)).toEqual(['apple'])
    expect(
      normalizeSelectedValues(
        [{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }],
        true,
      ),
    ).toEqual(['apple', 'banana'])
    expect(selectValueOf({ value: 'apple', label: 'Apple' })).toBe('apple')
    expect(selectValueOf('apple')).toBe('apple')
    expect(selectValueOf(undefined)).toBeUndefined()
  })

  it('builds lookup extras for created and orphan selected values', () => {
    const lookup = buildLookupOptions(options, [{ label: 'Durian', value: 'durian' }], ['ghost'])
    expect(lookup.map(option => option.value)).toEqual([
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
        options: [{ label: 'Banana', value: 'banana' }],
      },
    ])
    expect(buildMenuEntries(options, [], [], 'an', true)).toEqual(options)
  })

  it('builds create rows and toggles multiple selection', () => {
    const flat = flattenOptions(options)

    expect(canCreateFromQuery('Mango', flat, { tags: true, showSearch: true })).toBe(true)
    expect(canCreateFromQuery('Apple', flat, { tags: true, showSearch: true })).toBe(false)
    expect(canCreateFromQuery('Mango', flat, { tags: true, showSearch: false })).toBe(false)
    expect(canCreateFromQuery('Mango', flat, { tags: false, showSearch: true })).toBe(false)

    const rows = buildMenuRows(options, 'Mango')
    expect(rows[0]).toMatchObject({ type: 'option', option: { created: true, value: 'Mango' } })
    expect(rows[1]).toMatchObject({ type: 'group', label: 'Fruit' })
    expect(rows[2]).toMatchObject({ type: 'option', option: { value: 'apple' } })

    expect(toggleSelectedValue(['apple'], 'banana')).toEqual(['apple', 'banana'])
    expect(toggleSelectedValue(['apple', 'banana'], 'apple')).toEqual(['banana'])
  })

  it('slices visible tags for maxTagCount', () => {
    expect(sliceVisibleTags(['a', 'b', 'c'], 2)).toEqual({
      visible: ['a', 'b'],
      omitted: ['c'],
      hiddenCount: 1,
    })
    expect(sliceVisibleTags(['a', 'b'], 5)).toEqual({
      visible: ['a', 'b'],
      omitted: [],
      hiddenCount: 0,
    })
    expect(sliceVisibleTags(['a', 'b'], undefined)).toEqual({
      visible: ['a', 'b'],
      omitted: [],
      hiddenCount: 0,
    })
  })
})

describe('normalizeOptions / fieldNames', () => {
  it('keeps the default key shape', () => {
    expect(normalizeOptions([{ label: 'Apple', value: 'apple' }])).toEqual([
      { label: 'Apple', value: 'apple' },
    ])
  })

  it('remaps renamed keys, keeps extra keys and maps the disabled flag', () => {
    const entries = normalizeOptions(
      [
        {
          title: 'Fruit',
          children: [{ title: 'Apple', id: 'apple', archived: true }],
        },
      ],
      { label: 'title', value: 'id', disabled: 'archived', options: 'children' },
    )

    expect(entries).toHaveLength(1)
    const group = entries[0] as { label: string, options: Record<string, unknown>[] }

    expect(group.label).toBe('Fruit')
    expect(group.options).toHaveLength(1)
    // Custom keys survive normalization so `optionFilterProp` can target them.
    expect(group.options[0]).toMatchObject({
      label: 'Apple',
      value: 'apple',
      disabled: true,
      title: 'Apple',
      id: 'apple',
      archived: true,
    })
  })

  it('drops entries without a usable value and empty groups', () => {
    expect(normalizeOptions([{ label: 'No value' }, { label: 'Group', options: [] }])).toEqual([])
  })
})

describe('matchesMenuFilter', () => {
  const option = { label: 'Banana', value: 'banana', code: 'F-02' }

  it('matches on the label by default', () => {
    expect(matchesMenuFilter(option, 'nan', {})).toBe(true)
    expect(matchesMenuFilter(option, 'zzz', {})).toBe(false)
  })

  it('honours optionFilterProp', () => {
    expect(matchesMenuFilter(option, 'f-0', { optionFilterProp: 'code' })).toBe(true)
    expect(matchesMenuFilter(option, 'ban', { optionFilterProp: 'code' })).toBe(false)
  })

  it('lets a custom predicate win and can disable filtering', () => {
    expect(matchesMenuFilter(option, 'x', { filterOption: input => input === 'x' })).toBe(true)
    expect(matchesMenuFilter(option, 'zzz', { filterOption: false })).toBe(true)
  })
})
