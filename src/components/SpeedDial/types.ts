import type { MenuNodeBase } from '../../shared/menu'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'

export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right'

export interface SpeedDialItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface SpeedDialProps {
  pt?: RootPassThrough
  model?: SpeedDialItem[]
  direction?: SpeedDialDirection
  modelValue?: boolean
  disabled?: boolean
  ariaLabel?: string
  /** Teleport action list. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface SpeedDialEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'item-click', item: SpeedDialItem): void
}
