import type { WdAppendTo } from '../../shared/overlay'

export type ScrollTopTarget = 'window' | 'parent'

export interface ScrollTopProps {
  threshold?: number
  target?: ScrollTopTarget
  /** Teleport button. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WdAppendTo
}
