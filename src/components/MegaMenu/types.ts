import type { WdAppendTo } from '../../shared/overlay'

export interface MegaMenuItem {
  label: string
  icon?: string
  command?: () => void
  disabled?: boolean
  /** Column groups for mega panel; each entry is a column of items. */
  items?: MegaMenuItem[][]
}

export interface MegaMenuProps {
  model?: MegaMenuItem[]
  /** Teleport panel. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}
