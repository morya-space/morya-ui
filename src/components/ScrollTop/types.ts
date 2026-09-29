import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'

export type ScrollTopTarget = 'window' | 'parent'
/** Floating control shape. */
export type ScrollTopShape = 'circle' | 'square'

export interface ScrollTopProps {
  pt?: RootPassThrough
  /** Show after scroll past this many px (`threshold`). */
  threshold?: number
  target?: ScrollTopTarget
  shape?: ScrollTopShape
  /** Distance from the right edge. Number is pixels. */
  right?: string | number
  /** Distance from the bottom edge. Number is pixels. */
  bottom?: string | number
  /** Teleport button. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
}
