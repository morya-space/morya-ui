import type { WiSizeInput } from '../../shared/types'

export type SelectButtonValue = string | number | boolean

export interface SelectButtonOption {
  label: string
  value: SelectButtonValue
  disabled?: boolean
}

export interface SelectButtonProps {
  modelValue?: SelectButtonValue | SelectButtonValue[]
  options: SelectButtonOption[]
  multiple?: boolean
  disabled?: boolean
  invalid?: boolean
  label?: string
  size?: WiSizeInput
}

export interface SelectButtonEmits {
  (event: 'update:modelValue', value: SelectButtonValue | SelectButtonValue[] | undefined): void
}
