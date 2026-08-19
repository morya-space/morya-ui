import type { WdAppendTo } from '../../shared/overlay'

export interface ContextMenuItem {
  label?: string
  command?: () => void
  disabled?: boolean
  separator?: boolean
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
  appendTo?: WdAppendTo
}

export interface ContextMenuEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:position', value: ContextMenuPosition): void
}

export interface ContextMenuInstance {
  show: (event: MouseEvent | ContextMenuPosition) => void
  hide: () => void
}
