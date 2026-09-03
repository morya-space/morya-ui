import type { MenuNodeBase } from '../../shared/menu'

export interface DockItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface DockProps {
  model?: DockItem[]
  position?: 'bottom' | 'top'
}
