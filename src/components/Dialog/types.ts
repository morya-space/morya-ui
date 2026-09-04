import type { AsyncGuard } from '../../shared/asyncGuard'
import type { WdAppendTo } from '../../shared/overlay'
import type { ButtonSeverity } from '../Button/types'

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'warn'

export type DialogCloseGuard = AsyncGuard
export type DialogClickGuard = AsyncGuard<[MouseEvent]>

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
  appendTo?: WdAppendTo
  /** Lock page scroll while open (default true when modal). */
  blockScroll?: boolean
  /**
   * Status icon in the header. Visual only — use ConfirmDialog for accept/reject flows.
   * `warning` is an alias of `warn`.
   */
  type?: DialogType
  /** Preset confirm button label. Ignored when the `footer` slot is used. */
  positiveText?: string
  /** Preset cancel button label. Ignored when the `footer` slot is used. */
  negativeText?: string
  /** Severity of the preset confirm button. */
  positiveSeverity?: ButtonSeverity
  /**
   * Preset confirm handler. Return `false` (or a Promise of `false`) to keep the dialog open.
   * Use `:on-positive-click` — do not combine with a `positiveClick` emit.
   */
  onPositiveClick?: DialogClickGuard
  /** Preset cancel handler. Same `false` convention as `onPositiveClick`. */
  onNegativeClick?: DialogClickGuard
  /** Runs before X / Esc / mask dismiss. Return `false` to keep the dialog open. */
  beforeClose?: DialogCloseGuard
  /** Accessible name when no visible title is provided. */
  ariaLabel?: string
}

export interface DialogEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'maximize'): void
  (event: 'unmaximize'): void
}
