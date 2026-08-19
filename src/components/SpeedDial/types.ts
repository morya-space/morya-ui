import type { WdAppendTo } from '../../shared/overlay'

export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right'

export interface SpeedDialItem {
  label: string
  icon?: string
  command?: () => void
  disabled?: boolean
}

export interface SpeedDialProps {
  model?: SpeedDialItem[]
  direction?: SpeedDialDirection
  modelValue?: boolean
  disabled?: boolean
  ariaLabel?: string
  /** Teleport action list. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface SpeedDialEmits {
  (event: 'update:modelValue', value: boolean): void
}
