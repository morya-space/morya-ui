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
  model: BreadcrumbItem[]
  home?: BreadcrumbHome
}
