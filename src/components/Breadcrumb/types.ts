import type { RootPassThrough } from '../../shared/passThrough'
export interface BreadcrumbItem {
  label: string
  to?: string
  disabled?: boolean
}

export interface BreadcrumbHome {
  label?: string
  to?: string
}

export interface BreadcrumbProps {
  pt?: RootPassThrough
  model: BreadcrumbItem[]
  home?: BreadcrumbHome
  /** Separator between items. Defaults to `/`. */
  separator?: string
}
