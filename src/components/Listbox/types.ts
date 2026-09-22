import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type ListboxValue = string | number

export interface ListboxOption {
  label: string
  value: ListboxValue
  disabled?: boolean
}

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
  /**
   * Virtualize the option list. Default auto-enables when there are 80+ options.
   * Pass `false` to always render the full list; `true` to always virtualize.
   */
  virtual?: boolean
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}

export interface ListboxEmits {
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}
