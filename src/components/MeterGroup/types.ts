export interface MeterGroupItem {
  label: string
  value: number
  color?: string
}

export interface MeterGroupProps {
  value: MeterGroupItem[]
  max?: number
}
