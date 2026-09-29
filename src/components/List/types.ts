import type { InjectionKey, Ref, VNodeChild } from 'vue'

import type { RootPassThrough } from '../../shared/passThrough'

import type { MSizeInput } from '../../shared/types'



export type ListItemLayout = 'horizontal' | 'vertical'

export type ListSize = MSizeInput



export interface ListGridType {

  column?: number

  gutter?: number | string

  xs?: number

  sm?: number

  md?: number

  lg?: number

  xl?: number

}



export type ListPaginationPosition = 'top' | 'bottom' | 'both'

export type ListPaginationAlign = 'start' | 'center' | 'end'



export interface ListPaginationConfig {

  page?: number

  pageSize?: number

  total?: number

  position?: ListPaginationPosition

  align?: ListPaginationAlign

}



export type ListRowKey<T = unknown> = string | ((item: T, index: number) => string)



export interface ListProps<T = unknown> {

  pt?: RootPassThrough

  /** Primary data array. */

  items?: T[]

  /** Alias of `items`. */

  dataSource?: T[]

  /** Alias of `items`. */

  data?: T[]

  bordered?: boolean

  /** Divider between items. Default `true`. */

  split?: boolean

  loading?: boolean

  size?: ListSize

  itemLayout?: ListItemLayout

  header?: string

  footer?: string

  pagination?: ListPaginationConfig | false

  grid?: ListGridType

  rowKey?: ListRowKey<T>

}



export interface ListItemProps {

  /** Action nodes; prefer `#actions` for custom markup. */

  actions?: VNodeChild[]

  extra?: VNodeChild

}



export interface ListItemMetaProps {

  avatar?: VNodeChild

  title?: VNodeChild

  description?: VNodeChild

}



export interface ListContext {

  bordered: Ref<boolean>

  split: Ref<boolean>

  itemLayout: Ref<ListItemLayout>

  sizeClass: Ref<'small' | 'normal' | 'large'>

  grid: Ref<ListGridType | undefined>

}



export const LIST_KEY: InjectionKey<ListContext> = Symbol('mList')


