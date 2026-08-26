import type { WiAppendTo } from '../../shared/overlay'

export interface MenubarItem {
  key?: string
  label: string
  icon?: string
  command?: () => void
  disabled?: boolean
  items?: MenubarItem[]
}

export interface MenubarProps {
  model: MenubarItem[]
  selectedKey?: string | null
  /** Teleport submenu. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface MenubarEmits {
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MenubarItem): void
}
