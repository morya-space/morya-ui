export interface DockItem {
  label: string
  icon?: string
  command?: () => void
  disabled?: boolean
}

export interface DockProps {
  model?: DockItem[]
  position?: 'bottom' | 'top'
}
