import type { MenuNodeBase } from '../../shared/menu'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'

export interface ContextMenuItem extends MenuNodeBase {
  items?: ContextMenuItem[]
}

export interface ContextMenuPosition {
  x: number
  y: number
}

export interface ContextMenuProps {
  pt?: RootPassThrough
  model: ContextMenuItem[]
  modelValue?: boolean
  position?: ContextMenuPosition
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface ContextMenuEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:position', value: ContextMenuPosition): void
}

export interface ContextMenuInstance {
  show: (event: MouseEvent | ContextMenuPosition) => void
  hide: () => void
}
