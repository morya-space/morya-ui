import type { RootPassThrough } from '../../shared/passThrough'
export interface ToolbarProps {
  pt?: RootPassThrough
  /** Accessible name when the toolbar has no visible title. */
  ariaLabel?: string
}
