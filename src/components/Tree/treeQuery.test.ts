import { describe, expect, it } from 'vitest'
import type { TreeNode } from './types'
import {
  collectExpandableTreeKeys,
  filterTreePrune,
  filterTreeRoots,
  matchTreeNodeByLabel,
  toggleTreeExpandedKey,
  treeNodeMatchesFilter,
} from './treeQuery'

const nodes: TreeNode[] = [
  {
    key: 'a',
    label: 'Animals',
    children: [
      { key: 'a-1', label: 'Cat' },
      { key: 'a-2', label: 'Dog' },
    ],
  },
  { key: 'b', label: 'Books' },
]

describe('treeQuery', () => {
  it('matches labels and keeps matching roots', () => {
    expect(matchTreeNodeByLabel('cat', { label: 'Cat' })).toBe(true)
    expect(treeNodeMatchesFilter(nodes[0]!, 'dog')).toBe(true)
    expect(filterTreeRoots(nodes, 'book').map((node) => node.key)).toEqual(['b'])
    expect(filterTreeRoots(nodes, 'cat').map((node) => node.key)).toEqual(['a'])
  })

  it('prunes trees for TreeSelect-style filtering', () => {
    const pruned = filterTreePrune(nodes, 'dog')
    expect(pruned).toHaveLength(1)
    expect(pruned[0]?.children?.map((child) => child.key)).toEqual(['a-2'])
  })

  it('collects and toggles expanded keys', () => {
    expect(collectExpandableTreeKeys(nodes)).toEqual({ a: true })
    expect(toggleTreeExpandedKey({}, 'a')).toEqual({ a: true })
    expect(toggleTreeExpandedKey({ a: true }, 'a')).toEqual({})
    expect(toggleTreeExpandedKey({ a: true }, 'b', { accordion: true })).toEqual({ b: true })
    expect(toggleTreeExpandedKey({ a: true }, 'a', { mode: 'boolean' })).toEqual({ a: false })
  })
})
