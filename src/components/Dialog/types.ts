import type { AsyncGuard } from '../../shared/asyncGuard'
import type { MAppendTo } from '../../shared/overlay'
import type { PassThroughPart } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'
import type { ButtonColor } from '../Button/types'
import type { IconName } from '../Icon/types'

export type DialogType = 'info' | 'success' | 'warning' | 'danger'

export type DialogCloseGuard = AsyncGuard
export type DialogClickGuard = AsyncGuard<[MouseEvent]>

/** Attributes for Dialog DOM parts. Useful for Teleport-safe customization. */
export type DialogPassThrough = Partial<
  Record<'root' | 'zoom' | 'panel' | 'header' | 'body' | 'footer', PassThroughPart>
>

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
  /** Attributes for named Dialog DOM parts. */
  pt?: DialogPassThrough
  /** Visibility. Use with `v-model`. */
  modelValue?: boolean
  /** Dialog title text. */
  title?: string
  closeOnEsc?: boolean
  /** Close when clicking the mask. Defaults to `false`. */
  closeOnOutsideClick?: boolean
  closable?: boolean
  /**
   * Show maximize / restore toggle in the header.
   * Two-way bound to `v-model:fullscreen`: internal maximize state and the
   * `fullscreen` prop are kept in sync.
   */
  maximizable?: boolean
  /**
   * Full-screen mode. Use with `v-model:fullscreen`.
   * When `maximizable` is enabled, the header toggle stays in sync.
   */
  fullscreen?: boolean
  modal?: boolean
  position?: DialogPosition
  /** Panel width. Number is treated as pixels. Ignored while fullscreen. */
  width?: string | number
  /** Margin-top (e.g. `'15vh'`). Only applies to `top` / `topLeft` / `topRight` positions. */
  top?: string
  /** Force `z-index` on the backdrop. Use only when stacking multiple overlays. */
  zIndex?: number | string
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: MAppendTo
  /** Lock page scroll while open (default true when modal). */
  blockScroll?: boolean
  /**
   * Status icon in the header. Visual only — use ConfirmDialog for accept/reject flows.
   */
  type?: DialogType
  /** Preset confirm button label. Ignored when the `footer` slot is used. */
  positiveText?: string
  /** Preset cancel button label. Ignored when the `footer` slot is used. */
  negativeText?: string
  /** Color of the preset confirm button. */
  positiveColor?: ButtonColor
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
  /** Accessible heading level for the title (`role="heading"`). Defaults to `2`. */
  headerAriaLevel?: number | string
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
  /**
   * Allow the user to drag the panel by its header.
   * Uses pointer capture + requestAnimationFrame; offset is reset on close.
   */
  draggable?: boolean
  /** When `draggable`, allow the panel to leave the viewport. Defaults to `false`. */
  overflow?: boolean
  /**
   * Unmount the default slot content when the dialog is closed.
   * Useful to reset forms / local state.
   */
  destroyOnClose?: boolean
  /** Delay (ms) before the dialog becomes visible after `modelValue` flips to `true`. */
  openDelay?: number
  /** Delay (ms) before the dialog starts hiding after `modelValue` flips to `false`. */
  closeDelay?: number
  /** Custom close icon. `null` falls back to the default. */
  closeIcon?: IconName | null
}

export interface DialogEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:fullscreen', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'opened'): void
  (event: 'hide'): void
  (event: 'closed'): void
  (event: 'maximize'): void
  (event: 'unmaximize'): void
}
