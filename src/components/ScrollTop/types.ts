import type { WdAppendTo } from '../../shared/overlay'

export type ScrollTopTarget = 'window' | 'parent'

export interface ScrollTopProps {
  threshold?: number
  target?: ScrollTopTarget
  /** Distance from the right edge. Number is pixels. */
  right?: string | number
  /** Distance from the bottom edge. Number is pixels. */
  bottom?: string | number
  /** Teleport button. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}
