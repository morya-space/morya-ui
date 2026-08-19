import type { WdAppendTo } from '../../shared/overlay'

export interface TooltipProps {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
  /** Delay in ms before showing the tooltip. */
  showDelay?: number
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WdAppendTo
}
