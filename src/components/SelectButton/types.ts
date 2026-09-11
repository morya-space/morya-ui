import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type SelectButtonValue = string | number | boolean

export interface SelectButtonOption {
  label: string
  value: SelectButtonValue
  disabled?: boolean
}

export interface SelectButtonProps {
  pt?: RootPassThrough
  modelValue?: SelectButtonValue | SelectButtonValue[]
  options: SelectButtonOption[]
  multiple?: boolean
  disabled?: boolean
  invalid?: boolean
  label?: string
  size?: MSizeInput
}

export interface SelectButtonEmits {
  (event: 'update:modelValue', value: SelectButtonValue | SelectButtonValue[] | undefined): void
}
