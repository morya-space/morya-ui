export interface SidebarItem {
  label: string
  icon?: string
  command?: () => void
  disabled?: boolean
  items?: SidebarItem[]
}

export interface SidebarProps {
  model?: SidebarItem[]
  collapsed?: boolean
}
