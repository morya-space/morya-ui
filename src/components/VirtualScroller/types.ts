import type { RootPassThrough } from '../../shared/passThrough'
export interface VirtualScrollerProps {
  pt?: RootPassThrough
  items: unknown[]
  itemSize: number
  /** Visible viewport height in px. */
  height?: number | string
  /** Extra items rendered above/below viewport. */
  buffer?: number
  role?: string
  ariaLabel?: string
}

export interface VirtualScrollerItemSlotProps {
  item: unknown
  index: number
}

export interface VirtualScrollerExpose {
  scrollToIndex: (index: number) => void
}
