import type { PassThroughPart, RootPassThrough } from '../../shared/passThrough'

/** Reorder detail emitted alongside `update:modelValue`. */
export interface OrderListReorderPayload {
  /** The moved item. */
  item: unknown
  /** Original index. */
  from: number
  /** New index. */
  to: number
}

/** OrderList pass-through parts. */
export type OrderListPassThrough = RootPassThrough &
  Partial<Record<'controls' | 'list' | 'item' | 'handle' | 'label', PassThroughPart>>

export interface OrderListProps {
  pt?: OrderListPassThrough
  modelValue?: unknown[]
  /** Controlled selected index. Use with `v-model:selection`. */
  selection?: number | null
  dataKey?: string
  listStyle?: string | Record<string, string>
  /** Enable drag-and-drop reorder. Defaults to true. */
  dragdrop?: boolean
  /** Disable all interactions (buttons, drag, selection). */
  disabled?: boolean
  /** Empty state message; defaults to locale `emptyMessage`. */
  emptyMessage?: string
}

export interface OrderListEmits {
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'update:selection', value: number | null): void
  /** Fired after a reorder with the move detail (new order goes to `update:modelValue`). */
  (event: 'reorder', payload: OrderListReorderPayload): void
}
