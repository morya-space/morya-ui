import type { MenuNodeBase } from './types'
import {
  collectExpandableKeys,
  findMenuKeyPath,
  resolveMenuItemKey,
} from './tree'

export interface FlatMenuEntry<T extends MenuNodeBase = MenuNodeBase> {
  item: T
  key: string
  parentKey: string | null
  hasChildren: boolean
}

export interface InitialExpandedKeysOptions {
  defaultExpandAll?: boolean
  defaultExpandedKeys?: string[]
  selectedKey?: string | null
}

/** Resolve the first paint expanded-key set from menu defaults / selection. */
export function resolveInitialExpandedKeys(
  items: MenuNodeBase[],
  options: InitialExpandedKeysOptions = {},
): string[] {
  if (options.defaultExpandAll) return collectExpandableKeys(items)
  if (options.defaultExpandedKeys?.length) return [...options.defaultExpandedKeys]
  if (options.selectedKey) {
    const path = findMenuKeyPath(items, options.selectedKey)
    return path ?? []
  }
  return []
}

/**
 * Toggle one key in an expanded-key list.
 * Accordion mode collapses other top-level groups when opening one.
 */
export function toggleExpandedKeys(
  expandedKeys: string[],
  key: string,
  options: { accordion?: boolean; topLevelKeys?: string[] } = {},
): string[] {
  const next = [...expandedKeys]
  const index = next.indexOf(key)
  if (index >= 0) {
    next.splice(index, 1)
    return next
  }
  const topLevelKeys = options.topLevelKeys ?? []
  if (options.accordion && topLevelKeys.includes(key)) {
    for (const openKey of [...next]) {
      if (topLevelKeys.includes(openKey) && openKey !== key) {
        const removeIndex = next.indexOf(openKey)
        if (removeIndex >= 0) next.splice(removeIndex, 1)
      }
    }
  }
  next.push(key)
  return next
}

/** Merge ancestor path into expanded keys when selection changes. */
export function mergeExpandedKeysForSelection(
  expandedKeys: string[],
  path: string[],
  options: { accordion?: boolean; topLevelKeys?: string[] } = {},
): string[] {
  if (!path.length) return expandedKeys
  const merged = new Set([...expandedKeys, ...path])
  if (options.accordion) {
    for (const topKey of options.topLevelKeys ?? []) {
      if (merged.has(topKey) && !path.includes(topKey)) merged.delete(topKey)
    }
  }
  return Array.from(merged)
}

/**
 * Visible menu entries in DOM order.
 * When `excludeChildren` is true (collapsed / horizontal flyout), nested
 * children stay out of the flat list.
 */
export function flattenVisibleMenuEntries<T extends MenuNodeBase>(
  items: T[],
  options: {
    isExpanded: (key: string) => boolean
    excludeChildren?: boolean
    prefix?: string
  },
): FlatMenuEntry<T>[] {
  const list: FlatMenuEntry<T>[] = []
  const walk = (nodes: T[], prefix: string, parentKey: string | null) => {
    nodes.forEach((item, index) => {
      if (item.separator) return
      const key = resolveMenuItemKey(item, index, prefix)
      const hasChildren = Boolean(item.items?.length)
      list.push({ item, key, parentKey, hasChildren })
      if (hasChildren && !options.excludeChildren && options.isExpanded(key)) {
        walk(item.items as T[], `${prefix}-${index}`, key)
      }
    })
  }
  walk(items, options.prefix ?? 'item', null)
  return list
}
