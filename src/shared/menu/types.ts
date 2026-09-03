/** Shared fields across Menu / Dropdown / ContextMenu item models. */
export interface MenuNodeBase {
  key?: string
  label?: string
  value?: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  shortcut?: string
  command?: () => void
  items?: MenuNodeBase[]
}
