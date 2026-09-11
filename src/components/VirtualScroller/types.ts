import type { RootPassThrough } from '../../shared/passThrough'
export interface VirtualScrollerProps {
  pt?: RootPassThrough
  items: unknown[]
  itemSize: number
  /** Visible viewport height in px. */
  height?: number | string
  /** Extra items rendered above/below viewport. */
  buffer?: number
}

export interface VirtualScrollerItemSlotProps {
  item: unknown
  index: number
}
