import { describe, expect, it } from 'vitest'
import {
  flattenVisibleMenuEntries,
  mergeExpandedKeysForSelection,
  resolveInitialExpandedKeys,
  toggleExpandedKeys,
} from './expand'

const model = [
  {
    key: 'a',
    label: 'A',
    items: [
      { key: 'a1', label: 'A1' },
      { key: 'a2', label: 'A2' },
    ],
  },
  {
    key: 'b',
    label: 'B',
    items: [{ key: 'b1', label: 'B1' }],
  },
  { key: 'c', label: 'C' },
]

describe('menu expand utils', () => {
  it('resolves initial expanded keys from defaults and selection', () => {
    expect(resolveInitialExpandedKeys(model, { defaultExpandAll: true })).toEqual(['a', 'b'])
    expect(resolveInitialExpandedKeys(model, { defaultExpandedKeys: ['b'] })).toEqual(['b'])
    expect(resolveInitialExpandedKeys(model, { selectedKey: 'a2' })).toEqual(['a'])
    expect(resolveInitialExpandedKeys(model)).toEqual([])
  })

  it('toggles keys and respects accordion top-level groups', () => {
    expect(toggleExpandedKeys(['a'], 'a')).toEqual([])
    expect(toggleExpandedKeys(['a'], 'b', { accordion: true, topLevelKeys: ['a', 'b'] })).toEqual([
      'b',
    ])
    expect(toggleExpandedKeys(['a'], 'b', { accordion: false, topLevelKeys: ['a', 'b'] })).toEqual([
      'a',
      'b',
    ])
  })

  it('merges selection path into expanded keys with accordion cleanup', () => {
    expect(
      mergeExpandedKeysForSelection(['b'], ['a'], {
        accordion: true,
        topLevelKeys: ['a', 'b'],
      }),
    ).toEqual(['a'])
    expect(mergeExpandedKeysForSelection(['b'], ['a'], { accordion: false })).toEqual(['b', 'a'])
  })

  it('flattens only expanded children unless excludeChildren is set', () => {
    const expanded = new Set(['a'])
    const rows = flattenVisibleMenuEntries(model, {
      isExpanded: (key) => expanded.has(key),
    })
    expect(rows.map((row) => row.key)).toEqual(['a', 'a1', 'a2', 'b', 'c'])

    const flyout = flattenVisibleMenuEntries(model, {
      isExpanded: () => true,
      excludeChildren: true,
    })
    expect(flyout.map((row) => row.key)).toEqual(['a', 'b', 'c'])
  })
})
