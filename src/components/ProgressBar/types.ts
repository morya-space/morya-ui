export type ProgressBarMode = 'determinate' | 'indeterminate'
export type ProgressBarType = 'line' | 'circle'
export type ProgressBarStatus = 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'error'

export interface ProgressBarProps {
  /** Progress percentage from 0 to 100. */
  value?: number
  /** Determinate shows value; indeterminate animates without a fixed value. */
  mode?: ProgressBarMode
  /** Line (default) or circle. */
  type?: ProgressBarType
  /** Semantic fill color. */
  status?: ProgressBarStatus
  /** Custom fill color. Overrides `status` when set. */
  color?: string
  /** Show percentage label in determinate mode. */
  showValue?: boolean
}
