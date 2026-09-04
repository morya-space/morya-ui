import type { WdAppendTo } from '../../shared/overlay'
import type { MenuNodeBase } from '../../shared/menu'

export interface MegaMenuItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  /** Column groups for mega panel; each entry is a column of items. */
  items?: MegaMenuItem[][]
}

export interface MegaMenuProps {
  model?: MegaMenuItem[]
  /** Currently selected item key (`v-model:selectedKey`). */
  selectedKey?: string | null
  /** Teleport panel. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}
