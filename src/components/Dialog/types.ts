import type { WiAppendTo } from '../../shared/overlay'

export type DialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topleft'
  | 'topright'
  | 'bottomleft'
  | 'bottomright'

export interface DialogProps {
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  /** Dialog title text. Alias of `header`. */
  title?: string
  /** Alias for `title`. */
  header?: string
  closeOnEsc?: boolean
  /** Close when clicking the mask. Alias of `dismissableMask`. */
  closeOnOutsideClick?: boolean
  /** alias for `closeOnOutsideClick`. */
  dismissableMask?: boolean
  closable?: boolean
  /** Show maximize / restore toggle in the header. */
  maximizable?: boolean
  modal?: boolean
  position?: DialogPosition
  width?: string
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
  /** Lock page scroll while open (default true when modal). */
  blockScroll?: boolean
}

export interface DialogEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'maximize'): void
  (event: 'unmaximize'): void
}
