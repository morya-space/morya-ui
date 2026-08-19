export type ProgressBarMode = 'determinate' | 'indeterminate'

export interface ProgressBarProps {
  /** Progress percentage from 0 to 100. */
  value?: number
  /** Determinate shows value; indeterminate animates without a fixed value. */
  mode?: ProgressBarMode
  /** Show percentage label in determinate mode. */
  showValue?: boolean
}
