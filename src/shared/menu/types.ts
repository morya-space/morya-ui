/** Shared fields across Menu / Dropdown / ContextMenu item models. */
export interface MenuNodeBase {
  key?: string
  label?: string
  value?: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  items?: MenuNodeBase[]
}
