import type { WdAppendTo } from '../../shared/overlay'

export interface CommandMenuItem {
  label: string
  icon?: string
  shortcut?: string
  command?: () => void
  disabled?: boolean
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
