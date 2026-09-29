import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type SegmentedValue = string | number

export interface SegmentedOption {
  label: string
  value: SegmentedValue
  icon?: IconName
  disabled?: boolean
}

export type SegmentedRawOption = string | SegmentedOption

export interface SegmentedProps {
  pt?: RootPassThrough
  modelValue?: SegmentedValue
  options: SegmentedRawOption[]
  size?: MSizeInput
  block?: boolean
  disabled?: boolean
  /** Pill corners on the track and items (`shape="round"`). */
  shape?: 'default' | 'round'
  label?: string
  name?: string
}

export interface SegmentedEmits {
  (event: 'update:modelValue', value: SegmentedValue): void
}
