import { describe, expect, it } from 'vitest'
import {
  collectSubtree,
  computeTreeIndeterminateKeys,
  syncTreeParentSelection,
  toggleTreeCheckboxSelection,
} from './treeSelection'

const tree = [
  {
    id: 1,
    name: 'Root',
    children: [
      { id: 11, name: 'A' },
      {
        id: 12,
        name: 'B',
        children: [{ id: 121, name: 'B1' }],
      },
    ],
  },
]

describe('treeSelection', () => {
  it('collects the whole subtree', () => {
    expect(collectSubtree(tree[0]!, 'children').map((row) => row.id)).toEqual([1, 11, 12, 121])
  })

  it('cascades selection to descendants when not checkStrictly', () => {
    const { next, selected } = toggleTreeCheckboxSelection({
      selected: [],
      row: tree[0]!,
      rowKey: 'id',
      childrenField: 'children',
      checkStrictly: false,
    })
    expect(selected).toBe(true)
    expect(next.map((row) => row.id).sort((a, b) => Number(a) - Number(b))).toEqual([1, 11, 12, 121])
  })

  it('only toggles the row itself when checkStrictly', () => {
    const { next } = toggleTreeCheckboxSelection({
      selected: [],
      row: tree[0]!,
      rowKey: 'id',
      childrenField: 'children',
      checkStrictly: true,
    })
    expect(next.map((row) => row.id)).toEqual([1])
  })

  it('marks parent indeterminate when a child is selected', () => {
    const selected = [{ id: 11, name: 'A' }]
    const half = computeTreeIndeterminateKeys(tree, selected, 'id', 'children')
    expect(half.has(1)).toBe(true)
    expect(half.has(12)).toBe(false)
  })

  it('syncs fully selected parents into the selection list', () => {
    const selected = [
      { id: 11, name: 'A' },
      { id: 12, name: 'B', children: [{ id: 121, name: 'B1' }] },
      { id: 121, name: 'B1' },
    ]
    const next = syncTreeParentSelection(tree, selected, 'id', 'children')
    expect(next.some((row) => row.id === 1)).toBe(true)
  })
})
