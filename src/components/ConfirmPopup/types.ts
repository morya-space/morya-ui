import type { WdAppendTo } from '../../shared/overlay'

export interface ConfirmPopupProps {
  modelValue?: boolean
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  /** Anchor element for positioning. */
  target?: HTMLElement | null
  /** Fallback fixed position when `target` is absent. */
  position?: { top: number; left: number } | null
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}

export interface ConfirmPopupEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}
