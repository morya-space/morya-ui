import type { RootPassThrough } from '../../shared/passThrough'
export interface MeterGroupItem {
  label: string
  value: number
  color?: string
}

export interface MeterGroupProps {
  pt?: RootPassThrough
  value: MeterGroupItem[]
  max?: number
}
