import type { CSSProperties, InjectionKey, Ref } from 'vue'

export type GridResponsive = 'self' | 'screen'

export interface GridProps {
  /** Disable layout shift / collapsed bookkeeping; plain CSS grid. */
  layoutShiftDisabled?: boolean
  /** Responsive query source. */
  responsive?: GridResponsive
  /** Column count: number or responsive string like `1 s:2 m:3`. */
  cols?: number | string
  /** Horizontal gap (px number or responsive string). */
  xGap?: number | string
  /** Vertical gap (px number or responsive string). */
  yGap?: number | string
  /**
   * Force width queries so item `span` / `offset` responsive strings resolve
   * even when `cols` / gaps are plain numbers.
   */
  itemResponsive?: boolean
  /** Collapse overflowing items past `collapsedRows`. */
  collapsed?: boolean
  /** Visible rows when collapsed. */
  collapsedRows?: number
  /** Style applied to each grid item. */
  itemStyle?: string | CSSProperties
}

export interface GridItemProps {
  /** Column span: number or responsive string. */
  span?: number | string
  /** Offset before this item: number or responsive string. */
  offset?: number | string
  /** Stick to the end of the last visible row when collapsed. */
  suffix?: boolean
}

export interface GridItemLayout {
  span: number
  offset: number
  colStart?: number
  show: boolean
}

export interface WdGridContext {
  overflow: Ref<boolean>
  itemStyle: Ref<string | CSSProperties | undefined>
  xGap: Ref<string>
  layoutShiftDisabled: Ref<boolean>
  assignLayout: (uid: number, layout: GridItemLayout) => GridItemLayout | undefined
  register: (uid: number) => void
  unregister: (uid: number) => void
}

export const WD_GRID_KEY: InjectionKey<WdGridContext> = Symbol('wdGrid')
export const WD_GRID_ITEM_FLAG = '__WI_GRID_ITEM__' as const
