export type ListboxValue = string | number

export interface ListboxOption {
  label: string
  value: ListboxValue
  disabled?: boolean
}

import type { RdSizeInput } from '../../shared/types'

export interface ListboxProps {
  modelValue?: ListboxValue | ListboxValue[]
  options: ListboxOption[]
  multiple?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: RdSizeInput
  filter?: boolean
  emptyMessage?: string
  listStyle?: string | Record<string, string>
}

export interface ListboxEmits {
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}
