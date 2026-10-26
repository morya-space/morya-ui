import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type PanelSize = MSizeInput

export interface PanelProps {
  pt?: RootPassThrough
  header?: string
  toggleable?: boolean
  /** Collapsed state. Use with `v-model:collapsed`. */
  collapsed?: boolean
  /** Uncontrolled initial collapsed state when `collapsed` is omitted. */
  defaultCollapsed?: boolean
  size?: PanelSize
}

export interface PanelEmits {
  (event: 'update:collapsed', value: boolean): void
}
