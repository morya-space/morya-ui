import type { RootPassThrough } from '../../shared/passThrough'
export interface BreadcrumbItem {
  label: string
  /** Link target. Prefer `to`; `href` is an alias. */
  to?: string
  /** Alias of `to` (`href`). */
  href?: string
  disabled?: boolean
}

export interface BreadcrumbHome {
  label?: string
  to?: string
  /** Alias of `to` (`href`). */
  href?: string
}

export interface BreadcrumbProps {
  pt?: RootPassThrough
  model: BreadcrumbItem[]
  home?: BreadcrumbHome
  /** Separator between items. Defaults to `/`. Use `#separator` slot for custom nodes. */
  separator?: string
}
