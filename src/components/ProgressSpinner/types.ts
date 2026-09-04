import type { WdSizeInput } from '../../shared/types'

export interface ProgressSpinnerProps {
  /** SVG circle stroke width. */
  strokeWidth?: string
  /** Rotation animation duration. */
  animationDuration?: string
  /** Accessible name for the spinner. */
  ariaLabel?: string
  /** Overlay visibility when wrapping content. Defaults to `true`. */
  show?: boolean
  /** Delay in ms before showing the overlay. */
  delay?: number
  /** Size of the spinner. */
  size?: WdSizeInput
  /** Optional description under the spinner. */
  description?: string
}
