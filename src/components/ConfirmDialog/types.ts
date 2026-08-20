import type { WiAppendTo } from '../../shared/overlay'
import type { ButtonSeverity } from '../Button/types'

export interface ConfirmDialogProps {
  modelValue?: boolean
  header?: string
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  acceptSeverity?: ButtonSeverity
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
