import type { AsyncGuard } from '../../shared/asyncGuard'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'
import type { ButtonColor } from '../Button/types'
import type { IconName } from '../Icon/types'

export type ConfirmPopupPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface ConfirmPopupProps {
  pt?: RootPassThrough
  modelValue?: boolean
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  /** Color of the accept button, e.g. `'danger'` for destructive confirmations. */
  acceptColor?: ButtonColor
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
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface ConfirmPopupEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}
