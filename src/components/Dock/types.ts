import type { MenuNodeBase } from '../../shared/menu'
import type { RootPassThrough } from '../../shared/passThrough'

export interface DockItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface DockProps {
  pt?: RootPassThrough
  model?: DockItem[]
  position?: 'bottom' | 'top'
}
