import type { WiAppendTo } from '../../shared/overlay'

export interface TieredMenuItem {
  label?: string
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: TieredMenuItem[]
}

export interface TieredMenuProps {
  model: TieredMenuItem[]
  popup?: boolean
  modelValue?: boolean
  /** Teleport overlay when `popup`. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface TieredMenuEmits {
  (event: 'update:modelValue', value: boolean): void
}
