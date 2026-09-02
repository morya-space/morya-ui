import type { MenuNodeBase } from './types'
import { menuNodeKey } from './key'

export function resolveMenuItemKey(
  item: Pick<MenuNodeBase, 'key' | 'label' | 'value'>,
  index: number,
  prefix = 'item',
): string {
  return menuNodeKey(item, index, prefix)
}

/** Parent keys from root to target (excluding target itself). */
export function findMenuKeyPath(
  items: MenuNodeBase[],
  targetKey: string,
  prefix = 'item',
): string[] | null {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]!
    if (item.separator) continue
    const key = resolveMenuItemKey(item, index, prefix)
    if (key === targetKey) return []
    if (item.items?.length) {
      const childPath = findMenuKeyPath(item.items, targetKey, `${prefix}-${index}`)
      if (childPath !== null) return [key, ...childPath]
    }
  }
  return null
}

export function menuHasDescendantKey(
  item: MenuNodeBase,
  targetKey: string,
  index: number,
  prefix = 'item',
): boolean {
  if (!item.items?.length) return false
  const key = resolveMenuItemKey(item, index, prefix)
  if (key === targetKey) return true
  return findMenuKeyPath(item.items, targetKey, `${prefix}-${index}`) !== null
}

export function collectExpandableKeys(
  items: MenuNodeBase[],
  prefix = 'item',
): string[] {
  const keys: string[] = []
  for (let index = 0; index < items.length; index++) {
    const item = items[index]!
    if (item.separator || !item.items?.length) continue
    const key = resolveMenuItemKey(item, index, prefix)
    keys.push(key)
    keys.push(...collectExpandableKeys(item.items, `${prefix}-${index}`))
  }
  return keys
}

export function collectTopLevelKeys(
  items: MenuNodeBase[],
  prefix = 'item',
): string[] {
  const keys: string[] = []
  for (let index = 0; index < items.length; index++) {
    const item = items[index]!
    if (item.separator || !item.items?.length) continue
    keys.push(resolveMenuItemKey(item, index, prefix))
  }
  return keys
}
