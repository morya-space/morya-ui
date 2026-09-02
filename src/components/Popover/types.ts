import type { WiAppendTo } from '../../shared/overlay'

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'left-start'

export type PopoverTrigger = 'manual' | 'click' | 'hover' | 'focus'

export interface PopoverProps {
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  placement?: PopoverPlacement
  /** How the popover opens. `manual` is v-model only. */
  trigger?: PopoverTrigger
  /** Delay in ms before showing on hover/focus. */
  showDelay?: number
  /** Delay in ms before hiding on hover/focus. */
  hideDelay?: number
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
}

export interface PopoverEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
}
