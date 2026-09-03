import type { WiAppendTo } from '../../shared/overlay'

export interface MegaMenuItem {
  label: string
  /** Unique key used by `selectedKey`; falls back to `label`. */
  key?: string
  icon?: string
  command?: () => void
  disabled?: boolean
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
  appendTo?: WiAppendTo
}
