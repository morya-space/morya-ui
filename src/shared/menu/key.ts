import type { MenuNodeBase } from './types'

/** Stable list key for menu-like nodes (`key` → `value` → `label` → fallback). */
export function menuNodeKey(
  item: Pick<MenuNodeBase, 'key' | 'label' | 'value'>,
  index: number,
  prefix = 'item',
): string {
  return item.key ?? item.value ?? item.label ?? `${prefix}-${index}`
}
