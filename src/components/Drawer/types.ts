import type { AsyncGuard } from '../../shared/asyncGuard'
import type { WdAppendTo } from '../../shared/overlay'

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  position?: DrawerPosition
  /** Show dimmed mask behind the panel. */
  modal?: boolean
  /** Close when clicking the mask. Alias of `closeOnOutsideClick`. */
  dismissable?: boolean
  /** Close when clicking the mask. Preferred over `dismissable`. */
  closeOnOutsideClick?: boolean
  /** Close when pressing Escape. */
  closeOnEsc?: boolean
  /** Return `false` to keep the drawer open. */
  beforeClose?: AsyncGuard
  showCloseIcon?: boolean
  header?: string
  /** Panel width for left/right. Number is pixels. */
  width?: string | number
  /** Panel height for top/bottom. Number is pixels. */
  height?: string | number
  /** Lock `document.body` overflow while open. */
  blockScroll?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WdAppendTo
}

export interface DrawerEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'after-leave'): void
}
