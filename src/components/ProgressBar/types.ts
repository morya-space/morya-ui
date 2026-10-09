import type { RootPassThrough } from '../../shared/passThrough'

export type ProgressBarMode = 'determinate' | 'indeterminate'
export type ProgressBarType = 'line' | 'circle'
/**
 * Canonical: success/info/warning/danger.
 * `exception` → danger, `active` → stripe animation (line), `normal` → primary.
 */
export type ProgressBarStatus =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  /** Alias of `danger`. */
  | 'exception'
  /** Determinate line fill with animated stripe (not indeterminate). */
  | 'active'
  /** Alias of the default primary fill. */
  | 'normal'

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
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}
