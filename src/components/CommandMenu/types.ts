import type { MenuNodeBase } from '../../shared/menu'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'

export interface CommandMenuItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface CommandMenuProps {
  pt?: RootPassThrough
  model?: CommandMenuItem[]
  modelValue?: boolean
  placeholder?: string
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface CommandMenuEmits {
  (event: 'update:modelValue', value: boolean): void
}
