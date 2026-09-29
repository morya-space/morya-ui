import { describe, expect, it } from 'vitest'
import {
  applyAccordionExpand,
  collectExpandableKeys,
  filterTreeNodes,
  flattenVisibleTree,
  transformFlatToTree,
} from './tree'

const nested = [
  {
    id: 1,
    name: 'Root',
    children: [
      { id: 11, name: 'Child A' },
      {
        id: 12,
        name: 'Child B',
        children: [{ id: 121, name: 'Leaf' }],
      },
    ],
  },
  { id: 2, name: 'Other' },
]

describe('table tree helpers', () => {
  it('transforms flat parentId rows into a nested tree', () => {
    const flat = [
      { id: 1, parentId: null, name: 'Root' },
      { id: 11, parentId: 1, name: 'Child' },
      { id: 2, parentId: null, name: 'Other' },
    ]
    const tree = transformFlatToTree(flat, 'id', 'parentId', 'children')
    expect(tree.map((row) => row.id)).toEqual([1, 2])
    expect((tree[0]!.children as Array<{ id: number }>).map((row) => row.id)).toEqual([11])
  })

  it('flattens only expanded branches', () => {
    const { rows, meta } = flattenVisibleTree(nested, [1], 'id', 'children', false, 'hasChild', new Set())
    expect(rows.map((row) => row.id)).toEqual([1, 11, 12, 2])
    expect(meta.get(11)?.depth).toBe(1)
    expect(meta.get(12)?.hasChildren).toBe(true)
  })

  it('collects expandable keys for expandAll', () => {
    expect(collectExpandableKeys(nested, 'id', 'children', false, 'hasChild')).toEqual([1, 12])
  })

  it('filters tree while keeping ancestor path', () => {
    const filtered = filterTreeNodes(nested, 'children', (row) => row.name === 'Leaf')
    expect(filtered).toHaveLength(1)
    expect(filtered[0]!.id).toBe(1)
    const childB = (filtered[0]!.children as Array<{ id: number; children?: unknown[] }>)[0]
    expect(childB?.id).toBe(12)
  })

  it('applies accordion expand among siblings', () => {
    const { meta } = flattenVisibleTree(nested, [1, 12], 'id', 'children', false, 'hasChild', new Set())
    // expand 11 under parent 1 → drop 12 if it were sibling; here siblings of 11 are under 1: 11 and 12
    const next = applyAccordionExpand([1, 12], 11, 1, meta)
    expect(next).toEqual([1, 11])
  })
})
