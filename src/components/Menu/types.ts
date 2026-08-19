import type { WdAppendTo } from '../../shared/overlay'

export interface MenuItem {
  label?: string
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: MenuItem[]
}

export interface MenuProps {
  model: MenuItem[]
  /** Render as popup overlay when true. */
  popup?: boolean
  /** Popup visibility. Use with `v-model`. */
  modelValue?: boolean
  /** Teleport overlay when `popup`. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface MenuEmits {
  (event: 'update:modelValue', value: boolean): void
}
