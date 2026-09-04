import type { WdAppendTo } from '../../shared/overlay'
import type { MenuNodeBase } from '../../shared/menu'

export interface CommandMenuItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}

export interface CommandMenuProps {
  model?: CommandMenuItem[]
  modelValue?: boolean
  placeholder?: string
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface CommandMenuEmits {
  (event: 'update:modelValue', value: boolean): void
}
