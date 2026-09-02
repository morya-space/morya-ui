import { describe, expect, it } from 'vitest'
import {
  collectExpandableKeys,
  collectTopLevelKeys,
  findMenuKeyPath,
  menuHasDescendantKey,
} from './tree'

describe('menu tree utils', () => {
  const model = [
    { key: 'a', label: 'A', items: [{ key: 'a1', label: 'A1' }] },
    { key: 'b', label: 'B' },
  ]

  it('finds path to nested key', () => {
    expect(findMenuKeyPath(model, 'a1')).toEqual(['a'])
    expect(findMenuKeyPath(model, 'b')).toEqual([])
    expect(findMenuKeyPath(model, 'missing')).toBeNull()
  })

  it('detects descendant keys', () => {
    expect(menuHasDescendantKey(model[0]!, 'a1', 0)).toBe(true)
    expect(menuHasDescendantKey(model[1]!, 'a1', 1)).toBe(false)
  })

  it('collects expandable keys', () => {
    expect(collectExpandableKeys(model)).toEqual(['a'])
    expect(collectTopLevelKeys(model)).toEqual(['a'])
  })
})
