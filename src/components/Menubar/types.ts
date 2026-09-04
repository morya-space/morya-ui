import type { WdAppendTo } from '../../shared/overlay'
import type { MenuNodeBase } from '../../shared/menu'

export interface MenubarItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  items?: MenubarItem[]
}

export interface MenubarProps {
  model: MenubarItem[]
  selectedKey?: string | null
  /** Teleport submenu. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface MenubarEmits {
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MenubarItem): void
}
