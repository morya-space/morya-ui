import type { AsyncGuard } from '../../shared/asyncGuard'
import type { WiAppendTo } from '../../shared/overlay'
import type { ButtonSeverity } from '../Button/types'
import type { IconName } from '../Icon/types'

export type ConfirmPopupPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface ConfirmPopupProps {
  modelValue?: boolean
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  /** Severity of the accept button, e.g. `'danger'` for destructive confirmations. */
  acceptSeverity?: ButtonSeverity
  /** Icon beside the message. */
  icon?: IconName
  /** Return `false` to keep the popup open and skip the `accept` emit. */
  beforeAccept?: AsyncGuard
  /** Placement relative to `target`. */
  placement?: ConfirmPopupPlacement
  /** Anchor element for positioning. */
  target?: HTMLElement | null
  /** Fallback fixed position when `target` is absent. */
  position?: { top: number; left: number } | null
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface ConfirmPopupEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}
