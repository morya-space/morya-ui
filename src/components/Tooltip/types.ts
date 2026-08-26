import type { WiAppendTo } from '../../shared/overlay'

export interface TooltipProps {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
  /** Delay in ms before showing the tooltip. */
  showDelay?: number
  /** Delay in ms before hiding the tooltip. */
  hideDelay?: number
  /** Max width of the tooltip content. Number is pixels. */
  maxWidth?: string | number
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
}
