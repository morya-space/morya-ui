import type { RootPassThrough } from '../../shared/passThrough'
import type { MenuNodeBase } from '../../shared/menu'

export interface DockItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface DockProps {
  pt?: RootPassThrough
  model?: DockItem[]
  position?: 'bottom' | 'top'
}
