import type { AsyncGuard } from '../../shared/asyncGuard'
import type { WiAppendTo } from '../../shared/overlay'
import type { ButtonSeverity } from '../Button/types'
import type { DialogType } from '../Dialog/types'

export interface ConfirmDialogProps {
  modelValue?: boolean
  header?: string
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  acceptSeverity?: ButtonSeverity
  /** Status icon beside the message. `warning` is an alias of `warn`. */
  type?: DialogType
  /** Show a loading spinner on the accept button. */
  loading?: boolean
  /** Close when pressing Escape. */
  closeOnEsc?: boolean
  /** Close when clicking the mask (same as reject). */
  closeOnOutsideClick?: boolean
  /** Lock page scroll while open. */
  blockScroll?: boolean
  /** Return `false` to keep the dialog open and skip the `accept` emit. */
  beforeAccept?: AsyncGuard
  /** Return `false` to keep the dialog open and skip the `reject` emit. */
  beforeReject?: AsyncGuard
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface ConfirmDialogEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}
