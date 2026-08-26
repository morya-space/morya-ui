import type { WiAppendTo } from '../../shared/overlay'

export interface MenuItem {
  key?: string
  label?: string
  icon?: string
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
  /** Selected item key (`item.key` or `item.label`). */
  selectedKey?: string | null
  /** Icon-only density. Nested items stay in-place (no flyout). */
  collapsed?: boolean
  /** Extra padding-left per nesting level, in px. Default 16. */
  indent?: number
  /** Teleport overlay when `popup`. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface MenuEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MenuItem): void
}
