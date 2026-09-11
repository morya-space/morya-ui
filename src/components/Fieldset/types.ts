import type { RootPassThrough } from '../../shared/passThrough'
export interface FieldsetProps {
  pt?: RootPassThrough
  legend?: string
  toggleable?: boolean
  /** Collapsed state. Use with `v-model:collapsed`. */
  collapsed?: boolean
  /** Uncontrolled initial collapsed state when `collapsed` is omitted. */
  defaultCollapsed?: boolean
}

export interface FieldsetEmits {
  (event: 'update:collapsed', value: boolean): void
}
