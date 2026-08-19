export type DataViewLayout = 'list' | 'grid'

export interface DataViewProps {
  value?: unknown[]
  layout?: DataViewLayout
  paginator?: boolean
  rows?: number
}
