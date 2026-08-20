import type { WiAppendTo } from '../../shared/overlay'

export interface MenubarItem {
  label: string
  command?: () => void
  disabled?: boolean
  items?: MenubarItem[]
}

export interface MenubarProps {
  model: MenubarItem[]
  /** Teleport submenu. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}
