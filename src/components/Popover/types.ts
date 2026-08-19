import type { WdAppendTo } from '../../shared/overlay'

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'

export interface PopoverProps {
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  placement?: PopoverPlacement
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WdAppendTo
}

export interface PopoverEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
}
