import type { WiAppendTo } from '../../shared/overlay'

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  position?: DrawerPosition
  /** Show dimmed mask behind the panel. */
  modal?: boolean
  /** Close when clicking the mask. */
  dismissable?: boolean
  showCloseIcon?: boolean
  header?: string
  /** Lock `document.body` overflow while open. */
  blockScroll?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
}

export interface DrawerEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
}
