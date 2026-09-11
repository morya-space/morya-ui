export type ListboxValue = string | number

export interface ListboxOption {
  label: string
  value: ListboxValue
  disabled?: boolean
}

import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface ListboxProps {
  modelValue?: ListboxValue | ListboxValue[]
  options: ListboxOption[]
  multiple?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: MSizeInput
  filter?: boolean
  emptyMessage?: string
  listStyle?: string | Record<string, string>
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}

export interface ListboxEmits {
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}
