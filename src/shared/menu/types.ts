import type { Component } from 'vue'

/** Shared fields across Menu / Dropdown / ContextMenu item models. */
export interface MenuNodeBase {
  key?: string
  label?: string
  value?: string
  /** Built-in icon name, alias, or custom Vue component. */
  icon?: string | Component
  disabled?: boolean
  separator?: boolean
  shortcut?: string
  command?: () => void
  items?: MenuNodeBase[]
}
