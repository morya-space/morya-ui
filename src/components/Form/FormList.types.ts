import type { RootPassThrough } from '../../shared/passThrough'
import type { NamePath, NamePathKey } from './paths'
import type { FormItemRule } from './types'

/** One rendered row of a `MFormList`. */
export interface FormListItem {
  /** Stable key for `v-for`. */
  key: string
  /** Current index of the row in the list. */
  name: number
}

/** Slot props provided by `MFormList`. */
export interface FormListSlotProps {
  fields: FormListItem[]
  /** Append a row (uses `initialValue` when omitted). */
  add: (value?: unknown) => void
  /** Remove the row at `index`. */
  remove: (index: number) => void
  /** Move a row from one position to another. */
  move: (from: number, to: number) => void
  /** Resolved path of the list field, e.g. `['items']`. */
  path: NamePathKey[]
}

export interface FormListProps {
  /** Path of the array field, e.g. `'items'` or `['group', 'items']`. */
  name: NamePath
  /** Rules for the array itself (e.g. `{ required: true }` for "at least one row"). */
  rules?: FormItemRule | FormItemRule[]
  /** Value used for a new row. Pass a factory to create a fresh object each time. */
  initialValue?: unknown
  pt?: RootPassThrough
}
