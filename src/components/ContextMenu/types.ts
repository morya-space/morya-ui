import type { WiAppendTo } from '../../shared/overlay'
import type { MenuNodeBase } from '../../shared/menu'

export interface ContextMenuItem extends MenuNodeBase {
  items?: ContextMenuItem[]
}

export interface ContextMenuPosition {
  x: number
  y: number
}

export interface ContextMenuProps {
  model: ContextMenuItem[]
  modelValue?: boolean
  position?: ContextMenuPosition
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface ContextMenuEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:position', value: ContextMenuPosition): void
}

export interface ContextMenuInstance {
  show: (event: MouseEvent | ContextMenuPosition) => void
  hide: () => void
}
