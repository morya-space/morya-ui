import type { MenuNodeBase } from '../../shared/menu'

export interface SidebarItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  items?: SidebarItem[]
}

export interface SidebarProps {
  model?: SidebarItem[]
  collapsed?: boolean
}
