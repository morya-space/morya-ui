import type { MAppendTo } from '../../shared/overlay'
import type { MotionPresetId } from '../../theme/motionPresets'

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
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}
